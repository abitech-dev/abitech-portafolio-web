import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("el filtro deja solo los proyectos de una tecnología", async ({
  page,
}) => {
  await page.goto("/proyectos");
  const proyectos = page.locator("[data-tecnologias]");
  const total = await proyectos.count();

  await page.getByRole("button", { name: "Laravel", exact: true }).click();

  const visibles = page.locator("[data-tecnologias]:visible");
  await expect(visibles).not.toHaveCount(total);
  for (const tecnologias of await visibles.evaluateAll((items) =>
    items.map((item) => item.getAttribute("data-tecnologias") ?? ""),
  )) {
    expect(tecnologias.split("|")).toContain("Laravel");
  }
  await expect(
    page.getByRole("button", { name: "Laravel", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("«Todos» vuelve a mostrar la lista completa", async ({ page }) => {
  await page.goto("/proyectos");
  const total = await page.locator("[data-tecnologias]").count();

  await page.getByRole("button", { name: "Laravel", exact: true }).click();
  await page.getByRole("button", { name: "Todos" }).click();

  await expect(page.locator("[data-tecnologias]:visible")).toHaveCount(total);
});

test("cada proyecto tiene su página con resultados y tecnologías", async ({
  page,
}) => {
  await page.goto("/proyectos");

  await page.getByRole("link", { name: "Tu Coach UDH", exact: true }).click();

  await expect(page).toHaveURL(/\/proyectos\/tu-coach$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Tu Coach UDH",
  );
  await expect(page.getByRole("heading", { name: "Resultados" })).toBeVisible();
  await expect(page.getByText("8800 usuarios")).toBeVisible();
});

test("la página de un proyecto no tiene violaciones de accesibilidad", async ({
  page,
}) => {
  await page.goto("/proyectos/tu-coach");

  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(
    violations.filter((v) => ["serious", "critical"].includes(v.impact ?? "")),
  ).toEqual([]);
});

test("los paquetes van en Código abierto y no en Proyectos", async ({
  page,
}) => {
  await page.goto("/proyectos");
  await expect(
    page.getByRole("link", { name: "abitech-payments-laravel" }),
  ).toHaveCount(0);

  await page.goto("/codigo-abierto");
  const paquetes = page.getByRole("article");

  await expect(paquetes).toHaveCount(2);
  await expect(
    paquetes.first().getByRole("link", { name: /Ver en GitHub/ }),
  ).toHaveAttribute("href", /^https:\/\/github\.com\/abitech-dev\//);
});
