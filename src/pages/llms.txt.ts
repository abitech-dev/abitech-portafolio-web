import type { APIRoute } from "astro";

import resume from "@/data/resume.json";
import { llmsTxt } from "@/lib/llms";

export const GET: APIRoute = ({ site }) =>
  new Response(llmsTxt(resume, site ?? new URL("https://abitech.dev")), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
