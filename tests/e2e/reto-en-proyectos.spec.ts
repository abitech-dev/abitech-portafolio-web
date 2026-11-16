import { expect, test } from "@playwright/test";

test("un caso de estudio cuenta el reto antes de los resultados", async ({
  page,
}) => {
  await page.goto("/proyectos/tu-coach");
  const reto = page.getByRole("heading", { name: "El reto" });
  const resultados = page.getByRole("heading", { name: "Resultados" });

  await expect(reto).toBeVisible();
  await expect(
    page.getByText(/necesitaban formarse en investigación/),
  ).toBeVisible();
  const [y1, y2] = await Promise.all([
    reto.evaluate((e) => e.getBoundingClientRect().top),
    resultados.evaluate((e) => e.getBoundingClientRect().top),
  ]);
  expect(y1).toBeLessThan(y2);

  await page.goto("/en/proyectos/optipix");
  await expect(
    page.getByRole("heading", { name: "The challenge" }),
  ).toBeVisible();
});

test("un proyecto sin reto no muestra la sección", async ({ page }) => {
  await page.goto("/proyectos/sigep");
  await expect(page.getByRole("heading", { name: "El reto" })).toHaveCount(0);
});
