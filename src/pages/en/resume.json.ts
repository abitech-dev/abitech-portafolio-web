import type { APIRoute } from "astro";

import resume from "@/data/resume.en.json";

export const GET: APIRoute = () => Response.json(resume);
