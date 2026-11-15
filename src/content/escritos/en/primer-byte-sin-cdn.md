---
titulo: How I sped up my site without a CDN, with the server in Europe
descripcion: From Peru, the first visit to my site was slow. With three changes, the HTML went from 0.87 to 0.64 s and the photo from 1.45 to 1.14 s.
fecha: 2026-11-14
tipo: nota
etiquetas: [performance, nginx, networking]
borrador: false
---

On a first visit to abitech.dev, the photo and the fonts took a while to
appear. On my computer it loaded instantly. The server is in Europe and I am
in Peru, and each message that goes to the server and comes back takes about
200 ms. That back and forth is called a **round trip**. I could not move the
server or use a CDN, which is a network of servers around the world that keep
copies of a site close to each visitor. So I measured where the time went.

## The result

| Measure, on the first visit        | Before  | After   |
| ---------------------------------- | ------- | ------- |
| Wait until the response starts     | 390 ms  | 200 ms  |
| Full HTML                          | 0.87 s  | 0.64 s  |
| Photo visible                      | 1.45 s  | 1.14 s  |
| Fonts requested with high priority | 8 files | 2 files |

There are three changes, one in the web server, one in the server's network
and one in the site.

## Measure before changing anything

Chrome measures each phase of the load. On the first visit, the HTML broke
down like this.

| Phase                                   | Time   |
| --------------------------------------- | ------ |
| Open the connection (TCP)               | 195 ms |
| Agree on HTTPS encryption (TLS)         | 210 ms |
| Wait for the first byte of the response | 390 ms |

Opening the connection and agreeing on encryption took the normal time. Each
one needs one round trip, about 200 ms. Waiting for the first byte, however,
took twice as long. Requesting the HTML and receiving the start of the
response should also cost a single trip, 200 ms, and it cost 390. Small files,
under 6 KB, did arrive in one trip. The larger ones, such as the HTML, fonts
and images, always added an extra trip.

From the server itself, the site answered in 3 ms. The time was lost on the
way.

## First change. Smaller encryption blocks

nginx, the web server, encrypts data in 16 KB blocks, and the browser cannot
read anything until it has a full block. When a connection opens, the server
can only send about 14 KB at once before waiting for the browser to confirm it
received them. That limit is called the **initial window**. A 16 KB block does
not fit in 14 KB, so the browser waits a second trip before it can read the
first byte. Ilya Grigorik explains it in _High Performance Browser
Networking_.

One line in the nginx configuration was enough.

```nginx
ssl_buffer_size 4k;
```

With 4 KB blocks, the first one arrives in the first flight. The wait dropped
from 390 to 200 ms, the minimum possible at this distance.

## Second change. A bigger initial window

The compressed HTML weighs 32 KB and still did not fit in the 14 KB of the
first flight. Linux lets you raise that initial window.

```bash
ip route change default via <gateway> dev eth0 onlink initcwnd 32 initrwnd 32
```

With 32 packets, the first flight carries about 46 KB and the whole HTML
arrives in a single trip. I also enabled BBR, a method from Google that
adjusts the sending speed to the state of the network. The full HTML went from
0.87 to 0.64 s.

## Third change. Variable fonts

The site requested 8 font files with high priority, one per font weight, and
the photo, only 7 KB, waited behind them. I replaced them with variable fonts,
where a single file carries every weight. Now 2 files are requested with
priority, one for Inter and one for Sora, and the photo also gets high
priority.

```astro
<Font cssVariable="--font-inter" preload={[{ style: "normal" }]} />
<Font cssVariable="--font-sora" preload={[{ style: "normal" }]} />
```

Since no weight arrives late, the text no longer moves while the page loads.
With Peru's latency simulated in Chrome, the photo went from 1.14 to 0.50 s.

## What remains

A first visit from Peru still needs three round trips to Europe, to open the
connection, agree on encryption and request the page. That only goes down with
a CDN. From the second visit on, the browser already has the fonts, the photo
and the JavaScript stored, and the photo appears in 0.23 s.
