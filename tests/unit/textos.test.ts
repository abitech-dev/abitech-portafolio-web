import { describe, expect, it } from "vitest";

import { textosDe } from "@/i18n/idioma";

describe("textos del inicio", () => {
  it.each(["es", "en"] as const)(
    "la frase resaltada está dentro de la misión en %s",
    (idioma) => {
      const { inicio } = textosDe(idioma);
      expect(inicio.mision).toContain(inicio.misionResaltada);
    },
  );
});
