import { expect, test } from "@playwright/test";

const PAQUETES = [
  {
    nombre: "abitech-payments-laravel",
    ruta: "/codigo-abierto/payments-laravel",
    composer: "abitechdev/payments-laravel",
  },
  {
    nombre: "abitech-antibot-laravel",
    ruta: "/codigo-abierto/antibot-laravel",
    composer: "abitechdev/antibot-laravel",
  },
];

test("la lista lleva a la página de cada paquete", async ({ page }) => {
  await page.goto("/codigo-abierto");

  for (const { nombre, ruta } of PAQUETES) {
    await expect(page.getByRole("link", { name: nombre })).toHaveAttribute(
      "href",
      ruta,
    );
  }
  await expect(
    page.getByRole("list", { name: "Compartir en redes" }),
  ).toHaveCount(0);
});

for (const { nombre, ruta, composer } of PAQUETES) {
  test(`${ruta} tiene instalación, enlaces e imagen propia`, async ({
    page,
    request,
  }) => {
    await page.goto(ruta);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(nombre);
    await expect(page.getByText(`composer require ${composer}`)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Ver en Packagist/ }),
    ).toHaveAttribute("href", `https://packagist.org/packages/${composer}`);
    await expect(
      page.getByRole("link", { name: /Ver en GitHub/ }),
    ).toHaveAttribute("href", /^https:\/\/github\.com\/abitech-dev\//);
    await expect(
      page.getByRole("list", { name: "Compartir en redes" }),
    ).toBeVisible();

    const imagen = `/og${ruta}.jpg`;
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      `https://abitech.dev${imagen}`,
    );
    expect((await request.get(imagen)).status()).toBe(200);
  });
}

test("en inglés cada paquete tiene su página", async ({ page }) => {
  await page.goto("/en/codigo-abierto");
  await page.getByRole("link", { name: "abitech-antibot-laravel" }).click();

  await expect(page).toHaveURL(/\/en\/codigo-abierto\/antibot-laravel$/);
  await expect(
    page.getByText("composer require abitechdev/antibot-laravel"),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /View on Packagist/ }),
  ).toBeVisible();
});

test("el botón copia el comando de instalación", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Permiso de portapapeles de Chromium");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/codigo-abierto/payments-laravel");
  const boton = page.getByRole("button", { name: "Copiar el comando" });
  await expect(
    page.locator("astro-island").filter({ has: boton }),
  ).not.toHaveAttribute("ssr");

  await boton.click();

  await expect(
    page.getByRole("button", { name: "Comando copiado" }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "composer require abitechdev/payments-laravel",
  );
});

test("la página del paquete no se desborda en el celular", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/codigo-abierto/payments-laravel");

  const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(ancho).toBeLessThanOrEqual(360);
});

test("el comando de instalación entra sin barra de desplazamiento", async ({
  page,
}) => {
  await page.goto("/codigo-abierto/payments-laravel");
  const comando = page.getByText(
    "composer require abitechdev/payments-laravel",
  );

  const desborde = await comando.evaluate(
    (elemento) => elemento.scrollWidth - elemento.clientWidth,
  );
  expect(desborde).toBeLessThanOrEqual(0);
});
