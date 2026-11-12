import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { abrirMenuEnCelular } from "./ayudas";

const PAGINAS = [
  { ruta: "/en", titulo: "Abimael Fernandez Ventura" },
  { ruta: "/en/proyectos", titulo: "Projects | Abimael Fernandez Ventura" },
  { ruta: "/en/cv", titulo: "Resume | Abimael Fernandez Ventura" },
  {
    ruta: "/en/codigo-abierto",
    titulo: "Open source | Abimael Fernandez Ventura",
  },
  { ruta: "/en/aprende", titulo: "Learn | Abimael Fernandez Ventura" },
  { ruta: "/en/sobre-mi", titulo: "About | Abimael Fernandez Ventura" },
  { ruta: "/en/contacto", titulo: "Contact | Abimael Fernandez Ventura" },
  {
    ruta: "/en/proyectos/tu-coach",
    titulo: "Tu Coach UDH | Abimael Fernandez Ventura",
  },
];

for (const { ruta, titulo } of PAGINAS) {
  test(`${ruta} está en inglés, enlaza su par y es accesible`, async ({
    page,
  }) => {
    await page.goto(ruta);

    await expect(page).toHaveTitle(titulo);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
      "href",
      `https://abitech.dev${ruta.replace(/^\/en/, "") || "/"}`,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      "en_US",
    );
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      violations.filter((v) =>
        ["serious", "critical"].includes(v.impact ?? ""),
      ),
    ).toEqual([]);
  });
}

test("la portada en inglés saluda en inglés", async ({ page }) => {
  await page.goto("/en");

  await expect(page.getByText("Hi, I'm Abimael")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /I build software/,
  );

  await page.goto("/en/cv");
  await expect(
    page.getByRole("link", { name: "Download resume (PDF)" }),
  ).toHaveAttribute("href", /resume-abimael-fernandez-ventura\.pdf$/);
});

test("el enlace de idioma lleva a la misma página y sigue al navegar", async ({
  page,
}) => {
  await page.goto("/cv");
  await abrirMenuEnCelular(page);

  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/cv$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await abrirMenuEnCelular(page);
  await page
    .getByRole("navigation", { name: "Sections" })
    .getByRole("link", { name: "Projects" })
    .click();
  await expect(page).toHaveURL(/\/en\/proyectos$/);

  await abrirMenuEnCelular(page);
  await page.getByRole("link", { name: "Español", exact: true }).click();
  await expect(page).toHaveURL(/\/proyectos$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});
