<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ url: string; copiar: string; copiado: string }>();

const isCopiado = ref(false);

async function copiarEnlace(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.url);
  } catch {
    // Sin permiso de portapapeles, el navegador ofrece copiar a mano.
    window.prompt(props.copiar, props.url);
    return;
  }
  isCopiado.value = true;
  setTimeout(() => (isCopiado.value = false), 2500);
}
</script>

<template>
  <button
    type="button"
    :class="
      isCopiado
        ? 'border-acento bg-acento-suave text-acento'
        : 'border-borde text-tenue hover:border-acento hover:text-acento'
    "
    class="inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors"
    data-umami-event="compartir"
    data-umami-event-red="enlace"
    @click="copiarEnlace"
  >
    <slot v-if="isCopiado" name="copiado" />
    <slot v-else name="copiar" />
    <span aria-live="polite">{{ isCopiado ? copiado : copiar }}</span>
  </button>
</template>
