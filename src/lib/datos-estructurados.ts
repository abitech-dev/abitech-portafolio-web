import type { Resume } from "@/lib/trayectoria";

/** Persona de schema.org para la portada y el CV. */
export function persona(datos: Resume, sitio: URL): Record<string, unknown> {
  const { basics } = datos;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
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
  };
}
