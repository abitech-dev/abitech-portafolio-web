import type { APIRoute } from "astro";

import resume from "@/data/resume.json";
import { escritosPublicados } from "@/lib/coleccion-escritos";
import { llmsTxt } from "@/lib/llms";

export const GET: APIRoute = async ({ site }) => {
  const escritos = (await escritosPublicados()).map((e) => ({
    id: e.id,
    titulo: e.data.titulo,
    descripcion: e.data.descripcion,
  }));
  return new Response(
    llmsTxt(resume, site ?? new URL("https://abitech.dev"), escritos),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
};
