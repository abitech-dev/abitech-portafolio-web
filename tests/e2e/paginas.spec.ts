import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGINAS = [
  { ruta: "/", titulo: "Abimael Fernandez Ventura" },
  { ruta: "/sobre-mi", titulo: "Sobre mí | Abimael Fernandez Ventura" },
  { ruta: "/cv", titulo: "CV | Abimael Fernandez Ventura" },
  { ruta: "/contacto", titulo: "Contacto | Abimael Fernandez Ventura" },
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

  await page
    .getByRole("navigation", { name: "Secciones" })
    .getByRole("link", { name: "CV" })
    .click();

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
