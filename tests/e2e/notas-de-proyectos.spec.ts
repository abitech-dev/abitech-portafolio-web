import { expect, test } from "@playwright/test";

test("el proyecto enlaza la nota que cuenta cómo se resolvió", async ({
  page,
}) => {
  await page.goto("/proyectos/optipix");

  await expect(
    page.getByRole("link", { name: /Por qué OptiPix descarga/ }),
  ).toHaveAttribute("href", "/blog/optipix-zip-de-50-imagenes");
});

test("la nota enlaza su proyecto", async ({ page }) => {
  await page.goto("/en/blog/actas-sin-senal-sin-duplicados");

  await expect(
    page.getByRole("link", { name: /Offline maintenance reports PWA/ }),
  ).toHaveAttribute(
    "href",
    "/en/proyectos/pwa-offline-de-actas-de-mantenimiento",
  );
});

test("cada libro tiene su propia imagen para compartir", async ({
  page,
  request,
}) => {
  const ruta = "/aprende/contenedores-con-peras-y-manzanas";
  await page.goto(ruta);

  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    `https://abitech.dev/og${ruta}.jpg`,
  );
  expect((await request.get(`/og${ruta}.jpg`)).status()).toBe(200);
});
