import { describe, expect, it } from "vitest";

import {
  etiquetasDe,
  idDeEtiqueta,
  idiomaDelEscrito,
  minutosDeLectura,
  publicados,
  slugDelEscrito,
  type Escrito,
} from "@/lib/escritos";

function escrito(
  id: string,
  fecha: string,
  etiquetas: string[],
  borrador = false,
): Escrito {
  return {
    id,
    data: {
      titulo: id,
      descripcion: "",
      fecha: new Date(fecha),
      tipo: "articulo",
      etiquetas,
      borrador,
    },
  };
}

describe("escritos", () => {
  it("calcula al menos un minuto de lectura a 200 palabras por minuto", () => {
    expect(minutosDeLectura("hola")).toBe(1);
    expect(minutosDeLectura("palabra ".repeat(450))).toBe(3);
  });

  it("omite los borradores en producción y ordena del más reciente", () => {
    const lista = [
      escrito("viejo", "2026-01-01", ["a"]),
      escrito("nuevo", "2026-06-01", ["a"]),
      escrito("borrador", "2026-07-01", ["a"], true),
    ];

    expect(publicados(lista, false).map((e) => e.id)).toEqual([
      "nuevo",
      "viejo",
    ]);
    expect(publicados(lista, true)).toHaveLength(3);
  });

  it("cuenta las etiquetas y les da un id sin tildes", () => {
    const lista = [
      escrito("a", "2026-01-01", ["astro", "Diseño"]),
      escrito("b", "2026-01-02", ["astro"]),
    ];

    expect(etiquetasDe(lista)).toEqual([
      ["astro", 2],
      ["Diseño", 1],
    ]);
    expect(idDeEtiqueta("Diseño web")).toBe("diseno-web");
  });

  it("lee el idioma y el nombre compartido desde la carpeta", () => {
    expect(idiomaDelEscrito({ id: "en/mi-entrada" })).toBe("en");
    expect(idiomaDelEscrito({ id: "es/mi-entrada" })).toBe("es");
    expect(slugDelEscrito({ id: "en/mi-entrada" })).toBe("mi-entrada");
  });
});
