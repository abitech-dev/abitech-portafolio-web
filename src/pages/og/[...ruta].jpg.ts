import { readFileSync } from "node:fs";

import type { APIRoute, GetStaticPaths } from "astro";
import satori from "satori";
import sharp from "sharp";

import { datosDe } from "@/i18n/idioma";
import {
  archivoDeLaImagen,
  paginasParaCompartir,
  type PaginaParaCompartir,
} from "@/lib/compartir";

const ANCHO = 1200;
const ALTO = 630;
const COLORES = {
  fondo: "#f8fafc",
  borde: "#dbe1e8",
  texto: "#1b2430",
  tenue: "#566170",
  acento: "#1c6ccc",
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

export const getStaticPaths = (() =>
  paginasParaCompartir().map((pagina) => ({
    params: { ruta: archivoDeLaImagen(pagina.ruta).slice(4, -4) },
    props: pagina,
  }))) satisfies GetStaticPaths;

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

function tarjeta({ titulo, idioma }: PaginaParaCompartir): Nodo {
  const { name, label } = datosDe(idioma).basics;
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
              fontSize: 56,
              fontWeight: 700,
              color: COLORES.texto,
              lineHeight: 1.1,
            },
            titulo,
          ),
          ...(titulo === label
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

export const GET: APIRoute = async ({ props }) => {
  const svg = await satori(tarjeta(props as PaginaParaCompartir) as never, {
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
