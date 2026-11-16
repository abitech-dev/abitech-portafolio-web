import { expect, test } from "@playwright/test";

const CASOS = [
  {
    lista: "/proyectos",
    detalle: "/proyectos/hostal-pacifico",
    volver: "Todos los proyectos",
    id: "hostal-pacifico",
  },
  {
    lista: "/blog",
    detalle: "/blog/como-construi-mi-sitio",
    volver: "Volver al blog",
    id: "como-construi-mi-sitio",
  },
  {
    lista: "/codigo-abierto",
    detalle: "/codigo-abierto/antibot-laravel",
    volver: "Todo el código abierto",
    id: "antibot-laravel",
  },
  {
    lista: "/aprende",
    detalle: "/aprende/contenedores-con-peras-y-manzanas",
    volver: "Volver a Aprende",
    id: "contenedores-con-peras-y-manzanas",
  },
];

for (const { lista, detalle, volver, id } of CASOS) {
  test(`volver desde ${detalle} deja el elemento a la vista`, async ({
    page,
  }) => {
    await page.goto(detalle);
    await page.getByRole("link", { name: volver }).click();

    await expect(page).toHaveURL(new RegExp(`${lista}#${id}$`));
    await expect(page.locator(`[id="${id}"]`)).toBeInViewport();
  });
}

test("el botón atrás del navegador vuelve a la misma altura", async ({
  page,
}) => {
  await page.goto("/proyectos");
  const fila = page.locator('[id="hostal-pacifico"]');
  await fila.scrollIntoViewIfNeeded();
  // Quien lee se detiene antes de tocar; el desplazamiento suave termina.
  await page.waitForFunction(
    () =>
      new Promise((listo) => {
        const altura = scrollY;
        setTimeout(() => listo(scrollY === altura), 600);
      }),
  );
  await fila.getByRole("link").click();
  await expect(page).toHaveURL(/\/proyectos\/hostal-pacifico$/);

  await page.goBack();

  await expect(fila).toBeInViewport();
});
