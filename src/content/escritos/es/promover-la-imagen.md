---
titulo: La misma imagen Docker de develop a producción, sin reconstruirla
descripcion: Si la imagen Docker lleva el código del commit, unir develop con main obliga a reconstruirla. Con la huella del árbol de Git se publica la probada.
fecha: 2026-11-20
tipo: nota
etiquetas: [git, docker, ci-cd]
borrador: false
---

Probar una imagen y publicar otra es como probar un pastel y vender otro
recién horneado. El nuevo puede salir distinto y nadie lo probó. En mi sitio,
producción encuentra el pastel que se probó gracias a una etiqueta que no
cambia. En los 15 despliegues de noviembre de 2026, ninguno reconstruyó la
imagen.

## Cinco palabras, explicadas con un pastel

| Palabra  | Qué es                                                               | En la pastelería                 |
| -------- | -------------------------------------------------------------------- | -------------------------------- |
| Commit   | Cada cambio guardado en Git, con su código, fecha y autor            | El pedido, con su número y fecha |
| Imagen   | La aplicación ya construida, lista para correr                       | El pastel horneado               |
| Etiqueta | El nombre para buscar la imagen, una palabra como `prod` o un código | El rótulo del pastel             |
| Árbol    | Los archivos tal como quedan en ese commit                           | La receta                        |
| Huella   | Un código que Git calcula con esos archivos                          | Un código que sale de la receta  |

Cómo pasa la imagen de un ambiente a otro se explica en la
[guía de ramas y ambientes](/blog/ramas-y-ambientes).

## Por qué producción no encuentra la imagen

La imagen se construye y se prueba al unir un cambio a `develop`. Después,
unir `develop` con `main` crea otro commit, con otro código. Con códigos de
ejemplo, las dos formas de etiquetar la imagen se comparan así.

| Paso                 | Con el código del commit                   | Con la huella del árbol                   |
| -------------------- | ------------------------------------------ | ----------------------------------------- |
| Al probar en develop | Etiqueta `a1b2c3`                          | Etiqueta `arbol-7f8e9d`                   |
| Al unir con main     | El commit cambia a `d4e5f6`                | El árbol sigue siendo `7f8e9d`            |
| Producción busca     | `d4e5f6` y no la encuentra                 | `arbol-7f8e9d` y la encuentra             |
| Resultado            | Reconstruye la imagen                      | Publica la imagen probada                 |
| En la pastelería     | Busca el pedido nuevo y hornea otro pastel | Busca la receta y vende el pastel probado |

La primera forma, la que falla, es la más fácil de configurar. En GitHub
Actions, el servicio que construye y despliega solo, basta escribir `type=sha`
en [docker/metadata-action](https://github.com/docker/metadata-action). La
segunda no viene lista, así que mi sitio calcula la huella aparte.

## Por qué la huella no cambia con el merge

El código de un commit se calcula con todo lo que guarda, incluida la fecha.
La huella del árbol se calcula solo con los archivos, como explica
[Pro Git](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects), el libro
oficial de Git.

| Entra en el cálculo                      | Commit | Árbol |
| ---------------------------------------- | ------ | ----- |
| El nombre y el contenido de cada archivo | Sí     | Sí    |
| La fecha y quién unió el cambio          | Sí     | No    |
| El mensaje del commit                    | Sí     | No    |
| El commit anterior                       | Sí     | No    |

Si nadie cambió `main` por su cuenta, después del merge tiene los mismos
archivos que `develop`. Por eso la huella es la misma.

## Buscarla y promoverla

Promover es ponerle la etiqueta `prod` a la imagen probada, sin
reconstruirla. Es como cambiar el cartel del pastel de «en prueba» a «a la
venta».

Jez Humble y David Farley recomiendan construir una sola vez en _Continuous
Delivery_ (2010). [The Twelve-Factor App](https://12factor.net/build-release-run)
pide lo mismo al separar la construcción de la publicación.

```bash
IMAGEN=ghcr.io/usuario/sitio
arbol=$(git rev-parse 'HEAD^{tree}')

if docker buildx imagetools inspect "$IMAGEN:arbol-$arbol" > /dev/null; then
  docker buildx imagetools create --tag "$IMAGEN:prod" \
    "$IMAGEN:arbol-$arbol"
fi
```

`git rev-parse` calcula la huella del árbol. `inspect` pregunta si la imagen
existe y `create` le suma la etiqueta `prod`.

Si no la encuentra, como con un arreglo hecho directo en `main`, la
reconstruye y la prueba. Al final, el sitio debe responder con la huella que
la imagen guarda en `/version.txt`. Así confirmo que está publicada la imagen
correcta.

## El resultado

| Medida, noviembre de 2026                           | Valor         |
| --------------------------------------------------- | ------------- |
| Despliegues a producción                            | 15            |
| Despliegues que reconstruyeron la imagen            | 0             |
| Construir, probar y revisar la seguridad en develop | de 64 a 156 s |
| Desplegar en producción con la imagen lista         | de 31 a 76 s  |

Lo medí en el historial de GitHub Actions con `gh run list` y `gh run view`.
Sin la huella, cada despliegue sumaría el tiempo de la tercera fila.

## Cuándo sirve y cuándo no

- **Sirve** cuando `main` solo recibe merges desde una rama ya probada.
- **No sirve** si alguien hace commits directo en `main`, porque el árbol
  cambia y hay que reconstruir la imagen.
- **Tampoco sirve** si cada ambiente necesita su propia imagen, como una web
  que guarda la dirección de su API al construirse. Es la forma A de la
  [guía de ramas y ambientes](/blog/ramas-y-ambientes).
