import type { APIRoute } from "astro";

import resume from "@/data/resume.json";

// El perfil de GitHub lo lee para mostrar los mismos hechos que el sitio.
export const GET: APIRoute = () => Response.json(resume);
