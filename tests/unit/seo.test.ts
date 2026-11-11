import { describe, expect, it } from "vitest";

import { metadatosDe } from "../../src/lib/seo";

const SITIO = new URL("https://abitech.dev");

describe("metadatosDe", () => {
  it("deja solo el nombre en la portada", () => {
    expect(metadatosDe("/", SITIO, "Resumen").titulo).toBe(
      "Abimael Fernandez Ventura",
    );
  });

  it("antepone el título de la página al nombre", () => {
    expect(metadatosDe("/cv", SITIO, "CV", "CV").titulo).toBe(
      "CV | Abimael Fernandez Ventura",
    );
  });

  it("arma la URL canónica sin barra final", () => {
    expect(metadatosDe("/cv/", SITIO, "CV").canonica).toBe(
      "https://abitech.dev/cv",
    );
  });
});
