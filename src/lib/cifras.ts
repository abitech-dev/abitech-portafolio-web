import { textosDe } from "@/i18n/idioma";
import { type Idioma } from "@/i18n/rutas";
import type { Resume } from "@/lib/trayectoria";
import { esPaquete } from "@/lib/trayectoria";

export interface Cifra {
  valor: string;
  etiqueta: string;
}

/** Cada cifra cita la frase de los datos en español que la respalda. */
export const RESPALDO_DE_LAS_CIFRAS = {
  usuarios: "más de 8800 usuarios",
  anios: "más de 3 años",
  integraciones: "unos 10 flujos de integración",
} as const;

export function cifrasDestacadas(datos: Resume, idioma: Idioma): Cifra[] {
  const { cifras } = textosDe(idioma).inicio;
  const proyectos = datos.projects.filter((p) => !esPaquete(p)).length;
  return [
    { valor: "3+", etiqueta: cifras.anios },
    { valor: "8800+", etiqueta: cifras.usuarios },
    { valor: "~10", etiqueta: cifras.integraciones },
    { valor: String(proyectos), etiqueta: cifras.proyectos },
  ];
}
