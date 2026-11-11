import { describe, expect, it } from "vitest";

import resume from "../../src/data/resume.json";
import { persona } from "../../src/lib/datos-estructurados";
import { estaActiva } from "../../src/lib/navegacion";
import {
  habilidadesPorCategoria,
  proyectosPorId,
} from "../../src/lib/trayectoria";

describe("proyectosPorId", () => {
  it("respeta el orden pedido y omite los que no existen", () => {
    const proyectos = proyectosPorId(resume, [
      "cred-plus",
      "no-existe",
      "tu-coach",
    ]);

    expect(proyectos.map((p) => p.id)).toEqual(["cred-plus", "tu-coach"]);
  });
});

describe("habilidadesPorCategoria", () => {
  it("agrupa por la primera palabra clave", () => {
    const grupos = habilidadesPorCategoria([
      { name: "Laravel", level: "Avanzado", keywords: ["Backend"] },
      { name: "Vue.js", level: "Avanzado", keywords: ["Frontend"] },
      { name: "PHP", level: "Avanzado", keywords: ["Backend"] },
    ]);

    expect(grupos.get("Backend")?.map((h) => h.name)).toEqual([
      "Laravel",
      "PHP",
    ]);
  });
});

describe("persona", () => {
  it("arma la persona de schema.org con sus perfiles", () => {
    const datos = persona(resume, new URL("https://abitech.dev"));

    expect(datos["@type"]).toBe("Person");
    expect(datos["sameAs"]).toContain("https://github.com/abitech-dev");
  });
});

describe("estaActiva", () => {
  it("activa la portada solo en «/»", () => {
    expect(estaActiva("/", "/cv")).toBe(false);
    expect(estaActiva("/", "/")).toBe(true);
  });

  it("activa una sección en sus subrutas", () => {
    expect(estaActiva("/cv", "/cv/")).toBe(true);
  });
});
