import { describe, expect, it } from "vitest";

import { partirExtracto, rutaDelResultado } from "@/lib/busqueda";

describe("partirExtracto", () => {
  it("separa lo resaltado y decodifica las entidades", () => {
    expect(partirExtracto("Usé <mark>OptiPix</mark> &amp; fflate")).toEqual([
      { texto: "Usé ", isResaltado: false },
      { texto: "OptiPix", isResaltado: true },
      { texto: " & fflate", isResaltado: false },
    ]);
  });
});

describe("rutaDelResultado", () => {
  it("quita la barra final que deja el índice", () => {
    expect(rutaDelResultado("/blog/optipix/")).toBe("/blog/optipix");
    expect(rutaDelResultado("/")).toBe("/");
  });
});
