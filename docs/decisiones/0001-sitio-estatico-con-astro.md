# 0001. Sitio estático con Astro e islas de Vue

- Estado: aceptada
- Fecha: 2026-11-10

## Contexto

El portafolio necesita velocidad, buen SEO y un blog fácil de mantener.
El plan anterior usaba Django con Wagtail, con base de datos y panel
propio. Los cursos se publican en plataformas externas, así que el sitio
no maneja usuarios ni pagos.

## Decisión

- Astro 7 genera HTML estático. Vue 3.5 solo se carga en las islas que
  necesitan interacción.
- El contenido vive en Markdown dentro del repositorio. El CV, los
  proyectos, los cursos y los libros llegan como `resume.json` desde
  `abitech-trayectoria`.
- Lo que necesite backend se construye como otro repositorio
  (`abitech-<producto>-api` o `-app`) y el sitio lo consume al compilar,
  en una ruta concreta o con un enlace.

## Consecuencias

- Lighthouse alto y una imagen pequeña, porque Caddy sirve `dist/` sin
  Node.
- No hay panel propio. Si hace falta editar desde el celular, Keystatic
  guarda en el mismo repositorio.
- El sitio deja de servir como muestra de Django.
