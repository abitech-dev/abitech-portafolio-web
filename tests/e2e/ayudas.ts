import type { Page } from "@playwright/test";

/** En el celular el menú está plegado tras el botón «Menú» o «Menu». */
export async function abrirMenuEnCelular(page: Page): Promise<void> {
  const boton = page.getByRole("button", { name: /^(Menú|Menu)$/ });
  if (await boton.isVisible()) await boton.click();
}
