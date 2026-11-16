import { expect, test } from "@playwright/test";

const ROLES = /Desarrollador único|Desarrollador principal|Líder de un equipo/;

test("cada proyecto dice el rol que tuvo, en una línea", async ({ page }) => {
  await page.goto("/proyectos/tu-coach");
  await expect(page.getByText("Desarrollador único")).toBeVisible();

  await page.goto("/en/proyectos/yachacuy");
  await expect(page.getByText("Led a team of 5")).toBeVisible();
});

test("un proyecto sin rol anotado no inventa uno", async ({ page }) => {
  await page.goto("/proyectos/optipix");
  await expect(page.getByText(ROLES)).toHaveCount(0);
});
