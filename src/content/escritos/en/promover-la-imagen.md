---
titulo: The same Docker image from develop to production, without rebuilding
descripcion: If the Docker image is tagged with the commit code, merging develop into main forces a rebuild. The Git tree hash ships the tested one instead.
fecha: 2026-11-20
tipo: nota
etiquetas: [git, docker, ci-cd]
borrador: false
---

Testing one image and shipping another is like tasting a cake and selling a
freshly baked one. The new one may come out different, and nobody tasted it.
On my site, production finds the cake that was tasted thanks to a tag that
does not change. In the 15 deployments of November 2026, none rebuilt the
image.

## Five words, explained with a cake

| Word   | What it is                                                    | At the bakery                       |
| ------ | ------------------------------------------------------------- | ----------------------------------- |
| Commit | Each change saved in Git, with its code, date and author      | The order, with its number and date |
| Image  | The application already built, ready to run                   | The baked cake                      |
| Tag    | The name used to find the image, a word like `prod` or a code | The cake's label                    |
| Tree   | The files exactly as they are in that commit                  | The recipe                          |
| Hash   | A code Git calculates from those files                        | A code that comes from the recipe   |

How the image moves from one environment to the next is explained in the
[guide to branches and environments](/en/blog/ramas-y-ambientes).

## Why production cannot find the image

The image is built and tested when a change is merged into `develop`. Then,
merging `develop` into `main` creates another commit, with another code. The
table compares both ways of tagging, with example codes.

| Step                   | With the commit code                           | With the tree hash                             |
| ---------------------- | ---------------------------------------------- | ---------------------------------------------- |
| When tested on develop | Tag `a1b2c3`                                   | Tag `tree-7f8e9d`                              |
| When merged into main  | The commit changes to `d4e5f6`                 | The tree is still `7f8e9d`                     |
| Production looks for   | `d4e5f6` and does not find it                  | `tree-7f8e9d` and finds it                     |
| Result                 | Rebuilds the image                             | Ships the tested image                         |
| At the bakery          | Looks for the new order and bakes another cake | Looks for the recipe and sells the tasted cake |

The first way, the one that fails, is the easiest. In GitHub Actions, the
service that builds and deploys on its own, writing `type=sha` in
[docker/metadata-action](https://github.com/docker/metadata-action) is enough.
The second is not built in, so my site calculates the hash itself.

## Why the hash does not change with the merge

A commit's code comes from everything it stores, including the date. The tree
hash comes only from the files, as [Pro
Git](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects), the official Git
book, explains.

| Goes into the calculation          | Commit | Tree |
| ---------------------------------- | ------ | ---- |
| The name and content of each file  | Yes    | Yes  |
| The date and who merged the change | Yes    | No   |
| The commit message                 | Yes    | No   |
| The previous commit                | Yes    | No   |

If nobody changed `main` on its own, after the merge it has the same files as
`develop`. That is why the hash is the same.

## Find it and promote it

Promoting means adding the `prod` tag to the tested image, without
rebuilding it. It is like changing the cake's sign from “being tasted” to “for
sale”.

Jez Humble and David Farley recommend building only once in _Continuous
Delivery_ (2010). [The Twelve-Factor
App](https://12factor.net/build-release-run) asks for the same by separating the
build from the release.

```bash
IMAGE=ghcr.io/user/site
tree=$(git rev-parse 'HEAD^{tree}')

if docker buildx imagetools inspect "$IMAGE:tree-$tree" > /dev/null; then
  docker buildx imagetools create --tag "$IMAGE:prod" \
    "$IMAGE:tree-$tree"
fi
```

`git rev-parse` calculates the tree hash. `inspect` asks whether the image
exists and `create` adds the `prod` tag to it.

If it is missing, as with a fix made directly on `main`, it is rebuilt and
tested. At the end, the site must respond with the hash the image stores in
`/version.txt`. That is how I confirm the right image is live.

## The result

| Measurement, November 2026                   | Value       |
| -------------------------------------------- | ----------- |
| Deployments to production                    | 15          |
| Deployments that rebuilt the image           | 0           |
| Build, test and scan for security on develop | 64 to 156 s |
| Deploy to production with the image ready    | 31 to 76 s  |

I measured it in GitHub Actions with `gh run list` and
`gh run view`. Without the hash, each deployment would add the time in the
third row.

## When it works and when it does not

- **It works** when `main` only receives merges from a branch already tested.
- **It does not work** if someone commits directly on `main`, because the tree
  changes and the image has to be rebuilt.
- **It does not work either** if each environment needs its own image, such as
  a website that stores its API address when it is built. That is option A in
  the [guide to branches and environments](/en/blog/ramas-y-ambientes).
