export interface Metadatos {
  titulo: string;
  descripcion: string;
  canonica: string;
}

const NOMBRE_DEL_SITIO = "Abimael Fernandez";

/** La portada lleva solo el nombre; las demás páginas, «Página | Nombre». */
export function metadatosDe(
  ruta: string,
  sitio: URL,
  descripcion: string,
  titulo?: string,
): Metadatos {
  return {
    titulo: titulo ? `${titulo} | ${NOMBRE_DEL_SITIO}` : NOMBRE_DEL_SITIO,
    descripcion: recortarDescripcion(descripcion),
    canonica: new URL(ruta.replace(/\/+$/, "") || "/", sitio).href,
  };
}

/** Google muestra unos 155 caracteres y WhatsApp aún menos. */
const LARGO_DE_DESCRIPCION = 155;

export function recortarDescripcion(texto: string): string {
  if (texto.length <= LARGO_DE_DESCRIPCION) return texto;
  const tramo = texto.slice(0, LARGO_DE_DESCRIPCION);
  const finDeOracion = tramo.lastIndexOf(". ");
  // Una oración muy corta dejaría la descripción casi vacía.
  if (finDeOracion >= LARGO_DE_DESCRIPCION * 0.5) {
    return tramo.slice(0, finDeOracion + 1);
  }
  return `${tramo.slice(0, tramo.lastIndexOf(" ", LARGO_DE_DESCRIPCION - 1))}…`;
}
