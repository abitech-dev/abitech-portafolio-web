import { getEntry } from "astro:content";

import { datosDe } from "@/i18n/idioma";
import type { Idioma } from "@/i18n/rutas";
import { slugDe } from "@/lib/trayectoria";

/** Cada publicación de resume.json con su temario; sin archivo, falla el build. */
export async function materialesDeAprende(idioma: Idioma) {
  return Promise.all(
    datosDe(idioma).publications.map(async (publicacion) => {
      const id = slugDe(publicacion.name);
      const detalle = await getEntry("aprende", id);
      if (!detalle) {
        throw new Error(`Falta src/content/aprende/${id}.yaml.`);
      }
      return { id, publicacion, detalle: detalle.data };
    }),
  );
}
