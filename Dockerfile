# Etapa 1. Construye el sitio estático y su CSP con Node.
FROM node:26-alpine AS construccion
WORKDIR /app

# Umami es opcional; sin estas variables el sitio no carga analítica.
ARG PUBLIC_UMAMI_SRC=""
ARG PUBLIC_UMAMI_ID=""
ENV PUBLIC_UMAMI_SRC=$PUBLIC_UMAMI_SRC PUBLIC_UMAMI_ID=$PUBLIC_UMAMI_ID

# Las dependencias van antes que el código para reutilizar esta capa.
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build && node scripts/csp.mjs dist csp.caddy

# Etapa 2. Sirve el resultado con Caddy, sin Node ni código fuente.
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=construccion /app/csp.caddy /etc/caddy/csp.caddy
COPY --from=construccion /app/dist /srv
EXPOSE 80

# Swarm espera este chequeo para cambiar de contenedor sin cortar el sitio.
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
