import { describe, expect, it } from "vitest";

import {
  idiomaDeLaRuta,
  rutaEn,
  rutaEnOtroIdioma,
  sinIdioma,
} from "@/i18n/rutas";

describe("rutas por idioma", () => {
  it("reconoce el inglés solo bajo «/en»", () => {
    expect(idiomaDeLaRuta("/en")).toBe("en");
    expect(idiomaDeLaRuta("/en/cv")).toBe("en");
    expect(idiomaDeLaRuta("/enlaces")).toBe("es");
    expect(idiomaDeLaRuta("/")).toBe("es");
  });

  it("pone y quita el prefijo del idioma", () => {
    expect(rutaEn("en", "/")).toBe("/en");
    expect(rutaEn("en", "/cv")).toBe("/en/cv");
    expect(rutaEn("es", "/cv")).toBe("/cv");
    expect(sinIdioma("/en/proyectos/tu-coach/")).toBe("/proyectos/tu-coach");
    expect(sinIdioma("/en")).toBe("/");
  });

  it("lleva a la misma página en el otro idioma", () => {
    expect(rutaEnOtroIdioma("/cv")).toBe("/en/cv");
    expect(rutaEnOtroIdioma("/en/cv")).toBe("/cv");
    expect(rutaEnOtroIdioma("/en")).toBe("/");
    expect(rutaEnOtroIdioma("/")).toBe("/en");
    expect(rutaEnOtroIdioma("/blog")).toBe("/en/blog");
    expect(rutaEnOtroIdioma("/blog/un-articulo")).toBe("/en/blog");
    expect(rutaEnOtroIdioma("/en/blog")).toBe("/blog");
    expect(rutaEnOtroIdioma("/en/blog/otra")).toBe("/blog");
  });
});
