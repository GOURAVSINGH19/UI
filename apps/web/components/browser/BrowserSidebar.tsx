"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Folder, FolderOpen, Github, LayoutGrid, Mail } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { HIDDEN_CATEGORIES, type ComponentCategory } from "@/lib/component-groups"
import { ComponentBadge } from "./ComponentBadge"
import { TreeNav } from "./TreeNav"
import { site } from "@/lib/site"

const sectionLabel = "eyebrow mb-3 px-3"

function useOpenCategory(categories: ComponentCategory[], activeCategory: string | undefined) {
    const [openCategory, setOpenCategory] = useState<string | null>(() => {
        return activeCategory ?? categories[0]?.name ?? null
    })

    useEffect(() => {
        if (activeCategory) {
            setOpenCategory(activeCategory)
        }
    }, [activeCategory])

    const toggleOpen = (name: string, open: boolean) => {
        if (open) {
            setOpenCategory(name)
        } else {
            setOpenCategory((curr) => (curr === name ? null : curr))
        }
    }

    return {
        isOpen: (name: string) => openCategory === name,
        setOpen: toggleOpen,
    }
}

export function BrowserSidebar({ categories }: { categories: ComponentCategory[] }) {
    const pathname = usePathname()
    const visibleCategories = categories.filter((category) => !HIDDEN_CATEGORIES.includes(category.name))

    const activeCategory = visibleCategories.find((c) => c.items.some((item) => item.href === pathname))?.name
    const { isOpen, setOpen } = useOpenCategory(visibleCategories, activeCategory)

    const navLink = (href: string, active: boolean) =>
        cn(
            "flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors",
            active ? "font-medium text-ui-heading" : "text-ui-secondary hover:text-ui-heading"
        )

    return (
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] flex-col grid-line border-r lg:flex">
            <nav className="flex-1 overflow-y-auto overscroll-contain px-4 py-8" data-lenis-prevent>
                <p className={sectionLabel}>Getting started</p>
                <ul className="space-y-0.5">
                    <li>
                        <Link href="/components" className={navLink("/components", pathname === "/components")}>
                            <LayoutGrid className="size-3.5" /> All components
                        </Link>
                    </li>
                </ul>

                <p className={cn(sectionLabel, "mt-10")}>Components</p>
                <div className="space-y-1 px-3">
                    {visibleCategories.map((category) => {
                        const open = isOpen(category.name)
                        const FolderIcon = open ? FolderOpen : Folder
                        return (
                            <TreeNav
                                key={category.name}
                                linkAs={Link}
                                open={open}
                                onOpenChange={(next) => setOpen(category.name, next)}
                                root={
                                    <>
                                        <FolderIcon className="size-3.5 shrink-0" style={{ color: "var(--ui-accent)" }} />
                                        <span className="flex-1 font-medium text-ui-heading">{category.name}</span>
                                        <span className="font-mono text-[11px] text-ui-hint">{category.items.length}</span>
                                    </>
                                }
                                items={category.items.map((item) => ({
                                    key: item.href,
                                    label: item.title,
                                    href: item.href,
                                    active: pathname === item.href,
                                    trailing: <ComponentBadge label={item.badge} />,
                                }))}
                            />
                        )
                    })}
                </div>
            </nav>

            <div className="grid-line border-t px-4 py-4">
                <div className="rounded-xl border border-ui-border bg-ui-subtle p-3.5">
                    <p className="text-[13px] font-medium text-ui-heading">Free &amp; open source</p>
                    <p className="mt-1 text-xs leading-relaxed text-ui-caption">
                        <a href={site.license} target="_blank" rel="noreferrer" className="underline decoration-ui-border-strong underline-offset-2 hover:text-ui-heading">
                            MIT licensed
                        </a>
                        . Ship it in any project; credit is optional.
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        <a href={site.repo} target="_blank" rel="noreferrer" data-press className="btn btn-secondary h-8 text-xs">
                            <Github className="size-3.5" /> Star
                        </a>
                        <a href={`mailto:${site.email}`} data-press className="btn btn-blue h-8 text-xs">
                            <Mail className="size-3.5" /> Say hi
                        </a>
                    </div>
                </div>
                <p className="mt-3 px-1 text-[11px] text-ui-hint">
                    <span className="font-serif text-xs text-ui-caption">{site.name}</span>{" "}
                    <span className="tabular-nums">v0.0.1</span> · by {site.author}
                </p>
            </div>
        </aside>
    )
}
