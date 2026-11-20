---
titulo: Git Flow, GitHub Flow, GitLab Flow or trunk-based and how to choose
descripcion: Five branching strategies, which environment goes with each branch, how an urgent fix reaches production and why to ship the image you tested.
fecha: 2026-11-20
tipo: articulo
etiquetas: [git, ci-cd, devops, architecture]
borrador: false
---

It is common to find `develop`, `staging` and `main` without knowing which
server each branch updates. If each one builds its own copy, it is like tasting
a cake and selling another one freshly baked. It almost always comes out the
same, but not always. The rule is to build one copy, test it and ship that same
one, as I do on my site with `develop` and `main`.

## A branch is not an environment

A branch is a line of work in Git. An environment is a copy of the system with
its own machine, its data and its configuration.

| Environment | What it is for                                        |
| ----------- | ----------------------------------------------------- |
| `local`     | Each person's computer, where they test their changes |
| `dev`       | The team sees the newly finished changes together     |
| `uat`       | The client or the business tests and approves         |
| `prod`      | Real people use it                                    |

The image is the application already built and packaged, ready to run. It is
the cake already baked.

There are two ways to take the application to the environments.

<div class="grid gap-4 sm:grid-cols-2">
<div class="border-borde bg-superficie rounded-lg border px-5 text-base *:first:mt-5 *:last:mb-5 [&_li]:my-1">

### A. One image per environment

`develop` → `staging` → `main`

- **The arrows** are merges, which join one branch into the next.
- **It is built** again on each branch.
- **The cake** is baked again to be sold.
- **It fits** only if each environment needs a different build.

</div>
<div class="border-borde bg-superficie rounded-lg border px-5 text-base *:first:mt-5 *:last:mb-5 [&_li]:my-1">

### B. One image for all

`dev` → `uat` → `prod`

- **The arrows** carry the same image to the next environment.
- **It is built** once.
- **The cake** sold is the one that was tasted.
- **It fits** almost every case, with any strategy.

</div>
</div>

**Only option B ensures that what was tested is what reaches production.** This
is called promoting an artifact (build once, deploy many).

