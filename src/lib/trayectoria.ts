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
