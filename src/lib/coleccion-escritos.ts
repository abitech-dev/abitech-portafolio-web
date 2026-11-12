import { getCollection } from "astro:content";

import { publicados } from "@/lib/escritos";

export async function escritosPublicados() {
  return publicados(await getCollection("escritos"), import.meta.env.DEV);
}
