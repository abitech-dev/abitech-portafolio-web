const FORMATO = new Intl.DateTimeFormat("es-PE", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** «2025-11» pasa a «nov. 2025», con la abreviatura de la RAE. */
export function mesYAnio(fecha: string): string {
  const [anio, mes = "01"] = fecha.split("-");
  return FORMATO.format(new Date(Date.UTC(Number(anio), Number(mes) - 1)));
}

/** Sin fin, el periodo llega hasta la actualidad. */
export function periodo(inicio: string, fin?: string): string {
  return `${mesYAnio(inicio)}-${fin ? mesYAnio(fin) : "actualidad"}`;
}
