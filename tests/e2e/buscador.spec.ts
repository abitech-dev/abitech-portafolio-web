import { expect, test } from "@playwright/test";

import { abrirMenuEnCelular } from "./ayudas";

test("el buscador encuentra una nota por su tema", async ({ page }) => {
  await page.goto("/buscar");
  await page.getByRole("searchbox").fill("OptiPix");

  await expect(
    page.getByRole("link", { name: /Por qué OptiPix descarga/ }),
  ).toHaveAttribute("href", "/blog/optipix-zip-de-50-imagenes");
});

test("en inglés el buscador solo muestra páginas en inglés", async ({
  page,
}) => {
  await page.goto("/en/buscar");
  await page.getByRole("searchbox").fill("OptiPix");

  const resultado = page.getByRole("link", { name: /Why OptiPix downloads/ });
  await expect(resultado).toHaveAttribute(
    "href",
    "/en/blog/optipix-zip-de-50-imagenes",
  );
  await expect(page.getByRole("link", { name: /Por qué OptiPix/ })).toHaveCount(
    0,
  );
});

test("la lupa de la barra lleva al buscador", async ({ page }) => {
  await page.goto("/");
  await abrirMenuEnCelular(page);
  await page.getByRole("link", { name: "Buscar" }).click();

  await expect(page).toHaveURL(/\/buscar$/);
  await expect(page.getByRole("searchbox")).toBeVisible();
});
