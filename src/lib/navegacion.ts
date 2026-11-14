import { textosDe } from "@/i18n/idioma";
import { rutaEn, type Idioma } from "@/i18n/rutas";
import type { Textos } from "@/i18n/textos";

export interface Enlace {
  ruta: string;
  etiqueta: string;
  icono: string;
  isDestacado?: boolean;
}

interface Seccion {
  ruta: string;
  clave: keyof Textos["secciones"];
  icono: string;
  isDestacado?: boolean;
}

/** Rutas sin prefijo de idioma, en el orden del menú. */
export const SECCIONES: readonly Seccion[] = [
  { ruta: "/", clave: "inicio", icono: "lucide:house" },
  { ruta: "/sobre-mi", clave: "sobreMi", icono: "lucide:user" },
  { ruta: "/proyectos", clave: "proyectos", icono: "lucide:folder-code" },
  { ruta: "/blog", clave: "escritos", icono: "lucide:pen-line" },
  { ruta: "/aprende", clave: "aprende", icono: "lucide:book-open" },
  { ruta: "/codigo-abierto", clave: "codigoAbierto", icono: "lucide:package" },
  { ruta: "/cv", clave: "cv", icono: "lucide:file-text" },
  {
    ruta: "/contacto",
    clave: "contacto",
    icono: "lucide:send",
    isDestacado: true,
  },
];

/** El blog solo aparece en el menú cuando hay algo publicado. */
export function seccionesDe(idioma: Idioma, hayEscritos = true): Enlace[] {
  const { secciones } = textosDe(idioma);
  return SECCIONES.filter((s) => hayEscritos || s.clave !== "escritos").map(
    ({ ruta, clave, icono, isDestacado }) => ({
      ruta: rutaEn(idioma, ruta),
      etiqueta: secciones[clave],
      icono,
      ...(isDestacado ? { isDestacado } : {}),
    }),
  );
}
