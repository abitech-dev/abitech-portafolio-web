import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import BotonTema from "../../src/components/islands/BotonTema.vue";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  document.documentElement.classList.remove("dark");
});

describe("BotonTema", () => {
  it("cambia a oscuro, lo anuncia y lo recuerda", async () => {
    const boton = mount(BotonTema, { props: { etiqueta: "Tema oscuro" } });

    await boton.get('[data-test="boton-tema"]').trigger("click");

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(boton.get("button").attributes("aria-pressed")).toBe("true");
    expect(localStorage.getItem("tema")).toBe("oscuro");
  });
});
