# Publicar desde el celular

Cómo escribir una entrada del blog desde el navegador o la app de GitHub,
sin computadora. La decisión detrás está en el
[ADR 0003](../decisiones/0003-editar-con-github-y-buscar-con-pagefind.md).

## Pasos

1. En GitHub abre el repositorio y cambia a la rama `develop`.
2. Entra a `src/content/escritos/es/` y elige **Add file → Create new
   file**.
3. Ponle de nombre el identificador de la entrada, en minúsculas y con
   guiones, por ejemplo `actas-sin-senal.md`.
4. Pega la plantilla y escribe debajo.
5. En **Commit changes**, elige **Create a new branch** con el nombre
   `feature/nota-<identificador>` y abre el PR hacia `develop`.
6. Con la CI en verde, une el PR. Sale a producción con el siguiente paso
   de `develop` a `main`.

## Plantilla

```markdown
---
titulo: Título de la entrada
descripcion: Una o dos frases de hasta 155 caracteres.
fecha: 2026-11-15
tipo: nota
etiquetas: [tema, otro-tema]
borrador: true
---

Primer párrafo.
```

| Campo       | Valores                                                       |
| ----------- | ------------------------------------------------------------- |
| `tipo`      | `articulo` para textos largos y `nota` para cortos            |
| `etiquetas` | En minúsculas y con guiones                                   |
| `borrador`  | `true` la guarda sin publicar. Se cambia a `false` al revisar |

## Versión en inglés

Es opcional. Va en `src/content/escritos/en/` con el mismo nombre de
archivo, y el selector de idioma enlaza las dos versiones.
