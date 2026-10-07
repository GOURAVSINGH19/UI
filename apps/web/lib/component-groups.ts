// Pure helpers, safe to import from client components (no docs source here).

export interface ComponentEntry {
  title: string
  description: string
  category: string
  href: string
  badge?: string
  blog?: string
}

export interface ComponentCategory {
  name: string
  items: ComponentEntry[]
}

/** Categories pinned to the top, in this order. Any others follow A–Z. */
const CATEGORY_ORDER = ["Buttons"]

const categoryRank = (name: string) => {
  const index = CATEGORY_ORDER.indexOf(name)
  return index === -1 ? CATEGORY_ORDER.length : index
}

export function groupByCategory(components: ComponentEntry[]): ComponentCategory[] {
  const groups = new Map<string, ComponentEntry[]>()
  for (const component of components) {
    const items = groups.get(component.category) ?? []
    items.push(component)
    groups.set(component.category, items)
  }
  return [...groups.entries()]
    .sort(([a], [b]) => categoryRank(a) - categoryRank(b) || a.localeCompare(b))
    .map(([name, items]) => ({ name, items }))
}

/** Categories left out of the sidebar (and so out of prev/next too). */
export const HIDDEN_CATEGORIES = ["Media"]

/** The categories the sidebar shows, in order. */
export function sidebarCategories(components: ComponentEntry[]): ComponentCategory[] {
  return groupByCategory(components).filter((category) => !HIDDEN_CATEGORIES.includes(category.name))
}

/** Components in sidebar order: category by category. Prev/next on docs pages walk this list. */
export function inSidebarOrder(components: ComponentEntry[]): ComponentEntry[] {
  return sidebarCategories(components).flatMap((category) => category.items)
}

/** Anchor id for a category heading on /components, e.g. "Inputs" → "cat-inputs". */
export function categoryId(name: string) {
  return `cat-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
}
