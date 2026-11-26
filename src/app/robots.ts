import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* Les moteurs de recherche et les assistants d'IA sont les bienvenus : Datlas veut être cité, avec ses sources.
   Seuls l'espace personnel, le carnet et les routes techniques restent fermés. */
const FERME = ["/compte", "/carnet", "/api/"];
const ROBOTS_IA = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "Bingbot", "DuckAssistBot", "MistralAI-User", "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: FERME },
      { userAgent: ROBOTS_IA, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow: FERME },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