Option A is needed when the application fixes its configuration at build time,
something [The Twelve-Factor App](https://12factor.net/config) advises against.
For example, a website with its API address written inside, or a mobile app
signed with a different key for each environment.

## The five strategies, branch by branch

### 1. Git Flow

Vincent Driessen
[published it in 2010](https://nvie.com/posts/a-successful-git-branching-model/).
It uses two permanent branches, `develop` and `main`, and a temporary one for
each change, release or urgent fix.

`feature/*` → `develop` → `release/1.4` → `main`

| Branch        | What it holds                      | Installed in          |
| ------------- | ---------------------------------- | --------------------- |
| `feature/*`   | A change in progress               | `local`               |
| `develop`     | Finished changes                   | `dev`                 |
| `release/1.4` | Version 1.4 while it is tested     | `uat`                 |
| `main`        | What is published, with its number | `prod`                |
| `hotfix/*`    | An urgent fix on top of `main`     | `uat` and then `prod` |

**It fits** software with numbered versions, such as a mobile app or a
library. **It does not fit** a website that ships often, as the author
admitted in 2020.

### 2. GitHub Flow

In [GitHub's guide](https://docs.github.com/en/get-started/using-github/github-flow),
every change starts from `main` and returns to `main` through a pull request
(PR), the request to merge a branch after review.

`feature/*` → `main`

| Branch               | What it holds               | Installed in                           |
| -------------------- | --------------------------- | -------------------------------------- |
| `feature/*`, `fix/*` | A change or fix in progress | `local` and a temporary copy of the PR |
| `main`               | What is published           | `prod`                                 |

**It fits** a small team that ships often. **It does not fit** when someone
outside the team must approve before production.

### 3. GitLab Flow with environment branches

In [GitLab's guide](https://about.gitlab.com/topics/version-control/what-is-gitlab-flow/),
each environment has its branch. A change moves forward by merging each
branch into the next.

`feature/*` → `develop` → `staging` → `main`

| Branch               | What it holds               | Installed in |
| -------------------- | --------------------------- | ------------ |
| `feature/*`, `fix/*` | A change or fix in progress | `local`      |
| `develop`            | Finished changes            | `dev`        |
| `staging`            | What is being approved      | `uat`        |
| `main`               | What is published           | `prod`       |

**It fits** when the organization requires seeing in Git what is in each
environment. **It breaks** when someone fixes directly on `main` and
the branches stop matching.

### 4. Trunk-based

Everyone integrates into a single branch, the trunk.
[DORA](https://dora.dev/capabilities/trunk-based-development/), the Google
research program that measures software delivery performance, links it to the
best performing teams. It recommends three or fewer active branches, lasting
hours.

| Branch               | What it holds           | Installed in                                           |
| -------------------- | ----------------------- | ------------------------------------------------------ |
| `feature/*`, `fix/*` | A change of a few hours | `local`                                                |
| `main`               | Finished changes        | `dev`, then `uat` and then `prod`, with the same image |

What is not ready reaches production turned off by a switch (feature flag) and
is turned on later.

**It fits** if the team has automated tests that catch errors before each
change is merged. **It does not fit** without those tests, because an error
would reach production within hours.

### 5. Release Flow

[Microsoft uses it](https://learn.microsoft.com/en-us/devops/develop/how-microsoft-develops-devops)
in Azure DevOps. It is trunk-based, but at the end of each work cycle (sprint)
a branch is cut with what will go to production.

| Branch               | What it holds                          | Installed in      |
| -------------------- | -------------------------------------- | ----------------- |
| `feature/*`, `fix/*` | A change or fix in progress            | `local`           |
| `main`               | Finished changes                       | `dev`             |
| `releases/M129`      | What goes to production in that sprint | `prod`, in stages |

It has no `uat`. The new version is validated in production, first on a few
servers and then on the rest.

**It fits** products with millions of users. **It does not fit** a small team,
because it adds work without benefit.

## When production fails

The urgent fix goes on a `hotfix/*` branch in all five strategies, as
[Conventional Branch](https://conventionalbranch.org/), the convention for
naming branches, proposes. What changes is its path.

| Strategy        | Starts from | Path                                                           |
| --------------- | ----------- | -------------------------------------------------------------- |
| 1. Git Flow     | `main`      | `hotfix/*` → `main` and `develop`                              |
| 2. GitHub Flow  | `main`      | `hotfix/*` → `main`                                            |
| 3. GitLab Flow  | `develop`   | `hotfix/*` → `develop` → `staging` → `main`                    |
| 4. Trunk-based  | `main`      | `hotfix/*` → `main`                                            |
| 5. Release Flow | `main`      | `hotfix/*` → `main` → `releases/M129`, copied with cherry-pick |

In trunk-based, turning off the failing change's switch is sometimes
enough. In all of them, the fix also ends up in the main branch. Otherwise,
the error comes back with the next version.

## Standards ask for environments, not branches

| Standard           | What it is                                                       | What it asks about environments                                      |
| ------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| ISO/IEC 27001:2022 | The international information security standard, from 2022       | Separate development, testing and production, in its rule A.8.31     |
| PCI DSS 4.0        | The standard for anyone who processes card payments, version 4.0 | The same, and no real cards outside production, rules 6.5.3 to 6.5.5 |

Neither requires a branch per environment, and both allow the same image in
all of them.

## How I do it on my site

I use the simplest variant of GitLab Flow, strategy 3, which GitLab calls
[production branch](https://about.gitlab.com/topics/version-control/what-is-gitlab-flow/).
`develop` gathers the changes and `main` holds what is published, without
`staging`, because on a personal site there is no client to approve.

`feature/*` → `develop` → `main`

| Branch               | What it holds               | Installed in                             |
| -------------------- | --------------------------- | ---------------------------------------- |
| `feature/*`, `fix/*` | A change or fix in progress | `local`                                  |
| `develop`            | Finished changes            | None, it only passes the automated tests |
| `main`               | What is published           | `prod`                                   |

The image follows option B. It is built once, when merging into `develop`, and
merging into `main` ships that same image to production unchanged.

## Five questions to choose

The first question answered with “yes” wins.

| Question                                   | If the answer is yes |
| ------------------------------------------ | -------------------- |
| Do you maintain several versions at once?  | 1. Git Flow          |
| Do you ship in waves to millions of users? | 5. Release Flow      |
| Does someone outside the team approve?     | 3. GitLab Flow       |
| Do you have reliable automated tests?      | 4. Trunk-based       |
| None of the above                          | 2. GitHub Flow       |

Whichever you choose, prefer option B. If your team needs `uat`, do not add a
branch. Promote the same image with a reviewer's approval in
_GitHub Environments_.
