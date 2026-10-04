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

export function groupByCategory(components: ComponentEntry[]): ComponentCategory[] {
  const groups = new Map<string, ComponentEntry[]>()
  for (const component of components) {
    const items = groups.get(component.category) ?? []
    items.push(component)
    groups.set(component.category, items)
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, items]) => ({ name, items }))
}

/** Anchor id for a category heading on /components, e.g. "Inputs" → "cat-inputs". */
export function categoryId(name: string) {
  return `cat-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
}
