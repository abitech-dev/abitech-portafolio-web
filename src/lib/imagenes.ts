import type { ImageMetadata } from "astro";

type Modulo = { default: ImageMetadata };

const logos = import.meta.glob<Modulo>("../assets/logos/*.png", {
  eager: true,
});
const capturas = import.meta.glob<Modulo>("../assets/capturas/*.jpg", {
  eager: true,
});

/** La portada del proyecto en línea, si se pudo capturar. */
export function capturaDelProyecto(id: string): ImageMetadata | undefined {
  return Object.entries(capturas).find(([ruta]) =>
    ruta.endsWith(`/${id}.jpg`),
  )?.[1].default;
}

/** Ícono del rubro para proyectos sin logo o de clientes que no se nombran. */
export const RUBRO_DEL_PROYECTO: Record<string, string> = {
  "lms-de-idiomas-con-suscripciones": "lucide:languages",
  "sistema-de-empeno-y-compraventa-de-oro": "lucide:gem",
  "pwa-offline-de-actas-de-mantenimiento": "lucide:clipboard-check",
  "plataforma-de-una-casa-de-cambio-digital": "lucide:arrow-left-right",
  "recaudacion-scotiabank": "lucide:landmark",
  "la-fruteria": "lucide:apple",
  "claude-config": "lucide:bot",
  "hackathon-udh": "lucide:trophy",
  sigep: "lucide:graduation-cap",
  "portal-investigacion": "lucide:microscope",
  "banco-necesidades": "lucide:handshake",
  "historias-clinicas-psicologicas": "lucide:brain",
  "abitech-payments": "lucide:credit-card",
  "antibot-laravel": "lucide:shield-check",
};

export type ImagenDeProyecto =
  { esLogo: true; logo: ImageMetadata } | { esLogo: false; icono: string };

/** Falla el build si un proyecto nuevo no tiene logo ni rubro asignado. */
export function imagenDelProyecto(id: string): ImagenDeProyecto {
  const logo = Object.entries(logos).find(([ruta]) =>
    ruta.endsWith(`/${id}.png`),
  )?.[1].default;
  if (logo) {
    return { esLogo: true, logo };
  }
  const icono = RUBRO_DEL_PROYECTO[id];
  if (!icono) {
    throw new Error(`El proyecto «${id}» no tiene logo ni ícono de rubro.`);
  }
  return { esLogo: false, icono };
}
