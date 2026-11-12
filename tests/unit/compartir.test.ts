import { describe, expect, it } from "vitest";

import resumeEn from "@/data/resume.en.json";
import resume from "@/data/resume.json";
import {
  archivoDeLaImagen,
  imagenParaCompartir,
  paginasParaCompartir,
} from "@/lib/compartir";
import { SECCIONES } from "@/lib/navegacion";

describe("paginasParaCompartir", () => {
  it("incluye cada sección y cada caso en ambos idiomas, sin paquetes", () => {
    const rutas = paginasParaCompartir().map((p) => p.ruta);

    for (const { ruta } of SECCIONES) {
      expect(rutas).toContain(ruta);
      expect(rutas).toContain(ruta === "/" ? "/en" : `/en${ruta}`);
    }
    expect(rutas).toContain("/en/proyectos/tu-coach");
    expect(rutas).not.toContain("/proyectos/abitech-payments");
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

  it("cae a la portada de su idioma si la página no tiene imagen", () => {
    expect(imagenParaCompartir("/no-existe")).toBe("/og/inicio.jpg");
    expect(imagenParaCompartir("/en/no-existe")).toBe("/og/en.jpg");
  });
});
