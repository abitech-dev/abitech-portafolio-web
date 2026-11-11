// Con «c:\» en minúscula, Vitest carga dos copias de sí mismo.
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const raiz = process.cwd().replace(/^[a-z]:/, (unidad) => unidad.toUpperCase());
const vitest = join(raiz, "node_modules", "vitest", "vitest.mjs");

const { status } = spawnSync(
  process.execPath,
  [vitest, ...process.argv.slice(2)],
  {
    cwd: raiz,
    stdio: "inherit",
  },
);
process.exit(status ?? 1);
