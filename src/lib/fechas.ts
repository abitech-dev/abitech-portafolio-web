import { textosDe } from "@/i18n/idioma";
import { type Idioma } from "@/i18n/rutas";

/** «2025-11» pasa a «nov. 2025» en español y a «Nov 2025» en inglés. */
export function mesYAnio(fecha: string, idioma: Idioma = "es"): string {
  const [anio, mes = "01"] = fecha.split("-");
  const formato = new Intl.DateTimeFormat(textosDe(idioma).fechas.locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  return formato.format(new Date(Date.UTC(Number(anio), Number(mes) - 1)));
}

/** Sin fin, el periodo llega hasta la actualidad. */
export function periodo(
  inicio: string,
  fin?: string,
  idioma: Idioma = "es",
): string {
  const final = fin
    ? mesYAnio(fin, idioma)
    : textosDe(idioma).fechas.actualidad;
  return `${mesYAnio(inicio, idioma)}-${final}`;
}
