# Cambios

Formato de [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y
[Semantic Versioning](https://semver.org/lang/es/).

## [Sin publicar]

### Agregado

- Blog con artículos y notas, etiquetas, tiempo de lectura, RSS y
  datos de artículo de schema.org. Aparece en el menú cuando hay algo
  publicado.
- Primer artículo, sobre cómo está hecho el sitio.
- Proyecto base con Astro 7, Vue 3.5, Tailwind 4.3 y TypeScript 6
  estricto.
- Portada con el nombre, el titular y el resumen de `resume.json`.
- Puertas de calidad: Prettier, ESLint, `astro check`, Vitest y
  Playwright con axe.
- Diseño base con tarjeta fija y foto, tema claro y oscuro, y
  transiciones entre páginas.
- Páginas de inicio, sobre mí, CV, contacto y 404, con datos de
  `resume.json` y la persona de schema.org.
- Fuentes Inter y JetBrains Mono servidas desde el sitio.
- Proyectos con filtro por tecnología, página de cada caso con su
  captura, logos propios y de tecnologías.
- Código abierto, con los paquetes separados de los proyectos.
- Aprende, con los libros, en lugar de la página Libros.
- CV en PDF para descargar, generado sin contacto reservado.
- Barra compacta con menú desplegable en el celular.
- Versión en inglés bajo `/en`, con `hreflang` y enlace para cambiar de
  idioma.
- Imagen para compartir por página, `robots.txt` y `llms.txt`.
- Grafo de schema.org con el sitio y la persona enlazados por `@id`.
- Analítica opcional con Umami, activada por variables de entorno.

### Cambiado

- Portada personal con una misión, tres frentes, proyectos destacados en
  bloques alternados con captura real y un recorrido por años.
- Proyectos en lista de filas en lugar de tarjetas, títulos en Sora y
  entradas suaves al hacer scroll.
- Barra lateral fija con el contenido alineado a su lado y menú a
  pantalla completa en el celular.
- Pie con un llamado a escribir o descargar el CV, el año y la fecha de
  actualización.
- Colores, favicon y firma de ABItech Perú, y logos en el filtro de
  proyectos.
- Menú ordenado por lo que busca cada visitante, con el CV a la vista.
- Esquinas menos redondeadas, sin degradados y foto de la tarjeta más
  alejada.
- Estilos incrustados en el HTML y solo los pesos de fuente que se usan.

### Quitado

- Subtítulo tipeado y fondo de líneas animado.
