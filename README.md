<div align="center">

# abitech.dev

Portafolio y blog de Abimael Fernandez, desarrollador full stack en
Huánuco, Perú.

[Visitar el sitio](https://abitech.dev) &nbsp;|&nbsp;
[Leer el blog](https://abitech.dev/blog) &nbsp;|&nbsp;
[English version](https://abitech.dev/en)

[![Integración continua](https://github.com/abitech-dev/abitech-portafolio-web/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/abitech-dev/abitech-portafolio-web/actions/workflows/ci.yml)
![Astro 7](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)
![Vue 3.5](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![TypeScript 6](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/capturas/inicio-oscuro.png">
  <img alt="Inicio de abitech.dev con la barra lateral, el saludo y la sección Lo que hago" src="docs/capturas/inicio-claro.png">
</picture>

## Qué hay en el sitio

| Sección        | Contenido                                                    |
| -------------- | ------------------------------------------------------------ |
| Proyectos      | Sistemas en producción con capturas, tecnologías y enlaces   |
| Blog           | Artículos y notas en español e inglés, con etiquetas y RSS   |
| Aprende        | Libros para aprender tecnología en español                   |
| Código abierto | Paquetes para Laravel                                        |
| CV             | Trayectoria completa, con descarga en PDF en los dos idiomas |
| Datos          | `/resume.json` y `/en/resume.json`, en formato JSON Resume   |

## Cómo está hecho

- **Estático.** Astro genera HTML y solo carga Vue donde hay
  interacción.
- **Bilingüe.** Cada página existe en español y en inglés, enlazadas con
  `hreflang`.
- **Accesible.** Cada cambio pasa por Playwright con axe contra WCAG 2.2
  AA, en celular y en escritorio.
- **Seguro.** CSP con el hash de cada script en línea, HSTS y ningún
  script de terceros, salvo una analítica opcional sin cookies.
- **Claro y oscuro.** Sigue la preferencia del sistema y recuerda la
  elección de cada visitante.

La historia completa está en el artículo
[Cómo construí mi sitio](https://abitech.dev/blog/como-construi-mi-sitio),
y cómo bajé el tiempo de carga sin CDN, en
[Cómo aceleré mi sitio sin CDN](https://abitech.dev/blog/primer-byte-sin-cdn).

## Tecnologías

| Capa           | Herramientas                                    |
| -------------- | ----------------------------------------------- |
| Sitio          | Astro 7, Vue 3.5, Tailwind CSS 4 y TypeScript 6 |
| Contenido      | Markdown y YAML en colecciones de Astro         |
| Pruebas        | Vitest, Playwright, axe y Lighthouse CI         |
| Servidor       | Caddy en Docker, desplegado con Dokploy         |
| Automatización | GitHub Actions, Dependabot y Lefthook           |

## Empezar

Necesitas Node 26. Con [fnm](https://github.com/Schniz/fnm), `fnm use`
toma la versión de `.node-version`.

```bash
git clone https://github.com/abitech-dev/abitech-portafolio-web.git
cd abitech-portafolio-web
fnm use
npm ci
npm run dev
```

El sitio queda en `http://localhost:4321`. Los datos del CV y de los
proyectos vienen en `src/data` y los PDF en `public/descargas`. No se editan
a mano, porque llegan por PR desde otro repositorio, como explica
[De dónde salen los datos](#de-dónde-salen-los-datos).

| Comando              | Qué hace                                                |
| -------------------- | ------------------------------------------------------- |
| `npm run dev`        | Levanta el servidor de desarrollo                       |
| `npm run build`      | Compila el sitio en `dist/`                             |
| `npm run verificar`  | Revisa formato, estilo y tipos, prueba y compila        |
| `npm run e2e`        | Prueba en el navegador, con revisión de accesibilidad   |
| `npm run lighthouse` | Mide rendimiento, accesibilidad, buenas prácticas y SEO |
| `npm run capturas`   | Actualiza la captura de cada proyecto en línea          |

## Estructura

```text
src/
├── components/   piezas de la interfaz
├── content/      blog, libros y paquetes en Markdown y YAML
├── data/         CV y proyectos en resume.json
├── i18n/         textos y rutas en español e inglés
├── layouts/      plantilla común de las páginas
├── lib/          lógica sin interfaz, con sus pruebas
└── pages/        rutas del sitio
tests/            pruebas unitarias y de navegador
docs/             guías y decisiones de arquitectura
```

## De dónde salen los datos

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/diagramas/datos-dark.svg">
  <img alt="Los datos nacen en abitech-trayectoria-cli, llegan por PR a src/data, el sitio los publica en /resume.json y el perfil de GitHub los lee" src="docs/diagramas/datos.svg">
</picture>

El CV, los proyectos y las cifras nacen en `abitech-trayectoria-cli`, un
repositorio privado con un YAML por sección. Al unir un cambio en su `main`,
una Action exporta la vista pública y abre un PR a `develop` con
`resume.json`, su versión en inglés y los dos PDF del CV. Ese PR pasa la
misma CI que cualquier otro.

El sitio publica esos datos en `/resume.json` y `/en/resume.json`. El
[perfil de GitHub](https://github.com/abitech-dev/abitech-dev) los lee cada
día para mostrar el mismo titular, el empleo actual y las cifras. Un dato se
corrige solo en el origen, y aquí basta revisar y unir el PR.

## Del cambio a producción

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/diagramas/produccion-dark.svg">
  <img alt="Un cambio entra por PR a develop, que prueba la imagen; main la promueve y Dokploy la despliega en abitech.dev sin cortes" src="docs/diagramas/produccion.svg">
</picture>

Cada cambio entra por PR a `develop` y pasa seguridad, análisis
estático, pruebas unitarias, Playwright y Lighthouse. `develop` publica
una imagen de Docker, y `main` despliega esa misma imagen sin volver a
construirla. El detalle está en la [documentación](docs/).

Por qué uso estas ramas está en la
[guía de ramas y ambientes](https://abitech.dev/blog/ramas-y-ambientes), y
cómo `main` encuentra la imagen probada, en la
[nota sobre promover la imagen](https://abitech.dev/blog/promover-la-imagen).

## Contacto

Escríbeme desde [abitech.dev/contacto](https://abitech.dev/contacto) o
por [LinkedIn](https://www.linkedin.com/in/abitechdev/).

## Créditos y licencia

El emoji de saludo es de
[Fluent Emoji](https://github.com/microsoft/fluentui-emoji) de Microsoft,
con licencia MIT ([texto](licencias/fluent-emoji.txt)). Los logos de los
proyectos pertenecen a cada proyecto.

© 2026 Abimael Fernandez. Todos los derechos reservados.
