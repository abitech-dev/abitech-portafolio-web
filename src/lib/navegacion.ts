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

export function seccionesDe(idioma: Idioma): Enlace[] {
  const { secciones } = textosDe(idioma);
  return SECCIONES.map(({ ruta, clave, icono, isDestacado }) => ({
    ruta: rutaEn(idioma, ruta),
    etiqueta: secciones[clave],
    icono,
    ...(isDestacado ? { isDestacado } : {}),
  }));
}
