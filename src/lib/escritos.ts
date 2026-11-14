import type { Idioma } from "@/i18n/rutas";
import { slugDe } from "@/lib/trayectoria";

export interface Escrito {
  id: string;
  body?: string | undefined;
  data: {
    titulo: string;
    descripcion: string;
    fecha: Date;
    tipo: "articulo" | "nota";
    etiquetas: string[];
    borrador: boolean;
  };
}

const PALABRAS_POR_MINUTO = 200;

/** Cada escrito vive en la carpeta de su idioma, como «es/mi-entrada». */
export function idiomaDelEscrito(escrito: { id: string }): Idioma {
  return escrito.id.startsWith("en/") ? "en" : "es";
}

/** La traducción comparte el nombre del archivo en la otra carpeta. */
export function slugDelEscrito(escrito: { id: string }): string {
  return escrito.id.replace(/^(es|en)\//, "");
}

export function minutosDeLectura(texto: string): number {
  const palabras = texto.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(palabras / PALABRAS_POR_MINUTO));
}

/** En producción se omiten los borradores; los más recientes van primero. */
export function publicados<T extends Escrito>(
  escritos: readonly T[],
  isDesarrollo: boolean,
): T[] {
  return escritos
    .filter((escrito) => isDesarrollo || !escrito.data.borrador)
    .sort((a, b) => b.data.fecha.getTime() - a.data.fecha.getTime());
}

/** Cada etiqueta con su número de escritos, de la más usada a la menos. */
export function etiquetasDe(escritos: readonly Escrito[]): [string, number][] {
  const usos = new Map<string, number>();
  for (const escrito of escritos) {
    for (const etiqueta of escrito.data.etiquetas) {
      usos.set(etiqueta, (usos.get(etiqueta) ?? 0) + 1);
    }
  }
  return [...usos].sort(([a, x], [b, y]) => y - x || a.localeCompare(b, "es"));
}

export function idDeEtiqueta(etiqueta: string): string {
  return slugDe(etiqueta);
}
