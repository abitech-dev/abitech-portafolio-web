import { esPaquete, type Resume } from "@/lib/trayectoria";

/** Formato de https://llmstxt.org, con título, resumen y listas de enlaces. */
export function llmsTxt(datos: Resume, sitio: URL): string {
  const { basics, projects, publications } = datos;
  const url = (ruta: string) => new URL(ruta, sitio).href;
  const enlace = (nombre: string, destino: string, nota?: string) =>
    `- [${nombre}](${destino})${nota ? `: ${nota}` : ""}`;
  const paquetes = projects.filter(esPaquete);
  const aplicaciones = projects.filter((p) => !esPaquete(p));

  return [
    `# ${basics.name}`,
    "",
    `> ${basics.label}. ${basics.summary}`,
    "",
    `Vive en ${basics.location.city}, Perú, y trabaja en remoto. Correo ${basics.email}.`,
    "",
    "## Páginas",
    "",
    enlace(
      "CV",
      url("/cv"),
      "experiencia, formación, certificaciones y habilidades",
    ),
    enlace("CV en PDF", url("/descargas/cv-abimael-fernandez-ventura.pdf")),
    enlace(
      "Proyectos",
      url("/proyectos"),
      "casos con resultados y tecnologías",
    ),
    enlace("Código abierto", url("/codigo-abierto"), "paquetes para Laravel"),
    enlace("Sobre mí", url("/sobre-mi")),
    enlace("Contacto", url("/contacto")),
    "",
    "## Proyectos",
    "",
    ...aplicaciones.map((p) =>
      enlace(p.name, url(`/proyectos/${p.id}`), p.description),
    ),
    "",
    "## Código abierto",
    "",
    ...paquetes.map((p) =>
      enlace(
        p.name,
        "repository" in p && p.repository
          ? p.repository
          : url("/codigo-abierto"),
        p.description,
      ),
    ),
    "",
    "## Libros",
    "",
    ...publications.map((libro) =>
      enlace(libro.name, url("/aprende"), libro.summary),
    ),
    "",
    "## Optional",
    "",
    enlace("English version", url("/en")),
    enlace(
      "Resume in English (PDF)",
      url("/descargas/resume-abimael-fernandez-ventura.pdf"),
    ),
    ...basics.profiles.map((perfil) => enlace(perfil.network, perfil.url)),
    "",
  ].join("\n");
}
