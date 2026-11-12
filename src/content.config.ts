import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/** Artículos largos y notas cortas comparten esquema y se distinguen por tipo. */
const escritos = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/escritos" }),
  schema: z.object({
    titulo: z.string().max(70),
    descripcion: z.string().min(50).max(160),
    fecha: z.coerce.date(),
    actualizado: z.coerce.date().optional(),
    tipo: z.enum(["articulo", "nota"]),
    etiquetas: z.array(z.string()).min(1).max(5),
    borrador: z.boolean().default(false),
  }),
});

export const collections = { escritos };
