/** La portada se activa sola; las demás secciones, también en sus subrutas. */
export function estaActiva(ruta: string, actual: string): boolean {
  const limpia = actual.replace(/\/+$/, "") || "/";
  const esPortada = ruta === "/" || ruta === "/en";
  return esPortada ? limpia === ruta : limpia.startsWith(ruta);
}
