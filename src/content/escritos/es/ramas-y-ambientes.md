---
titulo: Git Flow, GitHub Flow, GitLab Flow o trunk-based y cómo elegir
descripcion: Cinco estrategias de ramas, qué ambiente va con cada rama, cómo llega un arreglo urgente y por qué publicar la misma imagen que se probó.
fecha: 2026-11-20
tipo: articulo
etiquetas: [git, ci-cd, devops, arquitectura]
borrador: false
---

Es común encontrar `develop`, `staging` y `main` sin saber qué servidor
actualiza cada rama. Si cada una arma su propia copia, es como probar un pastel
y vender otro recién horneado. Casi siempre sale igual, pero no siempre. La
regla es armar una copia, probarla y publicar esa misma, como hago en mi sitio
con `develop` y `main`.

## Una rama no es un ambiente

Una rama es una línea de trabajo en Git. Un ambiente es una copia del sistema
con su propia máquina, sus datos y su configuración.

| Ambiente | Para qué sirve                                           |
| -------- | -------------------------------------------------------- |
| `local`  | La computadora de cada persona, donde prueba sus cambios |
| `dev`    | El equipo ve juntos los cambios recién terminados        |
| `uat`    | El cliente o el negocio prueba y aprueba                 |
| `prod`   | Lo usan las personas de verdad                           |

La imagen es la aplicación ya armada y empaquetada, lista para correr.
Es el pastel ya horneado.

Hay dos formas de llevar la aplicación a los ambientes.

<div class="grid gap-4 sm:grid-cols-2">
<div class="border-borde bg-superficie rounded-lg border px-5 text-base *:first:mt-5 *:last:mb-5 [&_li]:my-1">

### A. Una imagen por ambiente

`develop` → `staging` → `main`

- **Las flechas** son merges, que unen una rama con la siguiente.
- **Se arma** de nuevo en cada rama.
- **El pastel** se hornea otra vez para vender.
- **Conviene** solo si cada ambiente necesita armarse distinto.

</div>
<div class="border-borde bg-superficie rounded-lg border px-5 text-base *:first:mt-5 *:last:mb-5 [&_li]:my-1">

### B. Una imagen para todos

`dev` → `uat` → `prod`

- **Las flechas** llevan la misma imagen al ambiente siguiente.
- **Se arma** una sola vez.
- **El pastel** que se vende es el que se probó.
- **Conviene** en casi todos los casos, con cualquier estrategia.

</div>
</div>

**Solo la forma B asegura que lo que se probó sea lo que llega a producción.**
Se le llama promover un artefacto (build once, deploy many).

