"use client"

import { Fragment, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { useLenis } from "lenis/react"
import { ChevronsUpDown, CornerDownLeft, Search } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { ComponentBadge } from "@/components/browser/ComponentBadge"
import type { ComponentEntry } from "@/lib/component-groups"

interface SearchEntry {
    title: string
    href: string
    group: string
    description?: string
    badge?: string
}

const PAGES: SearchEntry[] = [
    { title: "Home", href: "/", group: "Pages" },
    { title: "All components", href: "/components", group: "Pages", description: "Browse the full catalog" },
]

const noopSubscribe = () => () => { }

function Highlight({ text, query }: { text: string; query: string }) {
    const index = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1
    if (index === -1) return <>{text}</>
    return (
        <>
            {text.slice(0, index)}
            <mark className="rounded-sm bg-amber-300/50 px-0.5 text-ui-heading dark:bg-amber-300/30">
                {text.slice(index, index + query.length)}
            </mark>
            {text.slice(index + query.length)}
        </>
    )
}

function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <kbd className={cn("rounded border border-ui-border bg-ui-subtle px-1 font-sans text-[10px] leading-4 text-ui-caption", className)}>
            {children}
        </kbd>
    )
}

/** Navbar search: a small trigger plus a ⌘K / Ctrl+K dialog over pages and components. */
export function CommandSearch({ components }: { components: ComponentEntry[] }) {
    const router = useRouter()
    const lenis = useLenis()
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [filter, setFilter] = useState("All")
    const [active, setActive] = useState(0)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const itemRefs = useRef<Array<HTMLElement | null>>([])

    const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false)
    const isMac = useSyncExternalStore(
        noopSubscribe,
        () => /Mac|iPhone|iPad/.test(navigator.platform),
        () => false
    )

    const entries = useMemo<SearchEntry[]>(
        () => [
            ...PAGES,
            ...components.map((c) => ({
                title: c.title,
                href: c.href,
                group: c.category,
                description: c.description,
                badge: c.badge,
            })),
        ],
        [components]
    )
    const filters = useMemo(() => ["All", ...new Set(entries.map((e) => e.group))], [entries])

    const q = query.trim()
    const results = useMemo(() => {
        const needle = q.toLowerCase()
        return entries.filter(
            (e) =>
                (filter === "All" || e.group === filter) &&
                (!needle || [e.title, e.group, e.description ?? ""].some((f) => f.toLowerCase().includes(needle)))
        )
    }, [entries, filter, q])

    // Grouped for display; `index` is the flat position the arrow keys move through.
    const groups = useMemo(() => {
        const map = new Map<string, Array<SearchEntry & { index: number }>>()
        results.forEach((entry, index) => {
            map.set(entry.group, [...(map.get(entry.group) ?? []), { ...entry, index }])
        })
        return [...map.entries()]
    }, [results])

    const close = () => {
        setOpen(false)
        setQuery("")
        setFilter("All")
        setActive(0)
        triggerRef.current?.focus()
    }

    const go = (entry: SearchEntry | undefined) => {
        if (!entry) return
        close()
        router.push(entry.href)
    }

    // ⌘K / Ctrl+K toggles from anywhere.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                setOpen((o) => !o)
            } else if (e.key === "Escape") {
                setOpen(false)
                setQuery("")
                setFilter("All")
                setActive(0)
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])

    // While open: focus the input and pause page scrolling.
    useEffect(() => {
        if (!open) return
        inputRef.current?.focus()
        lenis?.stop()
        return () => lenis?.start()
    }, [open, lenis])

    useEffect(() => {
        itemRefs.current[active]?.scrollIntoView({ block: "nearest" })
    }, [active])

    const onInputKey = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault()
            if (!results.length) return
            const step = e.key === "ArrowDown" ? 1 : -1
            setActive((i) => (i + step + results.length) % results.length)
        } else if (e.key === "Enter") {
            e.preventDefault()
            go(results[active])
        } else if (e.key === "Escape") {
            e.preventDefault()
            close()
        }
    }

    const listId = "command-search-results"

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen(true)}
                aria-label={`Search (${isMac ? "⌘" : "Ctrl"}+K)`}
                aria-haspopup="dialog"
                className="flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-ui-border px-2 text-ui-caption transition-colors hover:border-ui-border-strong hover:text-ui-heading"
            >
                <Search className="size-3.5" />
                <Kbd className="hidden sm:inline">{isMac ? "⌘" : "Ctrl"}</Kbd>
                <Kbd className="hidden sm:inline">K</Kbd>
            </button>

            {mounted && open && createPortal(
                <div className="fixed inset-0 z-[100]">
                    <div
                        aria-hidden
                        onClick={close}
                        className="absolute inset-0 bg-ui-bg/40 backdrop-blur-[3px] animate-in fade-in-0 duration-150"
                    />
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Search"
                        className="absolute top-[18vh] left-1/2 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-ui-border bg-ui-bg text-sm shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)] animate-in fade-in-0 zoom-in-95 duration-150"
                    >
                        <div className="flex items-center gap-2.5 px-3.5 py-3">
                            <Search className="size-4 shrink-0 text-ui-caption" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value)
                                    setActive(0)
                                }}
                                onKeyDown={onInputKey}
                                placeholder="Search components and pages"
                                role="combobox"
                                aria-expanded="true"
                                aria-controls={listId}
                                aria-activedescendant={results.length ? `${listId}-${active}` : undefined}
                                autoComplete="off"
                                spellCheck={false}
                                className="w-0 flex-1 bg-transparent text-base text-ui-heading outline-none placeholder:text-ui-hint"
                            />
                            <button
                                type="button"
                                onClick={close}
                                className="cursor-pointer rounded-md border border-ui-border px-1.5 py-0.5 text-[10px] font-medium text-ui-caption transition-colors hover:text-ui-heading"
                            >
                                ESC
                            </button>
                        </div>

                        <div
                            id={listId}
                            role="listbox"
                            aria-label="Results"
                            data-lenis-prevent
                            className="max-h-[min(26rem,55vh)] overflow-y-auto overscroll-contain border-t border-ui-border-subtle p-1.5"
                        >
                            {results.length === 0 && (
                                <p className="px-3 py-8 text-center text-ui-caption">
                                    No results for “<span className="text-ui-heading">{q}</span>”
                                </p>
                            )}
                            {groups.map(([group, items]) => (
                                <Fragment key={group}>
                                    <p className="px-2.5 pt-2 pb-1 text-xs font-medium text-ui-hint">{group}</p>
                                    {items.map((entry) => {
                                        const isActive = entry.index === active
                                        return (
                                            <div
                                                key={entry.href}
                                                id={`${listId}-${entry.index}`}
                                                ref={(el) => {
                                                    itemRefs.current[entry.index] = el
                                                }}
                                                role="option"
                                                aria-selected={isActive}
                                                onMouseMove={() => setActive(entry.index)}
                                                onClick={() => go(entry)}
                                                className={cn(
                                                    "flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2",
                                                    isActive && "bg-ui-muted"
                                                )}
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="flex items-center gap-2 font-medium text-ui-heading">
                                                        <span className="truncate">
                                                            <Highlight text={entry.title} query={q} />
                                                        </span>
                                                        <ComponentBadge label={entry.badge} />
                                                    </p>
                                                    {entry.description && (
                                                        <p className="mt-0.5 truncate text-xs text-ui-caption">
                                                            <Highlight text={entry.description} query={q} />
                                                        </p>
                                                    )}
                                                </div>
                                                {isActive && <CornerDownLeft className="size-3.5 shrink-0 text-ui-caption" />}
                                            </div>
                                        )
                                    })}
                                </Fragment>
                            ))}
                        </div>

                        <div className="flex items-center justify-between border-t border-ui-border-subtle px-3.5 py-2 text-xs text-ui-caption">
                            <label className="relative flex items-center gap-1.5">
                                Filter
                                <span className="flex items-center gap-0.5 font-medium text-ui-heading">
                                    {filter}
                                    <ChevronsUpDown className="size-3 text-ui-caption" />
                                </span>
                                {/* Native select stretched over the label: simple and keyboard friendly. */}
                                <select
                                    value={filter}
                                    onChange={(e) => {
                                        setFilter(e.target.value)
                                        setActive(0)
                                        inputRef.current?.focus()
                                    }}
                                    aria-label="Filter results"
                                    className="absolute inset-0 cursor-pointer opacity-0"
                                >
                                    {filters.map((f) => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </label>
                            <span className="hidden items-center gap-1.5 sm:flex">
                                <Kbd>↑</Kbd><Kbd>↓</Kbd> to move
                                <Kbd className="ml-2">↵</Kbd> to open
                            </span>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
