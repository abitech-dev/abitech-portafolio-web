import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import resumeEn from "@/data/resume.en.json";
import resume from "@/data/resume.json";

const CARPETA = "src/content/escritos";

function proyectosCitados(idioma: "es" | "en"): string[] {
  return readdirSync(join(CARPETA, idioma)).flatMap((archivo) => {
    const texto = readFileSync(join(CARPETA, idioma, archivo), "utf8");
    const cita = /^proyecto:\s*(\S+)\s*$/m.exec(texto);
    return cita?.[1] ? [cita[1]] : [];
  });
}

describe("proyecto de cada escrito", () => {
  it("existe en los datos públicos de su idioma", () => {
    for (const [idioma, datos] of [
      ["es", resume],
      ["en", resumeEn],
    ] as const) {
      const ids = new Set(datos.projects.map((proyecto) => proyecto.id));
      for (const id of proyectosCitados(idioma)) {
        expect(ids, `${idioma}: ${id}`).toContain(id);
      }
    }
  });
});
