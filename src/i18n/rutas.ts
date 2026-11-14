export const IDIOMAS = ["es", "en"] as const;
export type Idioma = (typeof IDIOMAS)[number];

/** Rutas de `[...idioma]`, con el español en la raíz y el inglés en «/en». */
export function rutasPorIdioma(): { params: { idioma: string | undefined } }[] {
  return [{ params: { idioma: undefined } }, { params: { idioma: "en" } }];
}

export function idiomaDeLaRuta(ruta: string): Idioma {
  return /^\/en(\/|$)/.test(ruta) ? "en" : "es";
}

export function rutaEn(idioma: Idioma, ruta: string): string {
  if (idioma === "es") return ruta;
  return ruta === "/" ? "/en" : `/en${ruta}`;
}

export function sinIdioma(ruta: string): string {
  return ruta.replace(/\/+$/, "").replace(/^\/en(?=\/|$)/, "") || "/";
}

/** Una entrada sin traducción declarada lleva al índice del otro idioma. */
const SUBRUTA_DEL_BLOG = /^\/blog\/.+/;

export function rutaEnOtroIdioma(ruta: string): string {
  const otro = idiomaDeLaRuta(ruta) === "es" ? "en" : "es";
  const base = sinIdioma(ruta);
  return rutaEn(otro, SUBRUTA_DEL_BLOG.test(base) ? "/blog" : base);
}
