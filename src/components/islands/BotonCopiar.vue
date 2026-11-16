<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  texto: string;
  copiar: string;
  copiado: string;
  isCompacto?: boolean;
}>();

const isCopiado = ref(false);

async function copiarTexto(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.texto);
  } catch {
    // Sin permiso de portapapeles, el navegador ofrece copiar a mano.
    window.prompt(props.copiar, props.texto);
    return;
  }
  isCopiado.value = true;
  setTimeout(() => (isCopiado.value = false), 2500);
}
</script>

<template>
  <button
    type="button"
    :class="[
      isCopiado
        ? 'border-acento bg-acento-suave text-acento'
        : 'border-borde text-tenue hover:border-acento hover:text-acento',
      isCompacto
        ? 'size-9 justify-center rounded-md'
        : 'h-11 rounded-full px-4',
    ]"
    class="inline-flex shrink-0 items-center gap-2 border text-sm font-medium transition-colors"
    @click="copiarTexto"
  >
    <slot v-if="isCopiado" name="copiado" />
    <slot v-else name="copiar" />
    <span aria-live="polite" :class="{ 'sr-only': isCompacto }">
      {{ isCopiado ? copiado : copiar }}
    </span>
  </button>
</template>
