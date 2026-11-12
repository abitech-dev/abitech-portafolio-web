import { datosDe } from "@/i18n/idioma";
import { IDIOMAS, idiomaDeLaRuta, rutaEn, type Idioma } from "@/i18n/rutas";
import { SECCIONES, seccionesDe } from "@/lib/navegacion";
import { esPaquete } from "@/lib/trayectoria";

export type PaginaParaCompartir = {
  ruta: string;
  titulo: string;
  idioma: Idioma;
};

const RUTA_DE_INICIO = "/og/inicio.jpg";

function sinBarraFinal(ruta: string): string {
  return ruta.replace(/\/+$/, "") || "/";
}

function paginasDelIdioma(idioma: Idioma): PaginaParaCompartir[] {
  const datos = datosDe(idioma);
  const secciones = seccionesDe(idioma).map(({ ruta, etiqueta }, i) => ({
    ruta,
    titulo: SECCIONES[i]?.ruta === "/" ? datos.basics.label : etiqueta,
    idioma,
  }));
  const proyectos = datos.projects
    .filter((proyecto) => !esPaquete(proyecto))
    .map((proyecto) => ({
      ruta: rutaEn(idioma, `/proyectos/${proyecto.id}`),
      titulo: proyecto.name,
      idioma,
    }));
  return [...secciones, ...proyectos];
}

/** Cada sección del menú y cada caso tiene su imagen, en ambos idiomas. */
export function paginasParaCompartir(): PaginaParaCompartir[] {
  const porRuta = new Map(
    IDIOMAS.flatMap(paginasDelIdioma).map((p) => [p.ruta, p] as const),
  );
  return [...porRuta.values()];
}

export function archivoDeLaImagen(ruta: string): string {
  const limpia = sinBarraFinal(ruta);
  return limpia === "/" ? RUTA_DE_INICIO : `/og${limpia}.jpg`;
}

/** Sin imagen propia usa la de su sección, o la portada de su idioma. */
export function imagenParaCompartir(ruta: string): string {
  const limpia = sinBarraFinal(ruta);
  const conImagen = new Set(paginasParaCompartir().map((p) => p.ruta));
  const ancestro = [...conImagen]
    .filter((ruta) => ruta !== "/" && ruta !== "/en")
    .find((ruta) => limpia.startsWith(`${ruta}/`));
  const portada = rutaEn(idiomaDeLaRuta(limpia), "/");
  if (conImagen.has(limpia)) return archivoDeLaImagen(limpia);
  return archivoDeLaImagen(ancestro ?? portada);
}