La A hace falta cuando la aplicación fija su configuración al armarse, algo
que [The Twelve-Factor App](https://12factor.net/es/config) desaconseja. Por
ejemplo, una web con la dirección de su API escrita dentro, o una app móvil
firmada con otra clave en cada ambiente.

## Las cinco estrategias, rama por rama

### 1. Git Flow

Vincent Driessen la
[publicó en 2010](https://nvie.com/posts/a-successful-git-branching-model/).
Usa dos ramas permanentes, `develop` y `main`, y una temporal por cada cambio,
versión o arreglo urgente.

`feature/*` → `develop` → `release/1.4` → `main`

| Rama          | Qué guarda                        | Se instala en        |
| ------------- | --------------------------------- | -------------------- |
| `feature/*`   | Un cambio en curso                | `local`              |
| `develop`     | Los cambios terminados            | `dev`                |
| `release/1.4` | La versión 1.4 mientras se prueba | `uat`                |
| `main`        | Lo publicado, con su número       | `prod`               |
| `hotfix/*`    | Un arreglo urgente sobre `main`   | `uat` y luego `prod` |

**Conviene** en software con versiones numeradas, como una app móvil o una
librería. **No conviene** en una web que publica seguido, como admitió el
autor en 2020.

### 2. GitHub Flow

En la [guía de GitHub](https://docs.github.com/es/get-started/using-github/github-flow),
todo cambio sale de `main` y vuelve a `main` por pull request (PR), el pedido
para unir una rama después de revisarla.

`feature/*` → `main`

| Rama                 | Qué guarda                   | Se instala en                       |
| -------------------- | ---------------------------- | ----------------------------------- |
| `feature/*`, `fix/*` | Un cambio o arreglo en curso | `local` y una copia temporal del PR |
| `main`               | Lo publicado                 | `prod`                              |

**Conviene** a un equipo pequeño que publica seguido. **No conviene** cuando
alguien de fuera del equipo debe aprobar antes de pasar a producción.

### 3. GitLab Flow con ramas por ambiente

En la [guía de GitLab](https://about.gitlab.com/topics/version-control/what-is-gitlab-flow/),
cada ambiente tiene su rama. Un cambio avanza uniendo cada rama con la
siguiente.

`feature/*` → `develop` → `staging` → `main`

| Rama                 | Qué guarda                   | Se instala en |
| -------------------- | ---------------------------- | ------------- |
| `feature/*`, `fix/*` | Un cambio o arreglo en curso | `local`       |
| `develop`            | Los cambios terminados       | `dev`         |
| `staging`            | Lo que se está aprobando     | `uat`         |
| `main`               | Lo publicado                 | `prod`        |

**Conviene** si la organización exige ver en Git qué hay en cada ambiente.
**Falla** cuando alguien arregla directo en `main` y las ramas dejan de
coincidir.

### 4. Trunk-based

Todos integran en una sola rama, el tronco (trunk).
[DORA](https://dora.dev/capabilities/trunk-based-development/), el programa
de Google que mide el desempeño en la entrega de software, la asocia con los
equipos que mejor rinden. Recomienda tres ramas activas o menos, que duren
horas.

| Rama                 | Qué guarda               | Se instala en                                          |
| -------------------- | ------------------------ | ------------------------------------------------------ |
| `feature/*`, `fix/*` | Un cambio de pocas horas | `local`                                                |
| `main`               | Los cambios terminados   | `dev`, luego `uat` y luego `prod`, con la misma imagen |

Lo que no está listo llega a producción apagado con un interruptor (feature
flag) y se enciende después.

**Conviene** si el equipo tiene pruebas automáticas que detectan los errores
antes de unir cada cambio. **No conviene** sin esas pruebas, porque un
error llegaría a producción en pocas horas.

### 5. Release Flow

[Microsoft la usa](https://learn.microsoft.com/es-es/devops/develop/how-microsoft-develops-devops)
en Azure DevOps. Es trunk-based, pero al final de cada ciclo de trabajo
(sprint) se corta una rama con lo que pasará a producción.

| Rama                 | Qué guarda                             | Se instala en      |
| -------------------- | -------------------------------------- | ------------------ |
| `feature/*`, `fix/*` | Un cambio o arreglo en curso           | `local`            |
| `main`               | Los cambios terminados                 | `dev`              |
| `releases/M129`      | Lo que pasa a producción en ese sprint | `prod`, por etapas |

No tiene `uat`. La versión nueva se valida en producción, primero en pocos
servidores y luego en los demás.

**Conviene** en productos con millones de usuarios. **No conviene** en un equipo
chico, porque agrega trabajo sin beneficio.

## Cuando producción falla

El arreglo urgente va en una rama `hotfix/*` en las cinco estrategias, como
propone [Conventional Branch](https://conventionalbranch.org/), la convención
para nombrar ramas. Lo que cambia es su recorrido.

| Estrategia      | Sale de   | Recorrido                                                      |
| --------------- | --------- | -------------------------------------------------------------- |
| 1. Git Flow     | `main`    | `hotfix/*` → `main` y `develop`                                |
| 2. GitHub Flow  | `main`    | `hotfix/*` → `main`                                            |
| 3. GitLab Flow  | `develop` | `hotfix/*` → `develop` → `staging` → `main`                    |
| 4. Trunk-based  | `main`    | `hotfix/*` → `main`                                            |
| 5. Release Flow | `main`    | `hotfix/*` → `main` → `releases/M129`, copiado con cherry-pick |

En trunk-based a veces basta apagar el interruptor del cambio que falla. En
todas, el arreglo termina también en la rama principal. Si no, el error vuelve
con la siguiente versión.

## Las normas piden ambientes, no ramas

| Norma              | Qué es                                                           | Qué pide sobre los ambientes                                                  |
| ------------------ | ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| ISO/IEC 27001:2022 | La norma internacional de seguridad de la información, de 2022   | Separar desarrollo, pruebas y producción, en su regla A.8.31                  |
| PCI DSS 4.0        | La norma que cumple quien procesa pagos con tarjeta, versión 4.0 | Lo mismo, y no usar tarjetas reales fuera de producción, reglas 6.5.3 a 6.5.5 |

Ninguna obliga a tener una rama por ambiente, y las dos admiten la misma
imagen en todos.

## Cómo lo hago en mi sitio

Uso la variante más simple de GitLab Flow, la estrategia 3, que GitLab llama
[rama de producción](https://about.gitlab.com/topics/version-control/what-is-gitlab-flow/).
`develop` junta los cambios y `main` guarda lo publicado, sin `staging`,
porque en un sitio personal no hay cliente que apruebe.

`feature/*` → `develop` → `main`

| Rama                 | Qué guarda                   | Se instala en                              |
| -------------------- | ---------------------------- | ------------------------------------------ |
| `feature/*`, `fix/*` | Un cambio o arreglo en curso | `local`                                    |
| `develop`            | Los cambios terminados       | Ninguno, solo pasa las pruebas automáticas |
| `main`               | Lo publicado                 | `prod`                                     |

La imagen sigue la forma B. Se arma una sola vez, en `develop`, y `main` la
publica sin cambios, como explica la
[nota sobre promover la imagen](/blog/promover-la-imagen).

## Cinco preguntas para elegir

Vale la primera pregunta que se responde con «sí».

| Pregunta                                     | Si la respuesta es sí |
| -------------------------------------------- | --------------------- |
| ¿Mantiene varias versiones a la vez?         | 1. Git Flow           |
| ¿Publica por oleadas a millones de usuarios? | 5. Release Flow       |
| ¿Alguien de fuera del equipo aprueba?        | 3. GitLab Flow        |
| ¿Tiene pruebas automáticas confiables?       | 4. Trunk-based        |
| Ninguna de las anteriores                    | 2. GitHub Flow        |

Elija la que elija, prefiera la forma B. Si su equipo necesita `uat`, no
agregue una rama. Promueva la misma imagen con la aprobación de un
revisor en _GitHub Environments_.
