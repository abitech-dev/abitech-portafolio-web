// Solo trae la vista pública de abitech-trayectoria.
import { copyFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const origen = new URL("../../abitech-trayectoria/salida/", import.meta.url);
const destino = new URL("../src/data/", import.meta.url);
const archivos = ["resume.json", "resume.en.json"];

const faltantes = archivos.filter((a) => !existsSync(new URL(a, origen)));
if (faltantes.length > 0) {
  console.error(
    `Faltan ${faltantes.join(" y ")}. Corre «uv run trayectoria exportar» en abitech-trayectoria.`,
  );
  process.exit(1);
}

await mkdir(destino, { recursive: true });
for (const archivo of archivos) {
  await copyFile(new URL(archivo, origen), new URL(archivo, destino));
}
console.log(`Datos copiados en src/data/: ${archivos.join(", ")}`);
