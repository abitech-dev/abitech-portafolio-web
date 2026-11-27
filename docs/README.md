# Documentación

Guías para trabajar en el sitio y decisiones de arquitectura que
explican por qué está hecho así.

## Guías

| Guía                                                            | Para qué sirve                                       |
| --------------------------------------------------------------- | ---------------------------------------------------- |
| [Desplegar el sitio](guias/desplegar.md)                        | Llevar un cambio a producción y preparar el servidor |
| [Publicar desde el celular](guias/publicar-desde-el-celular.md) | Escribir una entrada del blog en el editor de GitHub |

## Decisiones de arquitectura

Cada decisión sigue el formato de Michael Nygard, con su contexto, la
decisión tomada y sus consecuencias.

| N.º                                                                | Decisión                                  | Estado   |
| ------------------------------------------------------------------ | ----------------------------------------- | -------- |
| [0001](decisiones/0001-sitio-estatico-con-astro.md)                | Sitio estático con Astro e islas de Vue   | Aceptada |
| [0002](decisiones/0002-ramas-y-despliegue.md)                      | Ramas, integración continua y despliegue  | Aceptada |
| [0003](decisiones/0003-editar-con-github-y-buscar-con-pagefind.md) | Editar desde GitHub y buscar con Pagefind | Aceptada |
| [0004](decisiones/0004-ambiente-prod.md)                           | El ambiente de producción se llama prod   | Aceptada |

Los cambios de cada versión están en el [CHANGELOG](../CHANGELOG.md).
