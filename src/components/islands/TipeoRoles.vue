<script setup lang="ts">
import { usePreferredReducedMotion } from "@vueuse/core";
import { onMounted, onUnmounted, ref } from "vue";

const props = withDefaults(
  defineProps<{ roles: string[]; pausaMs?: number; pasoMs?: number }>(),
  { pausaMs: 1800, pasoMs: 55 },
);

const movimiento = usePreferredReducedMotion();
const texto = ref(props.roles[0] ?? "");
let temporizador: ReturnType<typeof setTimeout> | undefined;

function escribir(indice: number, letras: number, borrando: boolean): void {
  const rol = props.roles[indice] ?? "";
  texto.value = rol.slice(0, letras);
  if (!borrando && letras === rol.length) {
    temporizador = setTimeout(
      () => escribir(indice, letras, true),
      props.pausaMs,
    );
  } else if (borrando && letras === 0) {
    temporizador = setTimeout(
      () => escribir((indice + 1) % props.roles.length, 0, false),
      props.pasoMs,
    );
  } else {
    temporizador = setTimeout(
      () => escribir(indice, letras + (borrando ? -1 : 1), borrando),
      props.pasoMs,
    );
  }
}

onMounted(() => {
  if (movimiento.value !== "reduce" && props.roles.length > 1) {
    temporizador = setTimeout(
      () => escribir(0, texto.value.length, true),
      props.pausaMs,
    );
  }
});

onUnmounted(() => clearTimeout(temporizador));
</script>

<template>
  <span class="font-mono">
    <span class="sr-only">{{ roles.join(", ") }}</span>
    <span aria-hidden="true" data-test="tipeo">{{ texto }}</span>
    <span aria-hidden="true" class="text-acento motion-safe:animate-pulse"
      >_</span
    >
  </span>
</template>
