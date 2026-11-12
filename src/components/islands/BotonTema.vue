<script setup lang="ts">
import { onMounted, ref } from "vue";

defineProps<{ etiqueta: string }>();

const esOscuro = ref(false);

onMounted(() => {
  esOscuro.value = document.documentElement.classList.contains("dark");
});

function alternar(): void {
  esOscuro.value = !esOscuro.value;
  document.documentElement.classList.toggle("dark", esOscuro.value);
  try {
    localStorage.setItem("tema", esOscuro.value ? "oscuro" : "claro");
  } catch {
    // Sin almacenamiento, el tema dura hasta recargar.
  }
}
</script>

<template>
  <button
    type="button"
    class="rounded-md border border-borde p-2 text-tenue transition-colors hover:text-acento"
    :aria-pressed="esOscuro"
    :aria-label="etiqueta"
    data-test="boton-tema"
    @click="alternar"
  >
    <slot v-if="esOscuro" name="oscuro" />
    <slot v-else name="claro" />
  </button>
</template>
