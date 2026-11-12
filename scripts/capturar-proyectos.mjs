// Toma la portada de cada proyecto en línea para mostrarla en el sitio.
import { readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";
import sharp from "sharp";

const resume = JSON.parse(
  readFileSync(new URL("../src/data/resume.json", import.meta.url), "utf8"),
);
const destino = new URL("../src/assets/capturas/", import.meta.url);
const proyectos = resume.projects.filter(
  (proyecto) => proyecto.url && proyecto.type !== "library",
);

/** Algunas portadas abren un aviso emergente que tapa la página. */
async function cerrarAvisos(pagina) {
  const cerrar = pagina.getByRole("button", { name: /^(cerrar|close|×)$/i });
  for (const boton of await cerrar.all()) {
    // Se presiona por código porque otro elemento puede taparlo.
    if (await boton.isVisible()) await boton.evaluate((b) => b.click());
  }
  await pagina.waitForTimeout(500);
}

await mkdir(destino, { recursive: true });
const navegador = await chromium.launch();
for (const { id, url } of proyectos) {
  const pagina = await navegador.newPage({
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
  });
  try {
    await pagina.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
    await pagina.waitForTimeout(1500);
    await cerrarAvisos(pagina);
    const imagen = await pagina.screenshot();
    await sharp(imagen)
      .resize(1440)
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(fileURLToPath(new URL(`${id}.jpg`, destino)));
    console.log(`Capturado ${id}`);
  } catch (error) {
    console.error(`No se pudo capturar ${id} (${url}). ${error.message}`);
  } finally {
    await pagina.close();
  }
}
await navegador.close();
