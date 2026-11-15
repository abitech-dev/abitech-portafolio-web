import { expect, test } from "@playwright/test";

const NOTA = "/blog/optipix-zip-de-50-imagenes";

test("cada nota tiene su propia imagen para compartir", async ({
  page,
  request,
}) => {
  await page.goto(NOTA);
  const imagen = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(imagen).toBe(`https://abitech.dev/og${NOTA}.jpg`);

  const respuesta = await request.get(`/og${NOTA}.jpg`);
  expect(respuesta.status()).toBe(200);
  expect(respuesta.headers()["content-type"]).toBe("image/jpeg");
});

for (const ruta of [
  NOTA,
  "/proyectos/tu-coach",
  "/codigo-abierto/payments-laravel",
  "/aprende/contenedores-con-peras-y-manzanas",
  "/en/blog/optipix-zip-de-50-imagenes",
]) {
  test(`${ruta} se comparte en las redes acordadas`, async ({ page }) => {
    await page.goto(ruta);
    const direccion = encodeURIComponent(`https://abitech.dev${ruta}`);
    const fila = page.getByRole("list", { name: /Compartir|Share/ });

    for (const red of ["LinkedIn", "WhatsApp", "X", "Facebook"]) {
      const enlace = fila.getByRole("link", { name: new RegExp(`${red}$`) });
      await expect(enlace).toHaveAttribute("href", new RegExp(direccion));
      await expect(enlace).toHaveAttribute("target", "_blank");
    }
    await expect(fila.getByRole("link")).toHaveCount(4);
    await expect(page.getByText(/Telegram/)).toHaveCount(0);
  });
}

test("copiar enlace deja la dirección de la página", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Permiso de portapapeles de Chromium");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(NOTA);
  const boton = page.getByRole("button", { name: "Copiar enlace" });
  await expect(
    page.locator("astro-island").filter({ has: boton }),
  ).not.toHaveAttribute("ssr");

  await boton.click();

  await expect(
    page.getByRole("button", { name: "Enlace copiado" }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    `https://abitech.dev${NOTA}`,
  );
});

test("las listas y las páginas de perfil no llevan la fila", async ({
  page,
}) => {
  for (const ruta of [
    "/blog",
    "/proyectos",
    "/aprende",
    "/codigo-abierto",
    "/cv",
    "/sobre-mi",
  ]) {
    await page.goto(ruta);
    await expect(
      page.getByRole("list", { name: "Compartir en redes" }),
      ruta,
    ).toHaveCount(0);
  }
});
