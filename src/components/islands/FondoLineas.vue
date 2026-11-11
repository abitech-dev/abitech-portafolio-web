<script setup lang="ts">
import { usePreferredReducedMotion } from "@vueuse/core";
import { onMounted, onUnmounted, ref } from "vue";

interface Punto {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const props = withDefaults(
  defineProps<{ puntos?: number; distancia?: number }>(),
  {
    puntos: 48,
    distancia: 140,
  },
);

const lienzo = ref<HTMLCanvasElement>();
const movimiento = usePreferredReducedMotion();
let cuadro = 0;

function crearPuntos(ancho: number, alto: number): Punto[] {
  return Array.from({ length: props.puntos }, () => ({
    x: Math.random() * ancho,
    y: Math.random() * alto,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
  }));
}

function dibujar(
  contexto: CanvasRenderingContext2D,
  puntos: Punto[],
  color: string,
): void {
  const { width, height } = contexto.canvas;
  contexto.clearRect(0, 0, width, height);
  contexto.strokeStyle = color;
  for (const [i, a] of puntos.entries()) {
    for (const b of puntos.slice(i + 1)) {
      const lejania = Math.hypot(a.x - b.x, a.y - b.y);
      if (lejania > props.distancia) continue;
      contexto.globalAlpha = 1 - lejania / props.distancia;
      contexto.beginPath();
      contexto.moveTo(a.x, a.y);
      contexto.lineTo(b.x, b.y);
      contexto.stroke();
    }
  }
}

function mover(puntos: Punto[], ancho: number, alto: number): void {
  for (const p of puntos) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > ancho) p.vx *= -1;
    if (p.y < 0 || p.y > alto) p.vy *= -1;
  }
}

onMounted(() => {
  const contexto = lienzo.value?.getContext("2d");
  if (!contexto) return;
  contexto.canvas.width = window.innerWidth;
  contexto.canvas.height = window.innerHeight;
  const color = getComputedStyle(document.documentElement).getPropertyValue(
    "--color-acento",
  );
  const puntos = crearPuntos(contexto.canvas.width, contexto.canvas.height);
  dibujar(contexto, puntos, color);
  if (movimiento.value === "reduce") return;

  const animar = () => {
    if (!document.hidden) {
      mover(puntos, contexto.canvas.width, contexto.canvas.height);
      dibujar(contexto, puntos, color);
    }
    cuadro = requestAnimationFrame(animar);
  };
  cuadro = requestAnimationFrame(animar);
});

onUnmounted(() => cancelAnimationFrame(cuadro));
</script>

<template>
  <canvas
    ref="lienzo"
    aria-hidden="true"
    data-test="fondo-lineas"
    class="pointer-events-none fixed inset-0 -z-10 opacity-20 dark:opacity-25"
  />
</template>
