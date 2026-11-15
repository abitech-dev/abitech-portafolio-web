import { datosDe } from "@/i18n/idioma";
import { IDIOMAS, idiomaDeLaRuta, rutaEn, type Idioma } from "@/i18n/rutas";
import { idiomaDelEscrito, slugDelEscrito, type Escrito } from "@/lib/escritos";
import { SECCIONES, seccionesDe } from "@/lib/navegacion";
import { esPaquete, slugDelPaquete } from "@/lib/trayectoria";

export type PaginaParaCompartir = {
  ruta: string;
  titulo: string;
  idioma: Idioma;
  etiquetas?: string[];
};

export type EnlaceParaCompartir = {
  red: string;
  icono: string;
  href: string;
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
  const paquetes = datos.projects.filter(esPaquete).map((paquete) => ({
    ruta: rutaEn(idioma, `/codigo-abierto/${slugDelPaquete(paquete)}`),
    titulo: paquete.name,
    idioma,
  }));
  return [...secciones, ...proyectos, ...paquetes];
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

export function paginaDelEscrito(escrito: Escrito): PaginaParaCompartir {
  const idioma = idiomaDelEscrito(escrito);
  return {
    ruta: rutaEn(idioma, `/blog/${slugDelEscrito(escrito)}`),
    titulo: escrito.data.titulo,
    idioma,
    etiquetas: escrito.data.etiquetas,
  };
}

export function paginaDelMaterial(
  material: { id: string; publicacion: { name: string } },
  idioma: Idioma,
): PaginaParaCompartir {
  return {
    ruta: rutaEn(idioma, `/aprende/${material.id}`),
    titulo: material.publicacion.name,
    idioma,
  };
}

/** Enlaces directos de cada red, sin sus scripts ni su rastreo. */
export function enlacesParaCompartir(
  url: string,
  titulo: string,
): EnlaceParaCompartir[] {
  const direccion = encodeURIComponent(url);
  return [
    {
      red: "LinkedIn",
      icono: "simple-icons:linkedin",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${direccion}`,
    },
    {
      red: "WhatsApp",
      icono: "simple-icons:whatsapp",
      href: `https://wa.me/?text=${encodeURIComponent(`${titulo} ${url}`)}`,
    },
    {
      red: "X",
      icono: "simple-icons:x",
      href: `https://x.com/intent/post?text=${encodeURIComponent(titulo)}&url=${direccion}`,
    },
    {
      red: "Facebook",
      icono: "simple-icons:facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${direccion}`,
    },
  ];
}
