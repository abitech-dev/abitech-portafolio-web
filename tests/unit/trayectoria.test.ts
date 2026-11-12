import { describe, expect, it } from "vitest";

import resume from "../../src/data/resume.json";
import {
  grafo,
  libro,
  proyecto,
  type Nodo,
} from "../../src/lib/datos-estructurados";
import { estaActiva } from "../../src/lib/seccion-activa";
import {
  esPaquete,
  habilidadesPorCategoria,
  proyectosPorId,
  tecnologiaBase,
  tecnologiasFrecuentes,
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

describe("esPaquete", () => {
  it("separa los paquetes de las aplicaciones", () => {
    const paquetes = resume.projects.filter(esPaquete).map((p) => p.id);

    expect(paquetes).toEqual(["abitech-payments", "antibot-laravel"]);
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

describe("grafo", () => {
  it("enlaza el sitio y la persona por su @id", () => {
    const sitio = new URL("https://abitech.dev");
    const datos = grafo(resume, sitio, "es") as { "@graph": Nodo[] };
    const [web, autor] = datos["@graph"];

    expect(web).toMatchObject({
      "@type": "WebSite",
      publisher: { "@id": "https://abitech.dev/#persona" },
    });
    expect(autor).toMatchObject({
      "@type": "Person",
      "@id": "https://abitech.dev/#persona",
    });
    expect(autor?.["sameAs"]).toContain("https://github.com/abitech-dev");
    expect(autor?.["knowsAbout"]).toContain("Laravel");
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

describe("tecnologiaBase", () => {
  it("quita la versión y lo que va entre paréntesis", () => {
    expect(tecnologiaBase("Laravel 12")).toBe("Laravel");
    expect(tecnologiaBase("Inertia 1 SSR")).toBe("Inertia");
    expect(tecnologiaBase(".NET Framework 4.7.2")).toBe(".NET Framework");
    expect(tecnologiaBase("GitHub Actions (CI/CD)")).toBe("GitHub Actions");
  });
});

describe("tecnologiasFrecuentes", () => {
  it("cuenta cada tecnología una vez por proyecto y ordena por uso", () => {
    const proyectos = [
      { keywords: ["Laravel 12", "Vue 3", "MySQL"] },
      { keywords: ["Laravel 13", "Vue 3"] },
      { keywords: ["Laravel 11", "Django"] },
    ];

    expect(tecnologiasFrecuentes(proyectos, 2)).toEqual(["Laravel", "Vue"]);
  });
});

describe("libro y proyecto", () => {
  it("arma el libro con su autor", () => {
    const [primero] = resume.publications;
    if (!primero) throw new Error("Falta una publicación en resume.json.");

    expect(libro(primero, new URL("https://abitech.dev"))).toMatchObject({
      "@type": "Book",
      author: { "@id": "https://abitech.dev/#persona" },
    });
  });

  it("arma el proyecto con sus tecnologías y su enlace externo", () => {
    const [tuCoach] = proyectosPorId(resume, ["tu-coach"]);
    if (!tuCoach) throw new Error("Falta tu-coach en resume.json.");

    const datos = proyecto(
      tuCoach,
      new URL("https://abitech.dev"),
      new URL("https://abitech.dev/proyectos/tu-coach"),
    );

    expect(datos["keywords"]).toContain("Laravel 10");
    expect(datos["sameAs"]).toBe("https://tucoach.udh.edu.pe/");
  });
});
