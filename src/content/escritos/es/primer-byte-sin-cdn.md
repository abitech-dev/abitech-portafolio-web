---
titulo: Cómo aceleré mi sitio sin CDN con el servidor en Europa
descripcion: Desde Perú, la primera visita a mi sitio tardaba. Con tres ajustes, el HTML pasó de 0,87 a 0,64 s y la foto de 1,45 a 1,07 s.
fecha: 2026-11-14
tipo: nota
etiquetas: [rendimiento, nginx, redes]
borrador: false
---

Al entrar a abitech.dev por primera vez, la foto y las fuentes tardaban en
aparecer. En mi computadora cargaba al instante. El servidor está en Europa y
yo en Perú, y cada mensaje que va al servidor y vuelve tarda unos 200 ms. A
ese ida y vuelta se le llama **viaje**. No podía mover el servidor ni usar un
CDN, que es una red de servidores repartidos por el mundo que guardan copias
del sitio cerca de cada visitante. Así que medí dónde se iba el tiempo.

## El resultado

| Medida, en la primera visita          | Antes      | Después    |
| ------------------------------------- | ---------- | ---------- |
| Espera hasta que empieza la respuesta | 390 ms     | 200 ms     |
| HTML completo                         | 0,87 s     | 0,64 s     |
| Foto visible                          | 1,45 s     | 1,07 s     |
| Fuentes pedidas con prioridad         | 8 archivos | 3 archivos |

Son tres ajustes, uno en el servidor web, otro en la red del servidor y otro
en el sitio.

## Medir antes de tocar

Chrome mide cada fase de la carga. En la primera visita, el HTML se repartía
así.

| Fase                                   | Tiempo |
| -------------------------------------- | ------ |
| Abrir la conexión (TCP)                | 195 ms |
| Acordar el cifrado de HTTPS (TLS)      | 210 ms |
| Esperar el primer byte de la respuesta | 390 ms |

Abrir la conexión y acordar el cifrado tardaron lo normal. Cada uno necesita
un viaje, unos 200 ms. Esperar el primer byte, en cambio, tardó el doble.
Pedir el HTML y recibir el inicio de la respuesta también debería costar un
solo viaje, 200 ms, y costaba 390. Los archivos pequeños, de menos de 6 KB,
sí llegaban en un viaje. Los más grandes, como el HTML, las fuentes y las
imágenes, sumaban siempre un viaje extra.

Desde el propio servidor, el sitio respondía en 3 ms. El tiempo se perdía en
el camino.

## Primer ajuste. Bloques de cifrado más pequeños

nginx, el servidor web, cifra los datos en bloques de 16 KB, y el navegador
no puede leer nada hasta tener un bloque completo. Al abrir una conexión, el
servidor solo puede enviar unos 14 KB de golpe antes de esperar que el
navegador confirme que los recibió. Ese límite se llama **ventana inicial**.
Un bloque de 16 KB no cabe en 14 KB, así que el navegador espera un segundo
viaje para poder leer el primer byte. Ilya Grigorik lo explica en _High
Performance Browser Networking_.

Bastó una línea en la configuración de nginx.

```nginx
ssl_buffer_size 4k;
```

Con bloques de 4 KB, el primero llega en el primer envío. La espera bajó de
390 a 200 ms, el mínimo posible a esta distancia.

## Segundo ajuste. Una ventana inicial más grande

El HTML comprimido pesa 32 KB y seguía sin caber en los 14 KB del primer
envío. Linux permite ampliar esa ventana inicial.

```bash
ip route change default via <gateway> dev eth0 onlink initcwnd 32 initrwnd 32
```

Con 32 paquetes, el primer envío lleva unos 46 KB y el HTML llega entero en
un solo viaje. También activé BBR, un método de Google que ajusta la
velocidad de envío según el estado de la red. El HTML completo pasó de 0,87 a
0,64 s.

## Tercer ajuste. Menos fuentes con prioridad

El sitio pedía 8 archivos de fuente con prioridad alta antes de que la página
los usara, y la foto, de apenas 7 KB, esperaba detrás de ellos. Ahora solo se
piden así las fuentes del texto y de los títulos.

```astro
<Font cssVariable="--font-inter" preload={[{ weight: 400 }]} />
<Font cssVariable="--font-sora" preload={[{ weight: 700 }]} />
```

Las demás llegan cuando la página las necesita. La foto pasó de 1,45 a 1,07 s.

## Lo que queda

Una primera visita desde Perú todavía necesita tres viajes a Europa, entre
abrir la conexión, acordar el cifrado y pedir la página. Eso solo baja con un
CDN. Desde la segunda visita, el navegador ya tiene guardadas las fuentes, la
foto y el JavaScript, y la foto aparece en 0,23 s.
