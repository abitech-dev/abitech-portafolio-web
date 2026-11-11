export interface Enlace {
  ruta: string;
  etiqueta: string;
  icono: string;
}

export const SECCIONES: readonly Enlace[] = [
  { ruta: "/", etiqueta: "Inicio", icono: "lucide:house" },
  { ruta: "/sobre-mi", etiqueta: "Sobre mí", icono: "lucide:user" },
  { ruta: "/cv", etiqueta: "CV", icono: "lucide:file-text" },
  { ruta: "/contacto", etiqueta: "Contacto", icono: "lucide:send" },
];

/** La portada solo está activa en «/»; las demás, también en sus subrutas. */
export function estaActiva(ruta: string, actual: string): boolean {
  const limpia = actual.replace(/\/+$/, "") || "/";
  return ruta === "/" ? limpia === "/" : limpia.startsWith(ruta);
}
