// Solo trae la vista pública de abitech-trayectoria.
import { copyFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const salida = new URL("../../abitech-trayectoria/salida/", import.meta.url);
const raiz = new URL("../", import.meta.url);
const COPIAS = [
  ["resume.json", "src/data/resume.json"],
  ["resume.en.json", "src/data/resume.en.json"],
  [
    "cv/publico/CV - Abimael Fernandez Ventura.pdf",
    "public/descargas/cv-abimael-fernandez-ventura.pdf",
  ],
  [
    "cv/publico/Resume - Abimael Fernandez Ventura.pdf",
    "public/descargas/resume-abimael-fernandez-ventura.pdf",
  ],
];

const faltantes = COPIAS.map(([origen]) => origen).filter(
  (origen) => !existsSync(new URL(origen, salida)),
);
if (faltantes.length > 0) {
  console.error(
    `Faltan ${faltantes.join(", ")}. En abitech-trayectoria corre «uv run trayectoria exportar» y «uv run trayectoria cv --publico».`,
  );
  process.exit(1);
}

for (const [origen, destino] of COPIAS) {
  const archivo = new URL(destino, raiz);
  await mkdir(dirname(fileURLToPath(archivo)), { recursive: true });
  await copyFile(new URL(origen, salida), archivo);
}
console.log(`Copiados ${COPIAS.map(([, destino]) => destino).join(", ")}`);
