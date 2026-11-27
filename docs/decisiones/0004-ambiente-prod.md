# 0004. El ambiente de producción se llama prod

- Estado: aceptada
- Fecha: 2026-11-26

## Contexto

La 0002 nombró `produccion` al _Environment_ de GitHub y a la etiqueta de la
imagen que despliega Dokploy. La norma de integración continua y la práctica
`environments/local-prod` piden el nombre corto `prod`, igual en el
workflow, en el _Environment_ y en la etiqueta, como en los demás proyectos.

## Decisión

- El workflow se llama `deploy-prod.yml`.
- El _Environment_ de GitHub se llama `prod`, limitado a la rama `main`, y
  guarda el secreto `DOKPLOY_WEBHOOK_URL`.
- La imagen promovida lleva la etiqueta `prod`, que es la que despliega
  Dokploy.

## Consecuencias

- Un nombre de ambiente se lee igual en todos los proyectos.
- El cambio pide crear el _Environment_ `prod` con su secreto y apuntar
  Dokploy a `:prod` antes del primer despliegue con este workflow.
