import { source } from "@/lib/source"
import type { ComponentEntry } from "@/lib/component-groups"

export { groupByCategory } from "@/lib/component-groups"
export type { ComponentCategory, ComponentEntry } from "@/lib/component-groups"

export function getComponents(): ComponentEntry[] {
  return source
    .getPages()
    .filter((page) => page.slugs[0] === "components")
    .map((page) => ({
      title: page.data.title,
      description: page.data.description ?? "",
      category: page.data.category ?? "Other",
      href: page.url,
      badge: page.data.badge,
      blog: page.data.blog,
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
}
