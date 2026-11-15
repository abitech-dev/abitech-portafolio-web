export interface ParteDelExtracto {
  texto: string;
  isResaltado: boolean;
}

const ENTIDADES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

function decodificar(texto: string): string {
  return texto.replace(
    /&(amp|lt|gt|quot|#39);/g,
    (entidad) => ENTIDADES[entidad] ?? entidad,
  );
}

/** Pagefind marca las coincidencias con <mark>. Se pintan sin v-html. */
export function partirExtracto(extracto: string): ParteDelExtracto[] {
  return extracto
    .split(/(<mark>.*?<\/mark>)/)
    .filter((tramo) => tramo !== "")
    .map((tramo) => {
      const isResaltado = tramo.startsWith("<mark>");
      const texto = isResaltado ? tramo.slice(6, -7) : tramo;
      return { texto: decodificar(texto), isResaltado };
    });
}

/** El índice guarda la carpeta de cada página, con barra final. */
export function rutaDelResultado(url: string): string {
  return url.replace(/\/+$/, "") || "/";
}
