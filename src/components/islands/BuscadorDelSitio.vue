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
  ayudaSinResultados: string;
  unResultado: string;
  variosResultados: string;
  sinIndice: string;
  limpiar: string;
  temasFrecuentes: string;
  temas: string[];
}>();

interface DatosDePagefind {
  url: string;
  excerpt: string;
  meta: { title?: string; tipo?: string };
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
  tipo: string;
  partes: ParteDelExtracto[];
}

// Lo escrito antes de hidratar sigue en el campo y Vue lo borraría.
const escritoAntes =
  typeof document === "undefined"
    ? ""
    : ((document.getElementById("consulta") as HTMLInputElement | null)
        ?.value ?? "");

const consulta = ref(escritoAntes);
const campo = ref<HTMLInputElement | null>(null);
const resultados = ref<Resultado[]>([]);
const terminoBuscado = ref("");
const estado = ref<"cargando" | "listo" | "sin-indice">("cargando");
let pagefind: Pagefind | null = null;

const termino = computed(() => consulta.value.trim());
const isSinResultados = computed(
  () =>
    termino.value !== "" &&
    terminoBuscado.value === termino.value &&
    resultados.value.length === 0,
);
const isTemasVisibles = computed(
  () =>
    estado.value !== "sin-indice" &&
    (termino.value === "" || isSinResultados.value),
);
const mensaje = computed(() => {
  if (estado.value === "sin-indice") return props.sinIndice;
  if (terminoBuscado.value !== termino.value) return "";
  if (resultados.value.length === 1) return props.unResultado;
  if (resultados.value.length > 1) {
    return props.variosResultados.replace(
      "{n}",
      String(resultados.value.length),
    );
  }
  return "";
});

onMounted(async () => {
  if (consulta.value === "") {
    consulta.value = new URLSearchParams(location.search).get("q") ?? "";
  }
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
  await buscar(consulta.value);
});

watch(termino, (texto) => {
  const direccion = new URL(location.href);
  if (texto) direccion.searchParams.set("q", texto);
  else direccion.searchParams.delete("q");
  history.replaceState(history.state, "", direccion);
  void buscar(texto);
});

async function buscar(texto: string): Promise<void> {
  const pedido = texto.trim();
  if (!pagefind || pedido === "") {
    resultados.value = [];
    terminoBuscado.value = "";
    return;
  }
  const respuesta = await pagefind.debouncedSearch(pedido);
  if (respuesta === null) return;
  const datos = await Promise.all(
    respuesta.results.slice(0, 10).map((resultado) => resultado.data()),
  );
  // Una respuesta lenta no pisa la de lo último que se escribió.
  if (pedido !== termino.value) return;
  resultados.value = datos.map((dato) => ({
    ruta: rutaDelResultado(dato.url),
    titulo: dato.meta.title ?? rutaDelResultado(dato.url),
    tipo: dato.meta.tipo ?? "",
    partes: partirExtracto(dato.excerpt),
  }));
  terminoBuscado.value = pedido;
}

function borrarConsulta(): void {
  consulta.value = "";
  campo.value?.focus();
}
</script>

<template>
  <form role="search" class="relative" @submit.prevent>
    <label for="consulta" class="sr-only">{{ etiqueta }}</label>
    <svg
      class="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-tenue"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.34-4.34" />
    </svg>
    <input
      id="consulta"
      ref="campo"
      v-model="consulta"
      type="search"
      autocomplete="off"
      enterkeyhint="search"
      :placeholder="marcador"
      :disabled="estado === 'sin-indice'"
      class="w-full rounded-lg border border-borde bg-superficie py-3 pr-12 pl-12 text-base transition-shadow placeholder:text-tenue focus-visible:border-acento focus-visible:ring-3 focus-visible:ring-acento/20 focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none"
    />
    <button
      v-if="consulta !== ''"
      type="button"
      :aria-label="limpiar"
      class="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-tenue transition-colors hover:bg-acento-suave hover:text-acento focus-visible:outline-offset-0"
      @click="borrarConsulta"
    >
      <svg
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  </form>
  <p class="mt-3 min-h-5 text-sm text-tenue" aria-live="polite">
    {{ mensaje }}
  </p>
  <div role="status">
    <div v-if="isSinResultados" class="mx-auto max-w-md py-10 text-center">
      <span
        class="mx-auto grid size-14 place-items-center rounded-full bg-acento-suave text-acento"
      >
        <svg
          class="size-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m13.5 8.5-5 5" />
          <path d="m8.5 8.5 5 5" />
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <p class="mt-4 font-display text-lg font-semibold">
        {{ sinResultados.replace("{termino}", termino) }}
      </p>
      <p class="mt-1 text-sm text-tenue">{{ ayudaSinResultados }}</p>
    </div>
  </div>
  <div
    v-if="isTemasVisibles"
    role="group"
    :aria-label="temasFrecuentes"
    :class="isSinResultados ? 'text-center' : 'mt-2'"
  >
    <p
      class="text-xs font-semibold tracking-wide text-tenue uppercase"
      aria-hidden="true"
    >
      {{ temasFrecuentes }}
    </p>
    <ul
      class="mt-3 flex flex-wrap gap-2"
      :class="{ 'justify-center': isSinResultados }"
    >
      <li v-for="tema in temas" :key="tema">
        <button
          type="button"
          class="rounded-md border border-borde bg-superficie px-3 py-1.5 font-mono text-sm transition-colors hover:border-acento hover:text-acento"
          @click="consulta = tema"
        >
          {{ tema }}
        </button>
      </li>
    </ul>
  </div>
  <ol class="mt-4 divide-y divide-borde">
    <li v-for="resultado in resultados" :key="resultado.ruta">
      <a :href="resultado.ruta" class="group block py-4">
        <span
          v-if="resultado.tipo"
          class="mb-1 block text-xs font-semibold tracking-wide text-acento uppercase"
        >
          {{ resultado.tipo }}
        </span>
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
