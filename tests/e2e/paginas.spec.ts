import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { abrirMenuEnCelular } from "./ayudas";

const PAGINAS = [
  { ruta: "/", titulo: "Abimael Fernandez" },
  {
    ruta: "/sobre-mi",
    titulo: "Sobre mí | Abimael Fernandez",
  },
  { ruta: "/cv", titulo: "CV | Abimael Fernandez" },
  {
    ruta: "/contacto",
    titulo: "Contacto | Abimael Fernandez",
  },
  {
    ruta: "/proyectos",
    titulo: "Proyectos | Abimael Fernandez",
  },
  {
    ruta: "/codigo-abierto",
    titulo: "Código abierto | Abimael Fernandez",
  },
  {
    ruta: "/aprende",
    titulo: "Aprende | Abimael Fernandez",
  },
];

for (const { ruta, titulo } of PAGINAS) {
  test.describe(`página ${ruta}`, () => {
    test("tiene título, descripción, canónica y un solo h1", async ({
      page,
    }) => {
      await page.goto(ruta);

      await expect(page).toHaveTitle(titulo);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        /.{40,}/,
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        ruta === "/" ? "https://abitech.dev/" : `https://abitech.dev${ruta}`,
      );
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", "es");
    });

    test("marca su sección como actual en el menú", async ({ page }) => {
      await page.goto(ruta);
      await abrirMenuEnCelular(page);

      const actual = page
        .getByRole("navigation", { name: "Secciones" })
        .locator('[aria-current="page"]');

      await expect(actual).toHaveCount(1);
      await expect(actual).toHaveAttribute("href", ruta);
    });

    test("no tiene violaciones de accesibilidad", async ({ page }) => {
      await page.goto(ruta);

      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();

      expect(
        violations.filter((v) =>
          ["serious", "critical"].includes(v.impact ?? ""),
        ),
      ).toEqual([]);
    });
  });
}

test("el menú lleva de una sección a otra", async ({ page }) => {
  await page.goto("/");
  await abrirMenuEnCelular(page);

  await page
    .getByRole("navigation", { name: "Secciones" })
    .getByRole("link", { name: "Código abierto" })
    .click();

  await expect(page).toHaveURL(/\/codigo-abierto$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Código abierto",
  );
  // En el celular el menú ya se cerró, así que se busca también oculto.
  const menu = page.locator('nav[aria-label="Secciones"]');
  await expect(menu.locator('[aria-current="page"]')).toHaveAttribute(
    "href",
    "/codigo-abierto",
  );
  await expect(menu.locator('[aria-current="page"]')).toHaveCount(1);
});

test("el CV se abre desde Sobre mí", async ({ page }) => {
  await page.goto("/sobre-mi");

  await page.getByRole("link", { name: "Ver mi CV" }).click();

  await expect(page).toHaveURL(/\/cv$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Currículum",
  );
});

test("una ruta que no existe responde con la página 404", async ({ page }) => {
  const respuesta = await page.goto("/no-existe");

  expect(respuesta?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Esta página no existe",
  );
});

test("el CV en PDF se descarga desde su página", async ({ page }) => {
  await page.goto("/cv");

  const descarga = page.waitForEvent("download");
  await page.getByRole("link", { name: "Descargar CV en PDF" }).click();

  expect((await descarga).suggestedFilename()).toBe(
    "CV - Abimael Fernandez Ventura.pdf",
  );
});

test.describe("en el celular", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("el menú se abre, se cierra con Escape y tras navegar", async ({
    page,
  }) => {
    await page.goto("/");
    const boton = page.getByRole("button", { name: "Menú" });
    const menu = page.getByRole("navigation", { name: "Secciones" });

    await expect(menu).toBeHidden();
    await boton.click();
    await expect(boton).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(boton).toBeFocused();

    await boton.click();
    await menu.getByRole("link", { name: "CV" }).click();
    await expect(page).toHaveURL(/\/cv$/);
    await expect(menu).toBeHidden();
    await expect(boton).toHaveAttribute("aria-expanded", "false");
  });

  test("el menú cubre la pantalla, bloquea el fondo y se cierra", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menú" }).click();

    const menu = page.locator("#menu-movil");
    const caja = await menu.boundingBox();
    expect(caja?.height).toBeGreaterThanOrEqual(800);
    await expect(page.locator("#contenido")).toHaveAttribute("inert", "");
    await expect(page.getByRole("button", { name: "Cerrar" })).toBeFocused();

    await page.getByRole("button", { name: "Cerrar" }).click();
    await expect(menu).toBeHidden();
    await expect(page.locator("#contenido")).not.toHaveAttribute("inert");
    await expect(page.getByRole("button", { name: "Menú" })).toBeFocused();
  });

  test("el contenido empieza en la primera pantalla", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("link", { name: "Ver proyectos" }),
    ).toBeInViewport();
  });
});

test("ninguna página se desborda a lo ancho", async ({ page }) => {
  for (const { ruta } of PAGINAS) {
    await page.goto(ruta);
    const anchos = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      window.innerWidth,
    ]);

    expect(anchos[0], ruta).toBeLessThanOrEqual(anchos[1] ?? 0);
  }
});

test("cada página tiene una imagen para compartir que existe", async ({
  page,
  request,
}) => {
  for (const { ruta } of PAGINAS) {
    await page.goto(ruta);
    const imagen = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    const { pathname } = new URL(imagen ?? "");
    const respuesta = await request.get(pathname);

    expect(respuesta.headers()["content-type"], ruta).toBe("image/jpeg");
  }
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
});

test.describe("en una laptop de 1366 por 768", () => {
  test.use({ viewport: { width: 1366, height: 768 } });

  test("la barra lateral entra sin scroll propio", async ({ page }) => {
    await page.goto("/");
    const barra = page.locator("aside");
    const [total, visible] = await barra.evaluate((e) => [
      e.scrollHeight,
      e.clientHeight,
    ]);

    expect(total).toBeLessThanOrEqual(visible);
  });
});
