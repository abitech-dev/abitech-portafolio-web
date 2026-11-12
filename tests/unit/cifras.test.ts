import { describe, expect, it } from "vitest";

import resume from "@/data/resume.json";
import { RESPALDO_DE_LAS_CIFRAS, cifrasDestacadas } from "@/lib/cifras";
import { esPaquete } from "@/lib/trayectoria";

describe("cifrasDestacadas", () => {
  it("cada cifra escrita a mano sigue respaldada por los datos", () => {
    const texto = JSON.stringify(resume);

    for (const frase of Object.values(RESPALDO_DE_LAS_CIFRAS)) {
      expect(texto, frase).toContain(frase);
    }
  });

  it("cuenta los proyectos sin los paquetes", () => {
    const aplicaciones = resume.projects.filter((p) => !esPaquete(p)).length;

    expect(cifrasDestacadas(resume, "es").at(-1)).toEqual({
      valor: String(aplicaciones),
      etiqueta: "proyectos publicados",
    });
  });
});
