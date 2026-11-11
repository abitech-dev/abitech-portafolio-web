import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import BotonTema from "../../src/components/islands/BotonTema.vue";
import TipeoRoles from "../../src/components/islands/TipeoRoles.vue";

function preferirMovimientoReducido(reducido: boolean): void {
  vi.stubGlobal("matchMedia", (consulta: string) => ({
    matches: reducido && consulta.includes("reduce"),
    media: consulta,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  document.documentElement.classList.remove("dark");
});

describe("TipeoRoles", () => {
  it("muestra el primer rol desde el inicio y todos para lectores de pantalla", () => {
    preferirMovimientoReducido(false);
    const tipeo = mount(TipeoRoles, {
      props: { roles: ["Full stack", "Laravel"] },
    });

    expect(tipeo.get('[data-test="tipeo"]').text()).toBe("Full stack");
    expect(tipeo.get(".sr-only").text()).toBe("Full stack, Laravel");
  });

  it("no anima si el sistema pide reducir el movimiento", () => {
    preferirMovimientoReducido(true);
    vi.useFakeTimers();
    const tipeo = mount(TipeoRoles, {
      props: { roles: ["Full stack", "Laravel"] },
    });

    vi.advanceTimersByTime(10_000);

    expect(tipeo.get('[data-test="tipeo"]').text()).toBe("Full stack");
  });

  it("borra y escribe el siguiente rol", async () => {
    preferirMovimientoReducido(false);
    vi.useFakeTimers();
    const tipeo = mount(TipeoRoles, {
      props: { roles: ["Ab", "Cd"], pausaMs: 10, pasoMs: 10 },
    });

    vi.advanceTimersByTime(200);
    await tipeo.vm.$nextTick();

    expect(tipeo.get('[data-test="tipeo"]').text()).not.toBe("Ab");
  });
});

describe("BotonTema", () => {
  it("cambia a oscuro, lo anuncia y lo recuerda", async () => {
    const boton = mount(BotonTema);

    await boton.get('[data-test="boton-tema"]').trigger("click");

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(boton.get("button").attributes("aria-pressed")).toBe("true");
    expect(localStorage.getItem("tema")).toBe("oscuro");
  });
});
