---
titulo: How I built my site with Astro and a single source of data
descripcion: Why my resume, my profiles and this site come from the same data, and which technical decisions make it fast, bilingual and easy to maintain.
fecha: 2026-11-12
tipo: articulo
etiquetas: [astro, architecture, seo]
---

For years my information was scattered across many places. My resume in Word,
my LinkedIn profile, every job board and a personal page I never updated.
Every time I finished a project I had to copy the same achievement into five
places, and one of them always fell behind.

This site was born to fix that. Here are the decisions I made and why.

## A single source of data

My whole career lives in YAML files inside a private repository. My jobs,
projects, achievements, certifications and languages are there, each piece of
data with its own visibility level. A Python program validates those files
with Pydantic and generates everything else. My resume as a PDF, the text I
paste into each job board, and a `resume.json` file in the standard JSON Resume
format.

The site only reads that `resume.json`. If I add a project tomorrow, I write
it once and it shows up in my resume, on the job boards and here. Projects for
private clients appear under a generic name, because the visibility filter is
applied before exporting.

## A static site with little JavaScript

I chose [Astro](https://astro.build) because it generates HTML when the site
is built and only ships JavaScript where it is really needed. On this site,
that is the theme button, a Vue island. Everything else is HTML and CSS.

The result is measurable. Lighthouse scores between 95 and 100 for
performance and 100 for accessibility, best practices and SEO, measured on the
production build and not on the development server.

## Two languages without duplicating pages

Each page lives only once, under an `[...idioma]` route. Spanish is at the
root and English under `/en`. Fixed text lives in one dictionary per language,
and TypeScript forces the English one to have the same keys as the Spanish
one.

```ts
const es = {
  inicio: { saludo: "Hola, soy" },
};

export type Textos = typeof es;

const en: Textos = {
  inicio: { saludo: "Hi, I'm" },
};
```

If I add a text in Spanish and forget to translate it, the site does not
build. Each page also declares its counterpart in the other language with
`hreflang`, so search engines show the right version.

## Built for search engines and AI

Every page has its own 1200 by 630 sharing image, generated at build time with
my photo, the title and my name. It weighs about 40 KB as a JPG. There is also
a schema.org graph where the site, my person and each project are linked by
their identifier, and an `llms.txt` file that summarizes the site in Markdown
for language models.

## Tests that protect what already works

The site has unit tests with Vitest and browser tests with Playwright, on
mobile and desktop, with an axe accessibility check on every page.

One of them came from a real bug. On mobile, the menu button ended up off the
screen. The layout grid took the width of my full name, which did not wrap,
and pushed everything to the right. The fix was one line of CSS, but the test I
left behind checks that no page overflows horizontally, so it does not happen
again.

```ts
test("ninguna página se desborda a lo ancho", async ({ page }) => {
  for (const { ruta } of PAGINAS) {
    await page.goto(ruta);
    const [total, visible] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      window.innerWidth,
    ]);
    expect(total, ruta).toBeLessThanOrEqual(visible);
  }
});
```

## What comes next

The next step is publishing it with Docker and Caddy on my own server, with
the security headers configured from day one. And to keep writing here about
what I build.

The site's code is public on
[GitHub](https://github.com/abitech-dev/abitech-portafolio-web), in case you
want to see how it is made.
