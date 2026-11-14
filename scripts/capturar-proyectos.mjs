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

/** Baja por la página para que aparezca el contenido que carga al hacer scroll. */
async function recorrer(pagina) {
  await pagina.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      scrollTo(0, y);
      await new Promise((listo) => setTimeout(listo, 150));
    }
    scrollTo(0, 0);
  });
  await pagina.waitForTimeout(800);
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
    await recorrer(pagina);
    // Hasta 2700 px de alto, para que el marco pueda desplazar la portada.
    const alto = await pagina.evaluate(() => document.body.scrollHeight);
    const imagen = await pagina.screenshot({
      fullPage: true,
      clip: { x: 0, y: 0, width: 1440, height: Math.min(alto, 2700) },
    });
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
