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

/** Lo que el sitio muestra de cada paquete, además de lo que trae resume.json. */
const paquetes = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/paquetes" }),
  schema: z.object({
    caracteristicas: z.object({
      es: z.array(z.string()).min(2).max(5),
      en: z.array(z.string()).min(2).max(5),
    }),
    compatibilidad: z.object({
      es: z.array(z.string()).min(1),
      en: z.array(z.string()).min(1),
    }),
    licencia: z.string(),
    ejemplo: z.object({
      archivo: z.string(),
      lenguaje: z.string(),
      codigo: z.string(),
    }),
  }),
});

export const collections = { escritos, paquetes };
