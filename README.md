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
npm run datos        # copia resume.json desde abitech-trayectoria
npm run dev          # http://localhost:4321
npm run verificar    # formato, estilo, tipos, pruebas y compilación
npm run e2e          # Playwright con axe, en celular y escritorio
npm run lighthouse   # Lighthouse CI sobre dist/
```

## Documentación

- [Decisiones de arquitectura](docs/decisiones/)
- [Cambios por versión](CHANGELOG.md)
