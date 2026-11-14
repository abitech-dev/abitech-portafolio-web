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

const bilingue = z.object({ es: z.string(), en: z.string() });

/** Lo que el sitio muestra de cada paquete, además de lo que trae resume.json. */
const paquetes = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/paquetes" }),
  schema: z.object({
    lema: z.object({ es: z.string().max(70), en: z.string().max(70) }),
    integra: z.array(z.string()).min(1),
    datos: z
      .array(z.object({ valor: bilingue, etiqueta: bilingue }))
      .min(2)
      .max(4),
    ejemplo: z.object({
      archivo: z.string(),
      lenguaje: z.string(),
      codigo: z.string(),
    }),
  }),
});

/** Libros y cursos, cada uno con su temario de módulos o volúmenes. */
const aprende = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/aprende" }),
  schema: ({ image }) =>
    z.object({
      tipo: z.enum(["libro", "curso"]),
      estado: bilingue,
      lema: z.object({ es: z.string().max(80), en: z.string().max(80) }),
      portada: image(),
      datos: z
        .array(z.object({ valor: bilingue, etiqueta: bilingue }))
        .min(2)
        .max(4),
      modulos: z
        .array(
          z.object({
            numero: z.string(),
            titulo: z.string(),
            subtitulo: z.string(),
            portada: image(),
          }),
        )
        .min(1),
      recursos: z.array(z.object({ etiqueta: bilingue, url: z.url() })),
    }),
});

export const collections = { escritos, paquetes, aprende };
