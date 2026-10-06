"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"
import { categoryId, groupByCategory, type ComponentEntry } from "@/lib/component-groups"
import { ComponentBadge } from "./ComponentBadge"

// A catalog: components grouped by category, numbered across the whole
// library, with the description visible so you can pick without clicking.
export function ComponentIndex({ components }: { components: ComponentEntry[] }) {
    const [query, setQuery] = useState("")

    const groups = useMemo(() => {
        const q = query.trim().toLowerCase()
        const matches = q
            ? components.filter((c) =>
                [c.title, c.category, c.description].some((field) => field.toLowerCase().includes(q))
            )
            : components
        return groupByCategory(matches)
    }, [components, query])

    // Stable numbering: a component keeps its number while filtering.
    const numberOf = useMemo(() => {
        const order = groupByCategory(components).flatMap((g) => g.items)
        return new Map(order.map((c, i) => [c.href, String(i + 1).padStart(2, "0")]))
    }, [components])

    return (
        <div>
            <label className="flex h-10 items-center gap-2.5 rounded-lg border border-ui-border bg-ui-bg px-3 text-sm text-ui-caption shadow-xs transition-colors focus-within:border-ui-border-strong">
                <Search className="size-4 shrink-0" />
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, category or what it does"
                    className="w-full bg-transparent text-ui-heading outline-none placeholder:text-ui-hint"
                />
            </label>

            <div className="mt-10 space-y-4">
                {groups.map((group) => (
                    <section key={group.name} aria-labelledby={categoryId(group.name)}>
                        <div className="flex items-baseline justify-between border-b border-ui-border border-dashed pb-2">
                            <h2 id={categoryId(group.name)} className="scroll-mt-20 text-sm font-medium text-ui-heading">
                                {group.name}
                            </h2>
                            <span className="text-xs text-ui-hint tabular-nums">
                                {group.items.length} {group.items.length === 1 ? "item" : "items"}
                            </span>
                        </div>

                        <ul>
                            {group.items.map((component) => (
                                <li key={component.href} className="">
                                    <Link
                                        href={component.href}
                                        className="group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-start gap-x-3 py-4"
                                    >
                                        <span className="pt-0.5 font-mono text-xs text-ui-hint tabular-nums transition-colors group-hover:text-ui-heading">
                                            {numberOf.get(component.href)}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="flex items-center gap-2 text-sm font-medium text-ui-heading">
                                                {component.title}
                                                <ComponentBadge label={component.badge} />
                                            </span>
                                            {component.description && (
                                                <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-ui-caption">
                                                    {component.description}
                                                </span>
                                            )}
                                        </span>
                                        <span className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-0.5 text-xs text-ui-hint transition-colors group-hover:border-ui-border group-hover:text-ui-heading">
                                            View
                                            <ArrowRight className="size-3" />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>

            {groups.length === 0 && (
                <div className="mt-10 rounded-lg border border-dashed border-ui-border px-4 py-8 text-center text-sm text-ui-caption">
                    Nothing matches “{query}”.{" "}
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="cursor-pointer text-ui-heading underline-offset-4 hover:underline"
                    >
                        Clear search
                    </button>
                </div>
            )}
        </div>
    )
}
