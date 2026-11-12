import type { Idioma } from "@/i18n/rutas";
import type { Resume } from "@/lib/trayectoria";

export type Nodo = Record<string, unknown>;

export function idDeLaPersona(sitio: URL): string {
  return new URL("/#persona", sitio).href;
}

function idDelSitio(sitio: URL): string {
  return new URL("/#sitio", sitio).href;
}

/** Sitio y persona van en toda página; los demás nodos los citan por `@id`. */
export function grafo(
  datos: Resume,
  sitio: URL,
  idioma: Idioma,
  nodos: readonly Nodo[] = [],
): Nodo {
  const { basics, work, education, skills, languages } = datos;
  const [actual] = work;
  const instituciones = [...new Set(education.map((e) => e.institution))];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": idDelSitio(sitio),
        url: sitio.href,
        name: basics.name,
        inLanguage: idioma,
        publisher: { "@id": idDeLaPersona(sitio) },
      },
      {
        "@type": "Person",
        "@id": idDeLaPersona(sitio),
        name: basics.name,
        jobTitle: basics.label,
        description: basics.summary,
        email: `mailto:${basics.email}`,
        url: sitio.href,
        address: {
          "@type": "PostalAddress",
          addressLocality: basics.location.city,
          addressCountry: "PE",
        },
        sameAs: basics.profiles.map((perfil) => perfil.url),
        ...(actual
          ? { worksFor: { "@type": "Organization", name: actual.name } }
          : {}),
        alumniOf: instituciones.map((nombre) => ({
          "@type": "EducationalOrganization",
          name: nombre,
        })),
        knowsAbout: skills.map((habilidad) => habilidad.name),
        knowsLanguage: languages.map((lengua) => lengua.language),
      },
      ...nodos,
    ],
  };
}

/** Libro de schema.org, escrito en español sea cual sea la página. */
export function libro(
  publicacion: Resume["publications"][number],
  sitio: URL,
): Nodo {
  return {
    "@type": "Book",
    name: publicacion.name,
    description: publicacion.summary,
    author: { "@id": idDeLaPersona(sitio) },
    inLanguage: "es",
  };
}

/** Un escrito como artículo de blog, firmado por la persona del sitio. */
export function articulo(
  datos: {
    titulo: string;
    descripcion: string;
    fecha: Date;
    actualizado?: Date | undefined;
    etiquetas: string[];
  },
  sitio: URL,
  pagina: URL,
): Nodo {
  return {
    "@type": "BlogPosting",
    "@id": `${pagina.href}#articulo`,
    headline: datos.titulo,
    description: datos.descripcion,
    datePublished: datos.fecha.toISOString(),
    dateModified: (datos.actualizado ?? datos.fecha).toISOString(),
    keywords: datos.etiquetas.join(", "),
    inLanguage: "es",
    url: pagina.href,
    author: { "@id": idDeLaPersona(sitio) },
    isPartOf: { "@id": new URL("/#sitio", sitio).href },
  };
}

/** Un proyecto como obra creativa, con sus tecnologías como palabras clave. */
export function proyecto(
  datos: Resume["projects"][number],
  sitio: URL,
  pagina: URL,
): Nodo {
  return {
    "@type": "CreativeWork",
    "@id": `${pagina.href}#proyecto`,
    name: datos.name,
    description: datos.description,
    url: pagina.href,
    keywords: datos.keywords.join(", "),
    creator: { "@id": idDeLaPersona(sitio) },
    ...(datos.url ? { sameAs: datos.url } : {}),
  };
}
