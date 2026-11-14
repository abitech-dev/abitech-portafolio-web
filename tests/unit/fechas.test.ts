import { describe, expect, it } from "vitest";

import { mesYAnio, periodo } from "../../src/lib/fechas";

describe("fechas", () => {
  it("escribe el mes abreviado y el año", () => {
    expect(mesYAnio("2025-11")).toBe("nov. 2025");
  });

  it("cierra un periodo abierto con «actualidad»", () => {
    expect(periodo("2025-11")).toBe("nov. 2025-actualidad");
  });

  it("une inicio y fin", () => {
    expect(periodo("2025-02", "2025-10")).toBe("feb. 2025-oct. 2025");
  });
});
