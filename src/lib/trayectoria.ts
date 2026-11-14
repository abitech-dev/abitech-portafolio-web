import type resume from "@/data/resume.json";

export type Resume = typeof resume;
export type Proyecto = Resume["projects"][number];
export type Habilidad = Resume["skills"][number];

/** Respeta el orden pedido y omite los ids que no son públicos. */
export function proyectosPorId(
  datos: Resume,
  ids: readonly string[],
): Proyecto[] {
  const porId = new Map(datos.projects.map((p) => [p.id, p]));
  return ids.flatMap((id) => porId.get(id) ?? []);
}

/** En minúsculas, sin tildes y con guiones, apto para una URL. */
export function slugDe(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Avanzado vale 3, intermedio 2 y lo demás 1, en español o en inglés. */
export function nivelDe(nivel: string): 1 | 2 | 3 {
  const texto = nivel.toLowerCase();
  if (/avanzado|advanced|experto|expert/.test(texto)) return 3;
  if (/intermedio|intermediate/.test(texto)) return 2;
  return 1;
}

/** Las frases van con mayúscula; marcas como jQuery quedan como son. */
export function conMayuscula(nombre: string): string {
  const isFrase = nombre.includes(" ") && /^\p{Ll}/u.test(nombre);
  return isFrase ? nombre.charAt(0).toUpperCase() + nombre.slice(1) : nombre;
}

/** En el sitio va nombre y primer apellido; el completo queda en el CV. */
export function nombreCorto(nombre: string): string {
  return nombre.split(/\s+/).slice(0, 2).join(" ");
}

/** Los paquetes van en Código abierto y no se repiten en Proyectos. */
export function esPaquete(proyecto: Proyecto): boolean {
  return proyecto.type === "library";
}

/** Agrupa por la primera palabra clave, que es la categoría del CV. */
export function habilidadesPorCategoria(
  habilidades: readonly Habilidad[],
): Map<string, Habilidad[]> {
  const grupos = new Map<string, Habilidad[]>();
  for (const habilidad of habilidades) {
    const categoria = habilidad.keywords[0] ?? "Otras";
    grupos.set(categoria, [...(grupos.get(categoria) ?? []), habilidad]);
  }
  return grupos;
}

/** «Laravel 12» e «Inertia 1 SSR» se agrupan como «Laravel» e «Inertia». */
export function tecnologiaBase(tecnologia: string): string {
  const palabras = tecnologia
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/);
  const corte = palabras.findIndex((palabra) => /^\d/.test(palabra));
  return (corte === -1 ? palabras : palabras.slice(0, corte)).join(" ");
}

/** Las que aparecen en al menos `minimo` proyectos, de la más usada a la menos. */
export function tecnologiasFrecuentes(
  proyectos: readonly { keywords: readonly string[] }[],
  minimo: number,
): string[] {
  const usos = new Map<string, number>();
  for (const proyecto of proyectos) {
    for (const tecnologia of new Set(proyecto.keywords.map(tecnologiaBase))) {
      usos.set(tecnologia, (usos.get(tecnologia) ?? 0) + 1);
    }
  }
  return [...usos]
    .filter(([, veces]) => veces >= minimo)
    .sort(([a, x], [b, y]) => y - x || a.localeCompare(b, "es"))
    .map(([tecnologia]) => tecnologia);
}
