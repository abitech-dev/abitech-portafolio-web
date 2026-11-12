---
titulo: Why OptiPix downloads images in ZIP files of 50
descripcion: Compressing hundreds of photos in the browser filled the tab's memory. This is how I fixed it by splitting the download into blocks.
fecha: 2026-11-12
tipo: nota
etiquetas: [javascript, performance, browser]
borrador: true
---

[OptiPix](https://optipix.abitech.com.pe) is my own version of Google's
Squoosh. It shrinks images inside the browser, without uploading them to any
server. I added a batch mode to optimize many photos at once and download them
together in a ZIP file.

With a few photos it worked fine. With hundreds, the tab ran out of memory and
closed.

## Where the memory went

The ZIP is built in the browser with the `fflate` library. To generate it,
every compressed image and the full ZIP file have to be in memory at the same
time. With hundreds of photos, that adds up to more than the tab can use.

## Splitting the download into blocks

The fix was to stop building a single ZIP. Now the images are split into
blocks of up to 50, and each block becomes its own file.

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

After each download I wait half a second and release the file's URL, so the
browser finishes saving it and recovers that memory before building the next
block.

## Two more safeguards

Before compressing, OptiPix shrinks images that are too large, which were the
ones asking for the most memory. And the thumbnails in the list are decoded
three at a time, in a queue, so loading many photos does not freeze the
screen.

The lesson is simple. In the browser, memory is shared with everything else,
and processing in parts is almost always safer than doing everything at once.
