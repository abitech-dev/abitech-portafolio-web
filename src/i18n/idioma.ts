import resumeEn from "@/data/resume.en.json";
import resume from "@/data/resume.json";
import type { Idioma } from "@/i18n/rutas";
import { TEXTOS, type Textos } from "@/i18n/textos";
import type { Resume } from "@/lib/trayectoria";

export function textosDe(idioma: Idioma): Textos {
  return TEXTOS[idioma];
}

export function datosDe(idioma: Idioma): Resume {
  return idioma === "en" ? resumeEn : resume;
}
