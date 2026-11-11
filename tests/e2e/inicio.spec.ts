import { expect, test } from "@playwright/test";

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

test("la portada declara la persona para buscadores", async ({ page }) => {
  await page.goto("/");

  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .textContent();

  expect(JSON.parse(jsonLd ?? "{}")).toMatchObject({
    "@type": "Person",
    name: "Abimael Fernandez Ventura",
  });
});

test("el botón de tema cambia y recuerda el modo", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const boton = page.getByRole("button", { name: "Tema oscuro" });
  await expect(
    page.locator("astro-island", { has: boton }),
  ).not.toHaveAttribute("ssr");

  await boton.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();

  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("con movimiento reducido el subtítulo no se anima", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const tipeo = page.locator('[data-test="tipeo"]');

  await expect(tipeo).toHaveText("Desarrollador full stack");
  await page.waitForTimeout(2500);

  await expect(tipeo).toHaveText("Desarrollador full stack");
});
