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
    descripcion,
    canonica: new URL(ruta.replace(/\/+$/, "") || "/", sitio).href,
  };
}
