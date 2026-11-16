import { describe, expect, it } from "vitest";

import { mesYAnio, periodo } from "../../src/lib/fechas";

describe("fechas", () => {
  it("escribe el mes abreviado y el año", () => {
    expect(mesYAnio("2025-11")).toBe("nov. 2025");
  });

  it("un periodo abierto empieza con «desde»", () => {
    expect(periodo("2025-11")).toBe("desde nov. 2025");
    expect(periodo("2025-11", undefined, "en")).toBe("since Nov 2025");
  });

  it("en el mismo año escribe el año una sola vez", () => {
    expect(periodo("2026-01", "2026-10")).toBe("ene. a oct. 2026");
    expect(periodo("2026-01", "2026-10", "en")).toBe("Jan to Oct 2026");
  });

  it("entre años distintos escribe los dos", () => {
    expect(periodo("2024-11", "2025-02")).toBe("nov. 2024 a feb. 2025");
    expect(periodo("2024-11", "2025-02", "en")).toBe("Nov 2024 to Feb 2025");
  });

  it("un solo mes se escribe una vez", () => {
    expect(periodo("2026-09", "2026-09")).toBe("set. 2026");
  });
});
