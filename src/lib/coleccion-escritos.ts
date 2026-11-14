import { getCollection } from "astro:content";

import type { Idioma } from "@/i18n/rutas";
import {
  etiquetasDe,
  idDeEtiqueta,
  idiomaDelEscrito,
  publicados,
  slugDelEscrito,
} from "@/lib/escritos";

export async function escritosPublicados(idioma: Idioma) {
  const todos = await getCollection("escritos");
  return publicados(
    todos.filter((escrito) => idiomaDelEscrito(escrito) === idioma),
    import.meta.env.DEV,
  );
}

/** Rutas de cada escrito, con aviso de si tiene traducción publicada. */
export async function rutasDeEscritos(idioma: Idioma) {
  const otro = idioma === "es" ? "en" : "es";
  const traducidos = new Set(
    (await escritosPublicados(otro)).map(slugDelEscrito),
  );
  return (await escritosPublicados(idioma)).map((escrito) => ({
    params: { slug: slugDelEscrito(escrito) },
    props: {
      escrito,
      hasTraduccion: traducidos.has(slugDelEscrito(escrito)),
    },
  }));
}

export async function rutasDeEtiquetas(idioma: Idioma) {
  const escritos = await escritosPublicados(idioma);
  return etiquetasDe(escritos).map(([etiqueta]) => ({
    params: { etiqueta: idDeEtiqueta(etiqueta) },
    props: {
      etiqueta,
      escritos: escritos.filter((e) => e.data.etiquetas.includes(etiqueta)),
    },
  }));
}
