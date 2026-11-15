# 0003. Editar desde GitHub y buscar con Pagefind

- Estado: aceptada
- Fecha: 2026-11-15

## Contexto

El plan de la etapa 2 incluía Keystatic para escribir desde el celular y
un buscador para todo el sitio. Keystatic inicia sesión con GitHub a
través de rutas de servidor (`/keystatic` y `/api/keystatic`), y el sitio
es estático, servido por Caddy sin Node, según el ADR 0001.

## Decisión

- **Edición.** Las entradas del blog se escriben en el editor web de
  GitHub, desde el navegador o la app del celular, en una rama propia y
  con PR a `develop`. Keystatic queda descartado.
- **Búsqueda.** Pagefind indexa el sitio al compilar y busca en el
  navegador, sin servidor. Cada idioma tiene su índice.
  - Entran las páginas con contenido propio, marcadas con `tipoEnBuscador`.
    Esa etiqueta sale en cada resultado (Nota, Proyecto, Libro).
  - Quedan fuera los bloques de código, los textos para lectores de
    pantalla y los enlaces de volver (`pagefind.yml`).

## Consecuencias

- No hay servidor nuevo ni otra sesión que proteger, y cada entrada pasa
  por la misma CI que el código.
- El editor de GitHub no tiene formularios ni vista previa del sitio. El
  formato se copia de la plantilla de la guía.
- La CSP suma `'wasm-unsafe-eval'`, porque Pagefind busca con
  WebAssembly.
