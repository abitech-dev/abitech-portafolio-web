import rss from "@astrojs/rss";
import type { APIRoute } from "astro";

import { datosDe, textosDe } from "@/i18n/idioma";
import { escritosPublicados } from "@/lib/coleccion-escritos";

export const GET: APIRoute = async ({ site }) => {
  const { basics } = datosDe("es");
  return rss({
    title: `${textosDe("es").secciones.escritos} de ${basics.name}`,
    description: textosDe("es").escritos.descripcion(basics.name),
    site: site ?? "https://abitech.dev",
    customData: "<language>es-pe</language>",
    items: (await escritosPublicados()).map((escrito) => ({
      title: escrito.data.titulo,
      description: escrito.data.descripcion,
      pubDate: escrito.data.fecha,
      link: `/escritos/${escrito.id}`,
      categories: escrito.data.etiquetas,
    })),
  });
};
