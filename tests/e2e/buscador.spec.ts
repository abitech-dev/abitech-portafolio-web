import { expect, test } from "@playwright/test";

import { abrirMenuEnCelular } from "./ayudas";

test("el buscador encuentra una nota por su tema", async ({ page }) => {
  await page.goto("/buscar");
  await page.getByRole("searchbox").fill("OptiPix");

  await expect(
    page.getByRole("link", { name: /Por qué OptiPix descarga/ }),
  ).toHaveAttribute("href", "/blog/optipix-zip-de-50-imagenes");
});

test("en inglés el buscador solo muestra páginas en inglés", async ({
  page,
}) => {
  await page.goto("/en/buscar");
  await page.getByRole("searchbox").fill("OptiPix");

  const resultado = page.getByRole("link", { name: /Why OptiPix downloads/ });
  await expect(resultado).toHaveAttribute(
    "href",
    "/en/blog/optipix-zip-de-50-imagenes",
  );
  await expect(page.getByRole("link", { name: /Por qué OptiPix/ })).toHaveCount(
    0,
  );
});

test("la lupa de la barra lleva al buscador", async ({ page }) => {
  await page.goto("/");
  await abrirMenuEnCelular(page);
  await page.getByRole("link", { name: "Buscar" }).click();

  await expect(page).toHaveURL(/\/buscar$/);
  await expect(page.getByRole("searchbox")).toBeVisible();
});

test("cada resultado dice qué tipo de página es", async ({ page }) => {
  await page.goto("/buscar");
  const buscador = page.getByRole("searchbox");

  await buscador.fill("OptiPix");
  await expect(
    page.getByRole("link", { name: /Por qué OptiPix descarga/ }),
  ).toContainText("Nota");

  await buscador.fill("Hostal Pacífico");
  await expect(
    page.locator('a[href="/proyectos/hostal-pacifico"]'),
  ).toContainText("Proyecto");
});

test("el botón de borrar vacía la búsqueda y deja el foco", async ({
  page,
}) => {
  await page.goto("/buscar");
  const buscador = page.getByRole("searchbox");
  await buscador.fill("OptiPix");

  await page.getByRole("button", { name: "Borrar la búsqueda" }).click();

  await expect(buscador).toHaveValue("");
  await expect(buscador).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Borrar la búsqueda" }),
  ).toHaveCount(0);
});

test("sin resultados ofrece temas para buscar con un toque", async ({
  page,
}) => {
  await page.goto("/buscar");
  const buscador = page.getByRole("searchbox");
  const temas = page.getByRole("group", { name: "Temas frecuentes" });
  await expect(temas.getByRole("button", { name: "Laravel" })).toBeVisible();

  await buscador.fill("zzqqxx");
  await expect(page.getByText("No encontré nada para «zzqqxx»")).toBeVisible();

  await temas.getByRole("button", { name: "Laravel" }).click();
  await expect(buscador).toHaveValue("Laravel");
  await expect(
    page.getByRole("link", { name: /Hostal Pacífico/ }),
  ).toBeVisible();
  await expect(temas).toHaveCount(0);
});

test("lo escrito antes de que cargue la página no se pierde", async ({
  page,
}) => {
  await page.route("**/_astro/*.js", async (ruta) => {
    await new Promise((listo) => setTimeout(listo, 1500));
    await ruta.continue();
  });
  await page.goto("/buscar", { waitUntil: "domcontentloaded" });
  await page.getByRole("searchbox").fill("OptiPix");

  await expect(
    page.getByRole("link", { name: /Por qué OptiPix descarga/ }),
  ).toBeVisible({ timeout: 10_000 });
});

test("lo escrito mientras carga el índice se busca al terminar", async ({
  page,
}) => {
  await page.route("**/pagefind/pagefind.js", async (ruta) => {
    await new Promise((listo) => setTimeout(listo, 1500));
    await ruta.continue();
  });
  await page.goto("/buscar");
  await page.getByRole("searchbox").pressSequentially("OptiPix");

  await expect(
    page.getByRole("link", { name: /Por qué OptiPix descarga/ }),
  ).toBeVisible({ timeout: 10_000 });
});

// Pagefind lee el HTML sin CSS y une los elementos que no llevan espacio.
test("el índice separa los datos que en pantalla van aparte", async ({
  page,
}) => {
  await page.goto("/buscar");
  const casos = [
    ["Universidad", "/proyectos/banco-necesidades", "2024 Universidad"],
    ["payments", "/codigo-abierto/payments-laravel", "PHP 8.2+"],
    ["payments", "/codigo-abierto/payments-laravel", "licencia MIT"],
    ["actas", "/blog/actas-sin-senal-sin-duplicados", "2026 2 min"],
    ["peras", "/aprende/contenedores-con-peras-y-manzanas", "Libro En"],
    ["Interbank", "/cv", "PDF English version"],
  ] as const;

  const contenidos = await page.evaluate(async (pedidos) => {
    interface Pagefind {
      search: (termino: string) => Promise<{
        results: { data: () => Promise<{ url: string; content: string }> }[];
      }>;
    }
    const modulo = "/pagefind/pagefind.js";
    const pagefind = (await import(/* @vite-ignore */ modulo)) as Pagefind;
    return Promise.all(
      pedidos.map(async ([termino, ruta]) => {
        const { results } = await pagefind.search(termino);
        const datos = await Promise.all(results.map((r) => r.data()));
        const pagina = datos.find((d) => d.url.replace(/\/$/, "") === ruta);
        return pagina?.content ?? "";
      }),
    );
  }, casos);

  casos.forEach(([, ruta, esperado], indice) => {
    expect(contenidos[indice], ruta).toContain(esperado);
  });
});
