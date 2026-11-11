import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("la portada muestra el nombre y declara el español", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Abimael Fernandez Ventura",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

test("la portada trae canónica y descripción para buscadores", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://abitech.dev/",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Desarrollador full stack/,
  );
});

test("la portada no tiene violaciones de accesibilidad", async ({ page }) => {
  await page.goto("/");

  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(
    violations.filter((v) => ["serious", "critical"].includes(v.impact ?? "")),
  ).toEqual([]);
});
