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
  return etiqueta
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
