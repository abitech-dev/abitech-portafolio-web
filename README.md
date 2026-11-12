# abitech-portafolio-web

Portafolio personal y blog de Abimael Fernandez Ventura, publicado en
[abitech.dev](https://abitech.dev). Sitio estático con Astro, islas de Vue
y Tailwind. El CV y los proyectos salen de `abitech-trayectoria`.

## Requisitos

- Node 26, fijado en `.node-version`. Con [fnm](https://github.com/Schniz/fnm),
  `fnm use` toma la versión correcta.
- `abitech-trayectoria` en la carpeta vecina, para copiar los datos.

## Uso

```bash
npm install
npm run datos        # copia resume.json y el CV público desde abitech-trayectoria
npm run capturas     # toma la portada de cada proyecto en línea
npm run dev          # http://localhost:4321
npm run verificar    # formato, estilo, tipos, pruebas y compilación
npm run e2e          # Playwright con axe, en celular y escritorio
npm run lighthouse   # Lighthouse CI sobre dist/
```

## Analítica

El sitio carga [Umami](https://umami.is) solo si el build recibe dos
variables de entorno. Sin ellas no se carga ningún script de medición.

| Variable           | Valor                                        |
| ------------------ | -------------------------------------------- |
| `PUBLIC_UMAMI_SRC` | URL del `script.js` de tu instancia de Umami |
| `PUBLIC_UMAMI_ID`  | Id del sitio que da Umami al registrarlo     |

Se miden tres eventos: `descargar-cv`, `escribir-correo` y `abrir-paquete`.

## Documentación

- [Decisiones de arquitectura](docs/decisiones/)
- [Cambios por versión](CHANGELOG.md)

## Créditos

El emoji de saludo del inicio es de
[Fluent Emoji](https://github.com/microsoft/fluentui-emoji) de Microsoft,
con licencia MIT ([texto](licencias/fluent-emoji.txt)). Los logos de los
proyectos son de cada proyecto.
