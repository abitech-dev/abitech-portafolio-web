import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import iconos from "@iconify-json/lucide/icons.json";

import type { APIRoute, GetStaticPaths } from "astro";
import satori from "satori";
import sharp from "sharp";

import { textosDe } from "@/i18n/idioma";
import { IDIOMAS } from "@/i18n/rutas";
import { materialesDeAprende } from "@/lib/coleccion-aprende";
import { escritosPublicados } from "@/lib/coleccion-escritos";
import {
  archivoDeLaImagen,
  paginaDelEscrito,
  paginaDelMaterial,
  paginasParaCompartir,
  type PaginaParaCompartir,
  type Visual,
} from "@/lib/compartir";
import { RUBRO_DEL_PROYECTO } from "@/lib/imagenes";

const ANCHO = 1200;
const ALTO = 630;
const ZONA_SEGURA = 540;
const COLORES = {
  fondo: "#f8fafc",
  borde: "#dbe1e8",
  texto: "#1b2430",
  tenue: "#566170",
  acento: "#1c6ccc",
  acentoSuave: "#eef5fd",
  marca: "#fbbd1b",
};

const fuente = (peso: number): Buffer =>
  readFileSync(
    `node_modules/@fontsource/inter/files/inter-latin-${peso}-normal.woff`,
  );

const foto = await sharp("src/assets/foto-perfil.jpg")
  .resize(400, 400)
  .jpeg({ quality: 85 })
  .toBuffer();
const fotoEnLinea = `data:image/jpeg;base64,${foto.toString("base64")}`;

export const getStaticPaths = (async () => {
  const escritos = (await Promise.all(IDIOMAS.map(escritosPublicados))).flat();
  const libros = await Promise.all(
    IDIOMAS.map(async (idioma) =>
      (await materialesDeAprende(idioma)).map((material) =>
        paginaDelMaterial(
          material,
          idioma,
          textosDe(idioma).aprende.tipos[material.detalle.tipo],
          portadaDe(material.id),
        ),
      ),
    ),
  );
  return [
    ...paginasParaCompartir(),
    ...escritos.map(paginaDelEscrito),
    ...libros.flat(),
  ].map((pagina) => ({
    params: { ruta: archivoDeLaImagen(pagina.ruta).slice(4, -4) },
    props: pagina,
  }));
}) satisfies GetStaticPaths;

/** La portada del libro, leída de su YAML porque el build no da su ruta. */
function portadaDe(id: string): string | undefined {
  const yaml = readFileSync(join("src/content/aprende", `${id}.yaml`), "utf8");
  const relativa = /^portada:\s*(\S+)\s*$/m.exec(yaml)?.[1];
  return relativa ? join("src/content/aprende", relativa) : undefined;
}

type Marco = "foto" | "logo" | "icono" | "portada";
type ImagenDelVisual = { src: string; marco: Marco };

const enLinea = (png: Buffer): string =>
  `data:image/png;base64,${png.toString("base64")}`;

async function iconoEnPng(icono: string): Promise<string> {
  const nombre = icono.replace("lucide:", "");
  const cuerpo = (iconos.icons as Record<string, { body: string }>)[nombre]
    ?.body;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" color="${COLORES.acento}">${cuerpo ?? ""}</svg>`;
  const png = await sharp(Buffer.from(svg), { density: 600 })
    .resize(256, 256)
    .png()
    .toBuffer();
  return enLinea(png);
}

/** La foto del autor, el logo, el ícono o la portada del libro. */
async function imagenDe(visual?: Visual): Promise<ImagenDelVisual> {
  if (!visual) return { src: fotoEnLinea, marco: "foto" };
  if (visual.tipo === "icono") {
    return { src: await iconoEnPng(visual.nombre), marco: "icono" };
  }
  if (visual.tipo === "portada") {
    const png = await sharp(visual.archivo, { density: 300 })
      .resize({ height: 400 })
      .png()
      .toBuffer();
    return { src: enLinea(png), marco: "portada" };
  }
  const logo = join("src/assets/logos", `${visual.id}.png`);
  if (existsSync(logo)) {
    return { src: enLinea(readFileSync(logo)), marco: "logo" };
  }
  const rubro = RUBRO_DEL_PROYECTO[visual.id] ?? "lucide:folder";
  return { src: await iconoEnPng(rubro), marco: "icono" };
}

type Nodo = {
  type: string;
  props: Record<string, unknown> & { style?: Record<string, unknown> };
};

function nodo(
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
  extra: Record<string, unknown> = {},
): Nodo {
  return { type, props: { style, children, ...extra } };
}

function marcoDe({ src, marco }: ImagenDelVisual): Nodo {
  if (marco === "portada") {
    return nodo("img", { borderRadius: 12 }, undefined, { src, height: 240 });
  }
  if (marco === "foto") {
    return nodo(
      "img",
      { borderRadius: 100, border: `4px solid #ffffff` },
      undefined,
      { src, width: 200, height: 200 },
    );
  }
  const isLogo = marco === "logo";
  return nodo(
    "div",
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 200,
      height: 200,
      borderRadius: 40,
      background: isLogo ? "#ffffff" : COLORES.acentoSuave,
      border: `2px solid ${COLORES.borde}`,
    },
    nodo("img", {}, undefined, {
      src,
      width: isLogo ? 150 : 120,
      height: isLogo ? 150 : 120,
    }),
  );
}

function tamanoDelTitulo(titulo: string): number {
  if (titulo.length <= 18) return 56;
  return titulo.length <= 44 ? 48 : 42;
}

/** Todo cabe en el cuadrado central, que es lo que WhatsApp recorta. */
function tarjeta(
  { titulo, etiqueta }: PaginaParaCompartir,
  imagen: ImagenDelVisual,
): Nodo {
  return nodo(
    "div",
    {
      width: ANCHO,
      height: ALTO,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      position: "relative",
      background: COLORES.fondo,
      fontFamily: "Inter",
      textAlign: "center",
    },
    [
      marcoDe(imagen),
      ...(etiqueta
        ? [
            nodo(
              "div",
              {
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 2,
                color: COLORES.acento,
                textTransform: "uppercase",
              },
              etiqueta,
            ),
          ]
        : []),
      nodo(
        "div",
        {
          fontSize: tamanoDelTitulo(titulo),
          fontWeight: 700,
          color: COLORES.texto,
          lineHeight: 1.1,
          maxWidth: ZONA_SEGURA,
        },
        titulo,
      ),
      nodo("div", { fontSize: 24, color: COLORES.tenue }, "abitech.dev"),
      nodo("div", {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: ANCHO,
        height: 12,
        background: COLORES.marca,
      }),
    ],
  );
}

export const GET: APIRoute = async ({ props }) => {
  const pagina = props as PaginaParaCompartir;
  const diseno = tarjeta(pagina, await imagenDe(pagina.visual));
  const svg = await satori(diseno as never, {
    width: ANCHO,
    height: ALTO,
    fonts: [
      { name: "Inter", data: fuente(400), weight: 400, style: "normal" },
      { name: "Inter", data: fuente(700), weight: 700, style: "normal" },
    ],
  });
  const jpg = await sharp(Buffer.from(svg))
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpg), {
    headers: { "Content-Type": "image/jpeg" },
  });
};
