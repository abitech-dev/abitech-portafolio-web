import rss from "@astrojs/rss";

import { datosDe, textosDe } from "@/i18n/idioma";
import { rutaEn, type Idioma } from "@/i18n/rutas";
import { escritosPublicados } from "@/lib/coleccion-escritos";
import { slugDelEscrito } from "@/lib/escritos";
import { nombreCorto } from "@/lib/trayectoria";

export async function rssDelBlog(idioma: Idioma, sitio: URL | undefined) {
  const { basics } = datosDe(idioma);
  const { secciones, escritos: t } = textosDe(idioma);
  return rss({
    title: `${secciones.escritos} | ${nombreCorto(basics.name)}`,
    description: t.descripcion(basics.name),
    site: sitio ?? "https://abitech.dev",
    customData: `<language>${idioma === "es" ? "es-pe" : "en-us"}</language>`,
    items: (await escritosPublicados(idioma)).map((escrito) => ({
      title: escrito.data.titulo,
      description: escrito.data.descripcion,
      pubDate: escrito.data.fecha,
      link: rutaEn(idioma, `/blog/${slugDelEscrito(escrito)}`),
      categories: escrito.data.etiquetas,
    })),
  });
}
