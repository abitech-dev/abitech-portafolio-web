// Arma la CSP con el hash de cada script en línea del sitio compilado.
// Recibe la carpeta dist y el archivo de cabecera que importa Caddy.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [carpeta = "dist", salida = "csp.caddy"] = process.argv.slice(2);

function paginas(directorio) {
  return readdirSync(directorio, { withFileTypes: true }).flatMap((entrada) => {
    const ruta = join(directorio, entrada.name);
    if (entrada.isDirectory()) return paginas(ruta);
    return entrada.name.endsWith(".html") ? [ruta] : [];
  });
}

// Los bloques JSON-LD son datos, no se ejecutan y la CSP no los evalúa.
const SCRIPT_EN_LINEA =
  /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g;

const hashes = new Set();
for (const pagina of paginas(carpeta)) {
  for (const [, codigo] of readFileSync(pagina, "utf8").matchAll(
    SCRIPT_EN_LINEA,
  )) {
    if (codigo.trim() === "") continue;
    const huella = createHash("sha256").update(codigo).digest("base64");
    hashes.add(`'sha256-${huella}'`);
  }
}

const umami = process.env.PUBLIC_UMAMI_SRC
  ? new URL(process.env.PUBLIC_UMAMI_SRC).origin
  : "";

const politica = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].sort().join(" ")} ${umami}`.trim(),
  // Shiki y los componentes usan atributos style; no ejecutan código.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self' ${umami}`.trim(),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

writeFileSync(salida, `header Content-Security-Policy "${politica}"\n`);
console.log(`CSP con ${hashes.size} hashes de scripts escrita en ${salida}`);
