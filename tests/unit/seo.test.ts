import { describe, expect, it } from "vitest";

import { metadatosDe, recortarDescripcion } from "../../src/lib/seo";

const SITIO = new URL("https://abitech.dev");

describe("metadatosDe", () => {
  it("deja solo el nombre en la portada", () => {
    expect(metadatosDe("/", SITIO, "Resumen").titulo).toBe("Abimael Fernandez");
  });

  it("antepone el título de la página al nombre", () => {
    expect(metadatosDe("/cv", SITIO, "CV", "CV").titulo).toBe(
      "CV | Abimael Fernandez",
    );
  });

  it("arma la URL canónica sin barra final", () => {
    expect(metadatosDe("/cv/", SITIO, "CV").canonica).toBe(
      "https://abitech.dev/cv",
    );
  });
});

describe("recortarDescripcion", () => {
  it("deja igual una descripción corta", () => {
    expect(recortarDescripcion("Sitio de Abimael.")).toBe("Sitio de Abimael.");
  });

  it("corta al final de la última oración que entra", () => {
    const texto = `${"a".repeat(100)}. ${"b".repeat(100)}.`;
    expect(recortarDescripcion(texto)).toBe(`${"a".repeat(100)}.`);
  });

  it("corta en una palabra y agrega puntos suspensivos", () => {
    const texto = Array.from({ length: 40 }, () => "palabra").join(" ");
    const recortada = recortarDescripcion(texto);
    expect(recortada.length).toBeLessThanOrEqual(155);
    expect(recortada).toMatch(/palabra…$/);
  });

  it("aplica el recorte en los metadatos", () => {
    const larga = "x ".repeat(120);
    expect(
      metadatosDe("/", SITIO, larga).descripcion.length,
    ).toBeLessThanOrEqual(155);
  });
});
