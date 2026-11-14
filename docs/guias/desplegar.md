# Desplegar el sitio

Cómo llega un cambio a producción en abitech.dev y cómo se prepara
Dokploy la primera vez. La decisión detrás está en
[0002. Ramas, integración continua y despliegue](../decisiones/0002-ramas-y-despliegue.md).

## Llevar un cambio a producción

1. Crea la rama desde `develop`, con el prefijo según el cambio.

   ```bash
   git switch develop && git pull
   git switch -c feature/nombre-del-cambio
   ```

2. Abre un PR hacia `develop`. La integración continua corre seguridad,
   análisis estático, pruebas unitarias, Playwright y Lighthouse.
3. Con todo en verde, une el PR. `develop` publica la imagen en GHCR.
4. Abre un PR de `develop` a `main`. Solo comprueba que la imagen de ese
   código exista, sin repetir las pruebas.
5. Une el PR. El flujo **Desplegar a producción** marca la imagen como `produccion` y
   Dokploy la despliega.

Para una urgencia en producción, crea `hotfix/nombre` desde `main`, abre
el PR a `main` y, una vez desplegado, une `main` en `develop`.

## Preparar el servidor la primera vez

En el VPS, CloudPanel atiende los dominios y el TLS con su proxy inverso.
Dokploy solo corre el contenedor en un puerto interno, para no chocar con
los puertos de CloudPanel.

1. En Dokploy crea una aplicación de tipo **Docker**, con la imagen
   `ghcr.io/abitech-dev/abitech-portafolio-web:produccion`.
2. En **Advanced → Ports** publica el puerto `80` del contenedor en un
   puerto libre del servidor, por ejemplo `8085`, en modo **Ingress**. El
   modo Host impide que el contenedor nuevo arranque junto al anterior.
   No le asignes dominio en Dokploy.

   ```bash
   ss -ltn | grep ':8085 ' || echo "8085 libre"
   ```

3. Cierra ese puerto en el firewall del proveedor del VPS. Docker publica
   sus puertos por encima del firewall de CloudPanel, que no lo bloquea.
4. En **Advanced → Resources** limita la memoria a 128 MB. Caddy usa
   menos de 20 MB, y durante un despliegue corren dos contenedores.
5. En CloudPanel crea un sitio de tipo **Reverse Proxy** para
   `abitech.dev`, con la URL `http://127.0.0.1:8085`, y emite su
   certificado de Let's Encrypt.
6. En Dokploy, en **Deployments**, copia la URL del **webhook** de
   despliegue.
7. En GitHub, en **Settings → Environments**, crea el entorno
   `produccion` y limita sus ramas de despliegue a `main`.
8. Guarda la URL del webhook como secreto de ese entorno. Así solo la
   lee el trabajo que despliega desde `main`.

   ```powershell
   $env:GH_TOKEN = gh auth token -u abitech-dev
   gh secret set DOKPLOY_WEBHOOK_URL --env produccion -R abitech-dev/abitech-portafolio-web
   Remove-Item Env:GH_TOKEN
   ```

9. En **Settings → Secrets and variables → Actions → Variables**, crea
   `URL_DEL_SITIO` con `https://abitech.dev`, sin barra final. Después de
   desplegar, el flujo espera a que `URL_DEL_SITIO/version.txt` muestre
   la versión nueva.

### Desplegar sin cortes

Dokploy corre la aplicación como servicio de Docker Swarm. Para que un
despliegue no corte el sitio a quien lo está navegando, en **Advanced →
Swarm Settings → Update Config** usa esta configuración.

```json
{
  "Parallelism": 1,
  "Delay": 10000000000,
  "FailureAction": "rollback",
  "Order": "start-first"
}
```

Con `start-first`, Swarm levanta el contenedor nuevo, espera a que el
`HEALTHCHECK` de la imagen responda y recién entonces apaga el anterior.
Si el nuevo no queda sano, vuelve solo a la versión previa.

Las cabeceras de seguridad las pone Caddy dentro del contenedor y el
proxy de CloudPanel las deja pasar. No hace falta repetirlas en Nginx.

La primera imagen se publica con el primer push a `develop`. GitHub crea
el paquete como privado. En el perfil de abitech-dev, entra a
**Packages → abitech-portafolio-web → Package settings** y cámbialo a
**Public**, para que Dokploy lo descargue sin credenciales.

## Analítica opcional

Si levantas Umami, crea en GitHub las variables de Actions
`PUBLIC_UMAMI_SRC` y `PUBLIC_UMAMI_ID`. La imagen las usa al construir y
la CSP agrega el dominio de Umami. Sin ellas, el sitio no carga ningún
script de medición.

## Comprobar después de publicar

```bash
curl -sI https://abitech.dev | grep -iE "content-security|strict-transport|x-content-type"
```

Revisa también la nota del sitio en
[HTTP Observatory](https://developer.mozilla.org/en-US/observatory).
