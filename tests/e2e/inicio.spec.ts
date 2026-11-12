import { expect, test } from "@playwright/test";

import { abrirMenuEnCelular } from "./ayudas";

test("la portada saluda y muestra los proyectos destacados", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Hola, soy Abimael",
  );
  await expect(
    page.getByRole("heading", { name: "Proyectos destacados" }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(4);
});

test("la portada declara la persona en el grafo para buscadores", async ({
  page,
}) => {
  await page.goto("/");

  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .textContent();

  const { "@graph": grafo } = JSON.parse(jsonLd ?? "{}") as {
    "@graph": Record<string, unknown>[];
  };

  expect(grafo).toContainEqual(
    expect.objectContaining({
      "@type": "Person",
      "@id": "https://abitech.dev/#persona",
      name: "Abimael Fernandez Ventura",
    }),
  );
});

test("el botón de tema cambia y recuerda el modo", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await abrirMenuEnCelular(page);
  const boton = page.getByRole("button", { name: "Tema oscuro" });
  await expect(
    page.locator("astro-island", { has: boton }),
  ).not.toHaveAttribute("ssr");

  await boton.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();

  await expect(page.locator("html")).toHaveClass(/dark/);
});
