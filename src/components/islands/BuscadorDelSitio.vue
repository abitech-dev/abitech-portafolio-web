<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import {
  partirExtracto,
  rutaDelResultado,
  type ParteDelExtracto,
} from "@/lib/busqueda";

const props = defineProps<{
  etiqueta: string;
  marcador: string;
  sinResultados: string;
  unResultado: string;
  variosResultados: string;
  sinIndice: string;
}>();

interface DatosDePagefind {
  url: string;
  excerpt: string;
  meta: { title?: string };
}

interface Pagefind {
  init: () => Promise<void>;
  debouncedSearch: (
    consulta: string,
  ) => Promise<{ results: { data: () => Promise<DatosDePagefind> }[] } | null>;
}

interface Resultado {
  ruta: string;
  titulo: string;
  partes: ParteDelExtracto[];
}

const consulta = ref("");
const resultados = ref<Resultado[]>([]);
const estado = ref<"cargando" | "listo" | "sin-indice">("cargando");
let pagefind: Pagefind | null = null;

const mensaje = computed(() => {
  if (estado.value === "sin-indice") return props.sinIndice;
  if (consulta.value.trim() === "" || estado.value === "cargando") return "";
  if (resultados.value.length === 0) return props.sinResultados;
  if (resultados.value.length === 1) return props.unResultado;
  return props.variosResultados.replace("{n}", String(resultados.value.length));
});

onMounted(async () => {
  try {
    // El índice existe solo después de compilar, así que se carga en el navegador.
    const ruta = "/pagefind/pagefind.js";
    pagefind = (await import(/* @vite-ignore */ ruta)) as Pagefind;
    await pagefind.init();
    estado.value = "listo";
  } catch {
    estado.value = "sin-indice";
    return;
  }
  // Lo escrito mientras cargaba el índice manda sobre el ?q= de la URL.
  const inicial = new URLSearchParams(location.search).get("q") ?? "";
  if (consulta.value === "") consulta.value = inicial;
  else await buscar(consulta.value);
});

watch(consulta, (texto) => {
  const termino = texto.trim();
  const direccion = new URL(location.href);
  if (termino) direccion.searchParams.set("q", termino);
  else direccion.searchParams.delete("q");
  history.replaceState(history.state, "", direccion);
  void buscar(termino);
});

async function buscar(texto: string): Promise<void> {
  const termino = texto.trim();
  if (!pagefind || termino === "") {
    resultados.value = [];
    return;
  }
  const respuesta = await pagefind.debouncedSearch(termino);
  if (respuesta === null) return;
  const datos = await Promise.all(
    respuesta.results.slice(0, 10).map((resultado) => resultado.data()),
  );
  resultados.value = datos.map((dato) => ({
    ruta: rutaDelResultado(dato.url),
    titulo: dato.meta.title ?? rutaDelResultado(dato.url),
    partes: partirExtracto(dato.excerpt),
  }));
}
</script>

<template>
  <form role="search" @submit.prevent>
    <label for="consulta" class="sr-only">{{ etiqueta }}</label>
    <input
      id="consulta"
      v-model="consulta"
      type="search"
      autocomplete="off"
      :placeholder="marcador"
      :disabled="estado === 'sin-indice'"
      class="w-full rounded-md border border-borde bg-superficie px-4 py-3 text-base placeholder:text-tenue focus:border-acento"
    />
  </form>
  <p class="mt-3 min-h-5 text-sm text-tenue" aria-live="polite">
    {{ mensaje }}
  </p>
  <ol class="mt-4 divide-y divide-borde">
    <li v-for="resultado in resultados" :key="resultado.ruta">
      <a :href="resultado.ruta" class="group block py-4">
        <span
          class="font-display text-lg font-semibold transition-colors group-hover:text-acento"
        >
          {{ resultado.titulo }}
        </span>
        <span class="mt-1 block text-sm leading-relaxed text-tenue">
          <template v-for="(parte, indice) in resultado.partes" :key="indice">
            <mark
              v-if="parte.isResaltado"
              class="rounded-sm bg-acento-suave px-0.5 text-acento"
              >{{ parte.texto }}</mark
            >
            <template v-else>{{ parte.texto }}</template>
          </template>
        </span>
      </a>
    </li>
  </ol>
</template>
