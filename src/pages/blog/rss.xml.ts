import rss from "@astrojs/rss";
import type { APIRoute } from "astro";

import { datosDe, textosDe } from "@/i18n/idioma";
import { escritosPublicados } from "@/lib/coleccion-escritos";
import { nombreCorto } from "@/lib/trayectoria";

export const GET: APIRoute = async ({ site }) => {
  const { basics } = datosDe("es");
  return rss({
    title: `${textosDe("es").secciones.escritos} de ${nombreCorto(basics.name)}`,
    description: textosDe("es").escritos.descripcion(basics.name),
    site: site ?? "https://abitech.dev",
    customData: "<language>es-pe</language>",
    items: (await escritosPublicados()).map((escrito) => ({
      title: escrito.data.titulo,
      description: escrito.data.descripcion,
      pubDate: escrito.data.fecha,
      link: `/blog/${escrito.id}`,
      categories: escrito.data.etiquetas,
    })),
  });
};
