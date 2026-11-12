---
titulo: Cómo construí mi sitio con Astro y una sola fuente de datos
descripcion: Por qué mi CV, mis perfiles y este sitio salen de los mismos datos, y qué decisiones técnicas lo hacen rápido, bilingüe y fácil de mantener.
fecha: 2026-11-12
tipo: articulo
etiquetas: [astro, arquitectura, seo]
---

Durante años tuve mi información repartida en muchos lugares. El CV en Word,
el perfil de LinkedIn, cada portal de empleo y una página personal que nunca
actualizaba. Cada vez que terminaba un proyecto tenía que copiar el mismo
logro en cinco sitios, y siempre alguno quedaba atrasado.

Este sitio nació para resolver eso. Aquí cuento las decisiones que tomé y por
qué.

## Una sola fuente de datos

Toda mi trayectoria vive en archivos YAML dentro de un repositorio privado.
Ahí están mis empleos, proyectos, logros, certificaciones e idiomas, cada
dato con su nivel de visibilidad. Un programa en Python valida esos archivos
con Pydantic y genera todo lo demás. Mi CV en PDF, los textos que pego en cada
portal y un archivo `resume.json` con el formato estándar de JSON Resume.

El sitio solo lee ese `resume.json`. Si mañana agrego un proyecto, lo escribo
una vez y aparece en el CV, en los portales y aquí. Los proyectos de clientes
privados salen con un nombre genérico, porque el filtro de visibilidad se
aplica antes de exportar.

## Un sitio estático con poco JavaScript

Elegí [Astro](https://astro.build) porque genera HTML en el momento de
construir el sitio y solo envía JavaScript donde de verdad hace falta. En este
sitio eso es el botón de tema, una isla de Vue. El resto es HTML y CSS.

El resultado se mide. Lighthouse da entre 95 y 100 en rendimiento y 100 en
accesibilidad, buenas prácticas y SEO, medido sobre la compilación y no sobre
el servidor de desarrollo.

## Dos idiomas sin duplicar páginas

Cada página vive una sola vez bajo una ruta `[...idioma]`. El español va en la
raíz y el inglés bajo `/en`. Los textos fijos están en un diccionario por
idioma, y TypeScript obliga a que el inglés tenga las mismas claves que el
español.

```ts
const es = {
  inicio: { saludo: "Hola, soy" },
};

export type Textos = typeof es;

const en: Textos = {
  inicio: { saludo: "Hi, I'm" },
};
```

Si agrego un texto en español y olvido traducirlo, el sitio no compila. Cada
página declara además su par en el otro idioma con `hreflang`, para que los
buscadores muestren la versión correcta.

## Pensado para buscadores y para IA

Cada página tiene su imagen para compartir de 1200 por 630, generada al
construir el sitio con mi foto, el título y mi nombre. Pesa unos 40 KB en JPG.
También hay un grafo de schema.org donde el sitio, mi persona y cada proyecto
se enlazan por su identificador, y un archivo `llms.txt` que resume el sitio
en Markdown para los modelos de lenguaje.

## Pruebas que cuidan lo que ya funciona

El sitio tiene pruebas unitarias con Vitest y pruebas de navegador con
Playwright, en celular y en escritorio, con revisión de accesibilidad de axe en
cada página.

Una de ellas nació de un error real. En el celular, el botón del menú quedaba
fuera de la pantalla. La grilla del diseño tomaba el ancho del nombre completo,
que no se cortaba, y empujaba todo hacia la derecha. La solución fue una línea
de CSS, pero la prueba que dejé revisa que ninguna página se desborde a lo
ancho, para que no vuelva a pasar.

```ts
test("ninguna página se desborda a lo ancho", async ({ page }) => {
  for (const { ruta } of PAGINAS) {
    await page.goto(ruta);
    const [total, visible] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      window.innerWidth,
    ]);
    expect(total, ruta).toBeLessThanOrEqual(visible);
  }
});
```

## Lo que sigue

El siguiente paso es publicarlo con Docker y Caddy en mi propio servidor, con
las cabeceras de seguridad configuradas desde el inicio. Y seguir escribiendo
aquí sobre lo que construyo.

El código del sitio es público en
[GitHub](https://github.com/abitech-dev/abitech-portafolio-web), por si quieres
revisar cómo está hecho.
