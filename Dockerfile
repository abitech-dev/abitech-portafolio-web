FROM node:26-alpine AS construccion
WORKDIR /app

ARG PUBLIC_UMAMI_SRC=""
ARG PUBLIC_UMAMI_ID=""
ENV PUBLIC_UMAMI_SRC=$PUBLIC_UMAMI_SRC PUBLIC_UMAMI_ID=$PUBLIC_UMAMI_ID

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build && node scripts/csp.mjs dist csp.caddy

FROM caddy:2-alpine
ARG VERSION=local
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=construccion /app/csp.caddy /etc/caddy/csp.caddy
COPY --from=construccion /app/dist /srv
RUN echo "$VERSION" > /srv/version.txt
EXPOSE 80

# Swarm lo usa para cambiar de contenedor sin cortes.
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
