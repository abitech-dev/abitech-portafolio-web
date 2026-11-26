import { expect, test } from "@playwright/test";

import resume from "../../src/data/resume.json" with { type: "json" };
import resumeEn from "../../src/data/resume.en.json" with { type: "json" };

// El perfil de GitHub lee estos archivos, así que su forma es un contrato.
const VERSIONES = [
  { ruta: "/resume.json", datos: resume },
  { ruta: "/en/resume.json", datos: resumeEn },
];

for (const { ruta, datos } of VERSIONES) {
  test(`${ruta} publica el resume.json de trayectoria`, async ({ request }) => {
    const respuesta = await request.get(ruta);

    expect(respuesta.status()).toBe(200);
    expect(respuesta.headers()["content-type"]).toContain("application/json");
    expect(await respuesta.json()).toEqual(datos);
  });
}
