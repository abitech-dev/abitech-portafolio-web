import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import iconos from "@iconify-json/lucide/icons.json";

import type { APIRoute, GetStaticPaths } from "astro";
import satori from "satori";
import sharp from "sharp";

import { datosDe, textosDe } from "@/i18n/idioma";
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
import { nombreCorto } from "@/lib/trayectoria";

const ANCHO = 1200;
const ALTO = 630;
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
  .resize(560, 560)
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

type ImagenDelVisual = { src: string; esLogo: boolean; esPortada: boolean };

const enLinea = (png: Buffer): string =>
  `data:image/png;base64,${png.toString("base64")}`;

/** El logo del proyecto, su ícono de rubro o la portada del libro. */
async function imagenDe(visual: Visual): Promise<ImagenDelVisual> {
  if (visual.tipo === "portada") {
    const png = await sharp(visual.archivo, { density: 300 })
      .resize({ height: 400 })
      .png()
      .toBuffer();
    return { src: enLinea(png), esLogo: false, esPortada: true };
  }
  const logo = join("src/assets/logos", `${visual.id}.png`);
  if (existsSync(logo)) {
    return {
      src: enLinea(readFileSync(logo)),
      esLogo: true,
      esPortada: false,
    };
  }
  const nombre = (RUBRO_DEL_PROYECTO[visual.id] ?? "lucide:folder").replace(
    "lucide:",
    "",
  );
  const cuerpo = (iconos.icons as Record<string, { body: string }>)[nombre]
    ?.body;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" color="${COLORES.acento}">${cuerpo ?? ""}</svg>`;
  const png = await sharp(Buffer.from(svg), { density: 600 })
    .resize(256, 256)
    .png()
    .toBuffer();
  return { src: enLinea(png), esLogo: false, esPortada: false };
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

function chips(etiquetas: string[]): Nodo {
  return nodo(
    "div",
    { display: "flex", flexWrap: "wrap", gap: 12 },
    etiquetas.map((etiqueta) =>
      nodo(
        "div",
        {
          fontSize: 24,
          color: COLORES.acento,
          background: COLORES.acentoSuave,
          borderRadius: 8,
          padding: "6px 14px",
        },
        etiqueta,
      ),
    ),
  );
}

function tarjeta({ titulo, idioma, etiquetas }: PaginaParaCompartir): Nodo {
  const { name: nombre, label } = datosDe(idioma).basics;
  const name = nombreCorto(nombre);
  return nodo(
    "div",
    {
      width: ANCHO,
      height: ALTO,
      display: "flex",
      alignItems: "center",
      gap: 64,
      padding: "0 80px",
      position: "relative",
      background: COLORES.fondo,
      fontFamily: "Inter",
    },
    [
      nodo(
        "img",
        { borderRadius: 16, border: `2px solid ${COLORES.borde}` },
        undefined,
        {
          src: fotoEnLinea,
          width: 280,
          height: 280,
        },
      ),
      nodo(
        "div",
        { display: "flex", flexDirection: "column", gap: 20, width: 696 },
        [
          nodo(
            "div",
            { fontSize: 28, fontWeight: 700, color: COLORES.acento },
            name,
          ),
          nodo(
            "div",
            {
              fontSize: titulo.length > 45 ? 48 : 56,
              fontWeight: 700,
              color: COLORES.texto,
              lineHeight: 1.1,
            },
            titulo,
          ),
          ...(etiquetas
            ? [chips(etiquetas)]
            : titulo === label
              ? []
              : [nodo("div", { fontSize: 26, color: COLORES.tenue }, label)]),
          nodo("div", { fontSize: 24, color: COLORES.tenue }, "abitech.dev"),
        ],
      ),
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

/** Centrada, para que el recorte cuadrado de WhatsApp muestre logo y título. */
function tarjetaConVisual(
  { titulo, etiqueta }: PaginaParaCompartir,
  imagen: ImagenDelVisual,
): Nodo {
  const marco = imagen.esPortada
    ? nodo("img", { borderRadius: 12 }, undefined, {
        src: imagen.src,
        height: 300,
      })
    : nodo(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 220,
          height: 220,
          borderRadius: 40,
          background: imagen.esLogo ? "#ffffff" : COLORES.acentoSuave,
          border: `2px solid ${COLORES.borde}`,
        },
        nodo("img", {}, undefined, {
          src: imagen.src,
          width: imagen.esLogo ? 160 : 132,
          height: imagen.esLogo ? 160 : 132,
        }),
      );
  return nodo(
    "div",
    {
      width: ANCHO,
      height: ALTO,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 22,
      position: "relative",
      background: COLORES.fondo,
      fontFamily: "Inter",
      textAlign: "center",
    },
    [
      marco,
      ...(etiqueta
        ? [
            nodo(
              "div",
              {
                fontSize: 26,
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
          fontSize: titulo.length > 40 ? 50 : 60,
          fontWeight: 700,
          color: COLORES.texto,
          lineHeight: 1.1,
          maxWidth: 1000,
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
  const diseno = pagina.visual
    ? tarjetaConVisual(pagina, await imagenDe(pagina.visual))
    : tarjeta(pagina);
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
