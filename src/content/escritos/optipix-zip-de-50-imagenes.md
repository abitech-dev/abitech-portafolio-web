---
titulo: Por qué OptiPix descarga las imágenes en ZIP de 50
descripcion: Comprimir cientos de fotos en el navegador llenaba la memoria de la pestaña. Así lo resolví partiendo la descarga en bloques.
fecha: 2026-11-12
tipo: nota
etiquetas: [javascript, rendimiento, navegador]
borrador: true
---

[OptiPix](https://optipix.abitech.com.pe) es mi versión de Squoosh de Google.
Reduce el peso de las imágenes dentro del navegador, sin subirlas a ningún
servidor. Le agregué un modo por lotes para optimizar muchas fotos a la vez y
descargarlas juntas en un archivo ZIP.

Con pocas fotos funcionaba bien. Con cientos, la pestaña se quedaba sin memoria
y se cerraba.

## Dónde se iba la memoria

El ZIP se arma en el navegador con la librería `fflate`. Para generarlo hay que
tener en memoria, al mismo tiempo, cada imagen comprimida y el archivo ZIP
completo. Con cientos de fotos, esa suma supera lo que la pestaña puede usar.

## Partir la descarga en bloques

La solución fue dejar de armar un solo ZIP. Ahora las imágenes se reparten en
bloques de hasta 50, y cada bloque se convierte en su propio archivo.

```ts
const TAMANO_DEL_BLOQUE = 50;

for (let i = 0; i < imagenes.length; i += TAMANO_DEL_BLOQUE) {
  const bloque = imagenes.slice(i, i + TAMANO_DEL_BLOQUE);
  const zip = zipSync(await contenidoDe(bloque));
  const url = URL.createObjectURL(new Blob([zip], { type: "application/zip" }));

  descargar(url, `optipix-parte${i / TAMANO_DEL_BLOQUE + 1}.zip`);
  await esperar(500);
  URL.revokeObjectURL(url);
}
```

Después de cada descarga espero medio segundo y libero la URL del archivo,
para que el navegador termine de guardarlo y recupere esa memoria antes de
armar el siguiente bloque.

## Otros dos cuidados

Antes de comprimir, OptiPix reduce las imágenes demasiado grandes, que eran las
que más memoria pedían. Y las miniaturas de la lista se decodifican de a tres a
la vez, en una cola, para que cargar muchas fotos no congele la pantalla.

La lección es simple. En el navegador, la memoria es un recurso que se reparte
con todo lo demás, y procesar por partes casi siempre es más seguro que hacerlo
todo de una vez.
