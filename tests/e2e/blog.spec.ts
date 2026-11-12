import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { abrirMenuEnCelular } from "./ayudas";

const ARTICULO = "/blog/como-construi-mi-sitio";

test("el menú lleva al blog y la lista enlaza el artículo", async ({
  page,
}) => {
  await page.goto("/");
  await abrirMenuEnCelular(page);
  await page
    .getByRole("navigation", { name: "Secciones" })
    .getByRole("link", { name: "Blog" })
    .click();

  await expect(page).toHaveURL(/\/blog$/);
  await page
    .getByRole("link", { name: "Cómo construí mi sitio con Astro" })
    .click();
  await expect(page).toHaveURL(new RegExp(`${ARTICULO}$`));
});

test("el artículo tiene su título, datos de artículo y es accesible", async ({
  page,
}) => {
  await page.goto(ARTICULO);

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Cómo construí mi sitio/,
  );
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  expect(jsonLd).toContain('"@type":"BlogPosting"');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/og\/blog\.jpg$/,
  );
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    violations.filter((v) => ["serious", "critical"].includes(v.impact ?? "")),
  ).toEqual([]);
});

test("cada etiqueta tiene su página y el RSS lista el artículo", async ({
  page,
  request,
}) => {
  await page.goto(ARTICULO);
  await page.getByRole("link", { name: "#astro" }).first().click();

  await expect(page).toHaveURL(/\/blog\/etiquetas\/astro$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("#astro");

  const rss = await (await request.get("/blog/rss.xml")).text();
  expect(rss).toContain("<title>Cómo construí mi sitio con Astro");
  expect(rss).toContain(`https://abitech.dev${ARTICULO}`);
});
