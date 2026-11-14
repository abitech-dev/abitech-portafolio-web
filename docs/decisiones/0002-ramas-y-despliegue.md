# 0002. Ramas, integración continua y despliegue

- Estado: aceptada
- Fecha: 2026-11-14

## Contexto

El sitio necesita un camino claro desde un cambio hasta producción, que
pruebe todo una vez y no gaste recursos repitiendo lo ya probado. Lo
mantiene una persona, pero el flujo debe aguantar colaboradores.

## Decisión

- **Ramas.** Git Flow simplificado.
  - `main` es producción y solo recibe PR desde `develop` o desde
    `hotfix/*`.
  - `develop` integra el trabajo y solo recibe PR desde `feature/*` o
    `fix/*`, con la CI en verde.
  - Un `hotfix/*` nace de `main`, vuelve a `main` y luego a `develop`.
- **Se construye una vez y se despliega muchas veces**, como plantean
  _Continuous Delivery_ (Humble y Farley) y el factor 5 de _The
  Twelve-Factor App_.
  - Cada PR y cada push a `develop` corren las puertas de calidad, las
    pruebas de navegador y Lighthouse.
  - Al pasar, `develop` publica la imagen en GHCR con la huella del
    contenido (`arbol-<hash del árbol de git>`).
  - En `main`, el flujo de producción busca esa misma huella. Si existe,
    marca la imagen como `produccion` y avisa a Dokploy, sin compilar ni
    probar de nuevo.
  - Si no existe, porque el código no pasó por `develop`, prueba y
    construye antes de desplegar.
- **Seguridad del flujo**, según el OWASP Top 10 de CI/CD.
  - Permisos mínimos por trabajo.
  - Acciones de terceros fijadas por SHA.
  - Secretos solo en GitHub Secrets.
  - Ramas `develop` y `main` protegidas.
- **Imagen.** Node construye el sitio y su CSP; Caddy sirve `dist/` con
  cabeceras de seguridad y caché. La imagen final no lleva Node.

- **Sin cortes.** Swarm levanta el contenedor nuevo antes de apagar el
  anterior (`start-first`), guiado por el `HEALTHCHECK` de la imagen.
- **Prueba de humo.** Después de desplegar, el flujo comprueba que
  abitech.dev responda con sus cabeceras de seguridad.

## Consecuencias

- Pasar a producción tarda segundos y despliega exactamente lo probado.
- La huella es del árbol y no del commit, así que un PR con merge commit
  reutiliza la imagen de `develop`.
- En la CI, el rendimiento y el LCP de Lighthouse solo avisan, porque
  varían en los servidores compartidos de GitHub. Accesibilidad, buenas
  prácticas, SEO y CLS sí bloquean.
- La CSP de los scripts usa hashes calculados al construir la imagen. Un
  script en línea nuevo exige reconstruir, nunca editar la cabecera a
  mano.
