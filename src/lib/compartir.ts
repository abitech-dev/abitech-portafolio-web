import { datosDe } from "@/i18n/idioma";
import { IDIOMAS, idiomaDeLaRuta, rutaEn, type Idioma } from "@/i18n/rutas";
import { SECCIONES, seccionesDe } from "@/lib/navegacion";
import { esPaquete } from "@/lib/trayectoria";

export type PaginaParaCompartir = {
  ruta: string;
  titulo: string;
  idioma: Idioma;
};

const RUTA_DE_INICIO = "/og/inicio.png";

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
  return IDIOMAS.flatMap(paginasDelIdioma);
}

export function archivoDeLaImagen(ruta: string): string {
  const limpia = sinBarraFinal(ruta);
  return limpia === "/" ? RUTA_DE_INICIO : `/og${limpia}.png`;
}

/** Una página sin imagen propia, como la 404, usa la portada de su idioma. */
export function imagenParaCompartir(ruta: string): string {
  const limpia = sinBarraFinal(ruta);
  const tieneImagen = paginasDelIdioma(idiomaDeLaRuta(limpia)).some(
    (pagina) => pagina.ruta === limpia,
  );
  const portada = rutaEn(idiomaDeLaRuta(limpia), "/");
  return archivoDeLaImagen(tieneImagen ? limpia : portada);
}
