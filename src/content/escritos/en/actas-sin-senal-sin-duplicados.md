---
titulo: Offline reports that do not duplicate when the connection returns
descripcion: How I made a PWA save reports without internet and send them only once, even when the network fails halfway through the upload.
fecha: 2026-11-12
tipo: nota
etiquetas: [pwa, offline, laravel]
borrador: true
---

For a client, I built an installable web app where technicians fill in and
sign their electrical maintenance reports on their phones. They often work
without signal, so the app had to store everything on the phone and send it
when the connection came back.

Saving offline is the easy part. The hard part is sending only once. If the
upload reaches the server but the response is lost, the phone thinks it failed
and tries again. Without care, that creates two identical reports.

## The identifier is born on the phone

Each draft gets a unique identifier the moment it is created, on the phone and
without asking the server. It is stored with the draft and its photos in
IndexedDB.

```ts
const borrador = {
  clientUuid: crypto.randomUUID(),
  datos,
  creadoEn: Date.now(),
};
await db.borradores.put(borrador);
```

That identifier travels with every upload attempt. This way the server knows
it is the same draft even if it arrives twice.

`crypto.randomUUID` only works in a secure context, over HTTPS. In the testing
environment, which used HTTP, the app generates the identifier another way.

## The server never creates the same thing twice

On the Laravel side, opening a report is an operation that can be repeated
without side effects. Inside a transaction, the server looks for the report of
that service and only creates it if it does not exist.

```php
$acta = Acta::firstOrCreate(
    ['servicio_id' => $servicio->id],
    ['client_uuid' => $clientUuid, ...$atributos],
);
```

If the same identifier shows up linked to another inspection, the server does
not guess. It answers with a conflict and the app shows the technician what
happened.

## Signatures are protected on the phone too

Signatures stay stored while there is no connection, so I encrypted them with
AES-GCM using the Web Crypto API. The key is created as non-extractable.
Anyone who copies the phone's database only sees encrypted bytes.

The lesson I take away is that in an offline app, the identity of each record
has to be born where the record is created, not on the server.
