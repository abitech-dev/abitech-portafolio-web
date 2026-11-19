import { expect, test, type Page } from "@playwright/test";

import { abrirMenuEnCelular } from "./ayudas";

declare global {
  interface Window {
    animacionesDeLaTransicion?:
      { capa: string; duracion: number }[] | undefined;
  }
}

/** Anota las animaciones de cada transición de vista cuando arrancan. */
async function anotarAnimaciones(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const iniciar = document.startViewTransition.bind(document);
    document.startViewTransition = ((
      ...argumentos: Parameters<typeof iniciar>
    ) => {
      const transicion = iniciar(...argumentos);
      void transicion.ready.then(() => {
        window.animacionesDeLaTransicion = document
          .getAnimations()
          .flatMap((animacion) => {
            const efecto = animacion.effect as KeyframeEffect | null;
            const capa = efecto?.pseudoElement ?? "";
            return capa.startsWith("::view-transition")
              ? [{ capa, duracion: Number(efecto?.getTiming().duration) }]
              : [];
          });
      });
      return transicion;
    }) as typeof document.startViewTransition;
  });
}

async function animacionesTras(
  page: Page,
  navegar: () => Promise<unknown>,
): Promise<{ capa: string; duracion: number }[]> {
  await page.evaluate(() => (window.animacionesDeLaTransicion = undefined));
  await navegar();
  await page.waitForFunction(() => window.animacionesDeLaTransicion);
  return page.evaluate(() => window.animacionesDeLaTransicion ?? []);
}

async function irAProyectosDesdeSobreMi(page: Page): Promise<void> {
  await page.goto("/sobre-mi");
  await abrirMenuEnCelular(page);
  await page.getByRole("link", { name: "Proyectos", exact: true }).click();
  await expect(page).toHaveURL(/\/proyectos$/);
}

// La configuración reduce el movimiento y aquí se mide la animación.
test.use({ contextOptions: { reducedMotion: "no-preference" } });

test.beforeEach(async ({ page }) => {
  await anotarAnimaciones(page);
});

test("al cambiar de página solo se funde el contenido, sin estirarse", async ({
  page,
}) => {
  await page.goto("/sobre-mi");
  await abrirMenuEnCelular(page);

  const animaciones = await animacionesTras(page, () =>
    page.getByRole("link", { name: "Proyectos", exact: true }).click(),
  );

  const capas = animaciones
    .filter(({ duracion }) => duracion > 0)
    .map(({ capa }) => capa);
  expect(capas.length).toBeGreaterThan(0);
  for (const capa of capas) {
    expect(capa).toMatch(/^::view-transition-(old|new)\((?!root\))/);
  }
});

for (const [sentido, navegar] of [
  ["atrás", (page: Page) => page.goBack()],
  ["adelante", (page: Page) => page.goForward()],
] as const) {
  test(`ir ${sentido} con el navegador cambia la página sin animación`, async ({
    page,
  }) => {
    await irAProyectosDesdeSobreMi(page);
    if (sentido === "adelante") {
      await page.goBack();
      await expect(page).toHaveURL(/\/sobre-mi$/);
    }

    const animaciones = await animacionesTras(page, () => navegar(page));

    expect(animaciones.filter(({ duracion }) => duracion > 0)).toEqual([]);
  });
}
