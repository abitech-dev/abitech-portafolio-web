import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig, envField, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://abitech.dev",
  trailingSlash: "never",
  build: { inlineStylesheets: "always" },
  env: {
    schema: {
      PUBLIC_UMAMI_SRC: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      PUBLIC_UMAMI_ID: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: { prefixDefaultLocale: false },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: [400, 600, 700],
      subsets: ["latin"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Sora",
      cssVariable: "--font-sora",
      weights: [600, 700],
      subsets: ["latin"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains",
      weights: [400],
      subsets: ["latin"],
    },
  ],
  integrations: [
    vue(),
    mdx(),
    icon(),
    sitemap({
      i18n: { defaultLocale: "es", locales: { es: "es-PE", en: "en-US" } },
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: "github-light-high-contrast", dark: "github-dark" },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Con módulos en línea, el router de Astro inyecta un script data:
      // que la CSP bloquea. Los scripts salen como archivos aparte.
      assetsInlineLimit: (ruta: string) =>
        ruta.endsWith(".js") ? false : undefined,
    },
  },
});
