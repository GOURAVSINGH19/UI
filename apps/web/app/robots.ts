import type { MetadataRoute } from "next"
import { absoluteUrl, siteUrl } from "@/lib/site"

// Search engines and AI crawlers are all welcome (GEO): explicitly allowing the main AI agents
// makes it clear the docs may be read, cited and summarised. Only the API and analytics proxy are off limits.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "CCBot",
]

const disallow = ["/api/", "/ingest/"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: AI_CRAWLERS, allow: "/", disallow },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  }
}
