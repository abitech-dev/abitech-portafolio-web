---
titulo: Actas sin señal que no se duplican al volver la conexión
descripcion: Cómo hice que una PWA guarde actas sin internet y las envíe una sola vez, aunque la red falle a mitad del envío.
fecha: 2026-11-12
tipo: nota
etiquetas: [pwa, offline, laravel]
borrador: true
---

Para un cliente desarrollé una aplicación web instalable donde los técnicos
llenan y firman en el celular sus actas de mantenimiento eléctrico. Muchas
veces trabajan sin señal, así que la aplicación tenía que guardar todo en el
teléfono y enviarlo cuando volviera la conexión.

Guardar sin internet es la parte fácil. Lo difícil es enviar una sola vez. Si
el envío llega al servidor pero la respuesta se pierde, el teléfono cree que
falló y lo vuelve a intentar. Sin cuidado, eso crea dos actas iguales.

## El identificador nace en el teléfono

Cada borrador recibe un identificador único en el momento en que se crea, en
el celular y sin preguntar al servidor. Se guarda junto con el borrador y sus
fotos en IndexedDB.

```ts
const borrador = {
  clientUuid: crypto.randomUUID(),
  datos,
  creadoEn: Date.now(),
};
await db.borradores.put(borrador);
```

Ese identificador viaja en cada intento de envío. Así el servidor reconoce que
es el mismo borrador aunque llegue dos veces.

`crypto.randomUUID` solo funciona en un contexto seguro, con HTTPS. En el
entorno de pruebas, que usaba HTTP, la aplicación genera el identificador por
otro camino.

## El servidor no crea dos veces lo mismo

Del lado de Laravel, abrir un acta es una operación que se puede repetir sin
efectos extra. Dentro de una transacción, el servidor busca el acta del
servicio y solo la crea si no existe.

```php
$acta = Acta::firstOrCreate(
    ['servicio_id' => $servicio->id],
    ['client_uuid' => $clientUuid, ...$atributos],
);
```

Si el mismo identificador aparece ligado a otra inspección, el servidor no
adivina. Responde con un conflicto y la aplicación le muestra al técnico qué
pasó.

## Las firmas también se protegen en el teléfono

Las firmas quedan guardadas mientras no hay conexión, así que las cifré con
AES-GCM usando la Web Crypto API. La llave se crea marcada como no exportable.
Quien copie la base de datos del teléfono solo ve bytes cifrados.

La idea que me llevo es que, en una aplicación sin conexión, la identidad de
cada registro tiene que nacer donde se crea el registro, no en el servidor.
