import { textosDe } from "@/i18n/idioma";
import { type Idioma } from "@/i18n/rutas";

function partes(fecha: string, idioma: Idioma): Intl.DateTimeFormatPart[] {
  const [anio, mes = "01"] = fecha.split("-");
  return new Intl.DateTimeFormat(textosDe(idioma).fechas.locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(new Date(Date.UTC(Number(anio), Number(mes) - 1)));
}

/** «2025-11» pasa a «nov. 2025» en español y a «Nov 2025» en inglés. */
export function mesYAnio(fecha: string, idioma: Idioma = "es"): string {
  return partes(fecha, idioma)
    .map((parte) => parte.value)
    .join("");
}

/** El mes sale de la fecha completa, en minúscula como dentro de ella. */
function mes(fecha: string, idioma: Idioma): string {
  const parte = partes(fecha, idioma).find(({ type }) => type === "month");
  return parte?.value ?? mesYAnio(fecha, idioma);
}

/** «desde nov. 2025», «ene. a oct. 2026» o «nov. 2024 a feb. 2025». */
export function periodo(
  inicio: string,
  fin?: string,
  idioma: Idioma = "es",
): string {
  const { desde, hasta } = textosDe(idioma).fechas;
  if (!fin) return `${desde} ${mesYAnio(inicio, idioma)}`;
  if (fin === inicio) return mesYAnio(inicio, idioma);
  const primero =
    inicio.slice(0, 4) === fin.slice(0, 4)
      ? mes(inicio, idioma)
      : mesYAnio(inicio, idioma);
  return `${primero} ${hasta} ${mesYAnio(fin, idioma)}`;
}
