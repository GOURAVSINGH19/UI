import type { MetadataRoute } from "next"
import { getComponents } from "@/lib/components-index"
import { absoluteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/components"), changeFrequency: "weekly", priority: 0.9 },
    ...getComponents().map((component) => ({
      url: absoluteUrl(component.href),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
