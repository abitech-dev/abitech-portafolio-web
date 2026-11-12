import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import resume from "@/data/resume.json";
import {
  RUBRO_DEL_PROYECTO,
  capturaDelProyecto,
  imagenDelProyecto,
} from "@/lib/imagenes";
import { LOGOS, logoDeTecnologia } from "@/lib/logos-de-tecnologias";

const CON_LOGO = [
  "pilot-ssh",
  "cred-plus",
  "yachacuy",
  "optipix",
  "tu-coach",
  "hostal-pacifico",
];

function iconosDelSet(set: string): Set<string> {
  const ruta = `node_modules/@iconify-json/${set}/icons.json`;
  const datos = JSON.parse(readFileSync(ruta, "utf8")) as {
    icons: Record<string, unknown>;
    aliases?: Record<string, unknown>;
  };
  return new Set([
    ...Object.keys(datos.icons),
    ...Object.keys(datos.aliases ?? {}),
  ]);
}

describe("imagenDelProyecto", () => {
  it("da logo o ícono de rubro a cada proyecto público", () => {
    for (const { id } of resume.projects) {
      expect(() => imagenDelProyecto(id), id).not.toThrow();
    }
  });

  it("usa el logo propio solo en los proyectos que lo tienen", () => {
    for (const { id } of resume.projects) {
      expect(imagenDelProyecto(id).esLogo, id).toBe(CON_LOGO.includes(id));
    }
  });

  it("falla con un proyecto sin asignar", () => {
    expect(() => imagenDelProyecto("proyecto-nuevo")).toThrow("proyecto-nuevo");
  });
});

describe("logos e íconos", () => {
  it("ignora la versión", () => {
    expect(logoDeTecnologia("Laravel 12")).toBe("logos:laravel");
    expect(logoDeTecnologia("SUNAT")).toBeUndefined();
  });

  it("solo apunta a íconos que existen", () => {
    const sets = new Map<string, Set<string>>();
    const iconos = [
      ...Object.values(LOGOS),
      ...Object.values(RUBRO_DEL_PROYECTO),
    ];
    for (const icono of iconos) {
      if (!icono.includes(":")) {
        expect(existsSync(`src/icons/${icono}.svg`), icono).toBe(true);
        continue;
      }
      const [set = "", nombre = ""] = icono.split(":");
      if (!sets.has(set)) sets.set(set, iconosDelSet(set));
      expect(sets.get(set)?.has(nombre), icono).toBe(true);
    }
  });
});

describe("capturaDelProyecto", () => {
  it("tiene la portada de cada proyecto destacado del inicio", () => {
    for (const id of ["tu-coach", "pilot-ssh", "cred-plus", "yachacuy"]) {
      expect(capturaDelProyecto(id), id).toBeDefined();
    }
    expect(capturaDelProyecto("recaudacion-scotiabank")).toBeUndefined();
  });
});
