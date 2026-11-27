FROM node:26-alpine AS construccion
WORKDIR /app

ARG PUBLIC_UMAMI_SRC=""
ARG PUBLIC_UMAMI_ID=""
ENV PUBLIC_UMAMI_SRC=$PUBLIC_UMAMI_SRC PUBLIC_UMAMI_ID=$PUBLIC_UMAMI_ID

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build && node scripts/csp.mjs dist csp.caddy

# Caddy se compila con Go y x/net sin vulnerabilidades altas conocidas.
FROM golang:1.27.4-alpine AS caddy
RUN apk add --no-cache git \
  && go install github.com/caddyserver/xcaddy/cmd/xcaddy@v0.4.7 \
  && xcaddy build v2.11.9 --output /usr/bin/caddy \
    --replace golang.org/x/net=golang.org/x/net@v0.62.0

FROM caddy:2.11.9-alpine
COPY --from=caddy /usr/bin/caddy /usr/bin/caddy
ARG VERSION=local
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=construccion /app/csp.caddy /etc/caddy/csp.caddy
COPY --from=construccion /app/dist /srv
RUN echo "$VERSION" > /srv/version.txt
EXPOSE 80

# Swarm lo usa para cambiar de contenedor sin cortes.
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
