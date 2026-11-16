import { describe, expect, it } from "vitest";

import resumeEn from "@/data/resume.en.json";
import resume from "@/data/resume.json";
import {
  archivoDeLaImagen,
  enlacesParaCompartir,
  imagenParaCompartir,
  paginaDelEscrito,
  paginaDelMaterial,
  paginasParaCompartir,
} from "@/lib/compartir";
import { SECCIONES } from "@/lib/navegacion";

describe("paginasParaCompartir", () => {
  it("incluye cada sección, cada caso y cada paquete en ambos idiomas", () => {
    const rutas = paginasParaCompartir().map((p) => p.ruta);

    for (const { ruta } of SECCIONES) {
      expect(rutas).toContain(ruta);
      expect(rutas).toContain(ruta === "/" ? "/en" : `/en${ruta}`);
    }
    expect(rutas).toContain("/en/proyectos/tu-coach");
    expect(rutas).not.toContain("/proyectos/abitech-payments");
    expect(rutas).toContain("/codigo-abierto/payments-laravel");
    expect(rutas).toContain("/en/codigo-abierto/antibot-laravel");
  });

  it("titula cada portada con el cargo en su idioma", () => {
    const portadas = paginasParaCompartir().filter((p) =>
      ["/", "/en"].includes(p.ruta),
    );

    expect(portadas.map((p) => p.titulo)).toEqual([
      resume.basics.label,
      resumeEn.basics.label,
    ]);
  });
});

describe("imagenParaCompartir", () => {
  it("usa la imagen de la página, con o sin barra final", () => {
    expect(imagenParaCompartir("/proyectos/tu-coach/")).toBe(
      "/og/proyectos/tu-coach.jpg",
    );
    expect(imagenParaCompartir("/en/cv")).toBe("/og/en/cv.jpg");
    expect(archivoDeLaImagen("/")).toBe("/og/inicio.jpg");
  });

  it("un escrito usa la imagen de su sección", () => {
    expect(imagenParaCompartir("/blog/un-articulo")).toBe("/og/blog.jpg");
  });

  it("cae a la portada de su idioma si la página no tiene imagen", () => {
    expect(imagenParaCompartir("/no-existe")).toBe("/og/inicio.jpg");
    expect(imagenParaCompartir("/en/no-existe")).toBe("/og/en.jpg");
  });
});

describe("paginaDelEscrito", () => {
  const escrito = (id: string) => ({
    id,
    data: {
      titulo: "Por qué OptiPix descarga en ZIP",
      descripcion: "",
      fecha: new Date("2026-11-12"),
      tipo: "nota" as const,
      etiquetas: ["javascript", "rendimiento"],
      borrador: false,
    },
  });

  it("da a cada escrito su ruta, su título y sus etiquetas", () => {
    expect(paginaDelEscrito(escrito("es/optipix"))).toEqual({
      ruta: "/blog/optipix",
      titulo: "Por qué OptiPix descarga en ZIP",
      idioma: "es",
      etiquetas: ["javascript", "rendimiento"],
    });
    expect(paginaDelEscrito(escrito("en/optipix")).ruta).toBe(
      "/en/blog/optipix",
    );
  });
});

describe("enlacesParaCompartir", () => {
  it("arma un enlace por red con la URL y el título codificados", () => {
    const enlaces = enlacesParaCompartir(
      "https://abitech.dev/blog/a b",
      "Título & más",
    );
    const url = encodeURIComponent("https://abitech.dev/blog/a b");
    const titulo = encodeURIComponent("Título & más");

    expect(enlaces).toEqual([
      {
        red: "LinkedIn",
        icono: "simple-icons:linkedin",
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      },
      {
        red: "WhatsApp",
        icono: "simple-icons:whatsapp",
        href: `https://wa.me/?text=${encodeURIComponent("Título & más https://abitech.dev/blog/a b")}`,
      },
      {
        red: "X",
        icono: "simple-icons:x",
        href: `https://x.com/intent/post?text=${titulo}&url=${url}`,
      },
      {
        red: "Facebook",
        icono: "simple-icons:facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      },
    ]);
  });
});

describe("paginaDelMaterial", () => {
  it("da a cada libro su ruta y su título en su idioma", () => {
    const material = {
      id: "docker",
      publicacion: { name: "Docker paso a paso" },
    };
    expect(paginaDelMaterial(material, "en")).toEqual({
      ruta: "/en/aprende/docker",
      titulo: "Docker paso a paso",
      idioma: "en",
    });
  });
});

describe("visual de cada imagen para compartir", () => {
  const porRuta = (ruta: string) =>
    paginasParaCompartir().find((pagina) => pagina.ruta === ruta);

  it("un proyecto y un paquete muestran su logo o su ícono, no la foto", () => {
    expect(porRuta("/proyectos/tu-coach")).toMatchObject({
      etiqueta: "Proyecto",
      visual: { tipo: "proyecto", id: "tu-coach" },
    });
    expect(porRuta("/en/codigo-abierto/antibot-laravel")).toMatchObject({
      etiqueta: "Package",
      visual: { tipo: "proyecto", id: "antibot-laravel" },
    });
  });

  it("las secciones siguen con la foto", () => {
    expect(porRuta("/cv")?.visual).toBeUndefined();
  });

  it("un libro muestra su portada", () => {
    const material = {
      id: "docker",
      publicacion: { name: "Docker paso a paso" },
    };
    expect(
      paginaDelMaterial(material, "es", "Libro", "src/assets/portada.svg"),
    ).toMatchObject({
      etiqueta: "Libro",
      visual: { tipo: "portada", archivo: "src/assets/portada.svg" },
    });
  });
});
