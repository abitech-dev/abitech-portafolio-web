import { describe, expect, it } from "vitest";

import resume from "@/data/resume.json";
import { llmsTxt } from "@/lib/llms";

const texto = llmsTxt(resume, new URL("https://abitech.dev"));

describe("llmsTxt", () => {
  it("sigue la forma de llmstxt.org", () => {
    const lineas = texto.split("\n");

    expect(lineas[0]).toBe(`# ${resume.basics.name}`);
    expect(lineas[2]).toMatch(/^> /);
    expect(texto).toContain("## Proyectos");
    expect(texto).toContain("## Optional");
  });

  it("enlaza cada caso y los paquetes a su repositorio", () => {
    expect(texto).toContain("(https://abitech.dev/proyectos/tu-coach)");
    expect(texto).toContain(
      "(https://github.com/abitech-dev/abitech-antibot-laravel)",
    );
    expect(texto).not.toContain("/proyectos/abitech-payments)");
  });
});
