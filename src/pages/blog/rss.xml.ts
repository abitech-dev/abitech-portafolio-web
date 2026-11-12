import type { APIRoute } from "astro";

import { rssDelBlog } from "@/lib/rss-del-blog";

export const GET: APIRoute = ({ site }) => rssDelBlog("es", site);
