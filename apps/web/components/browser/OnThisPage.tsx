"use client"

import { useEffect, useState } from "react"
import { ArrowUp, FileText } from "lucide-react"
import { TreeNav } from "./TreeNav"
import { useLenis } from "lenis/react"
import { cn } from "@workspace/ui/lib/utils"

interface Section {
    id: string
    title: React.ReactNode
}

/**
 * "On this page" outline. The page header (id="overview") is the tree's root;
 * `sections` are its branches.
 */
export function OnThisPage({ title, sections }: { title: string; sections: Section[] }) {
    const [active, setActive] = useState("overview")
    const lenis = useLenis()

    // The active section is the last heading above a trigger line. Normally the
    // line sits just under the navbar; over the last half-screen of scrolling it
    // slides down to 70% of the viewport, so short final sections (whose
    // headings can never reach the top) still become active as you reach them.
    useEffect(() => {
        const ids = ["overview", ...sections.map((section) => section.id)]
        const TOP_LINE = 120 // navbar + a little breathing room
        let frame = 0

        const update = () => {
            frame = 0
            const vh = window.innerHeight
            const remaining = document.documentElement.scrollHeight - (window.scrollY + vh)
            const approach = vh * 0.5
            const progress = Math.min(1, Math.max(0, 1 - remaining / approach))
            const line = TOP_LINE + (vh * 0.7 - TOP_LINE) * progress

            let current = ids[0]
            for (const id of ids) {
                const el = document.getElementById(id)
                if (el && el.getBoundingClientRect().top <= line) current = id
            }
            // Fully at the bottom: the last section is what you're reading.
            if (remaining <= 2 && ids.length > 1) current = ids[ids.length - 1]
            setActive(current)
        }
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update)
        }

        update()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }, [sections])

    return (
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] flex-col justify-between grid-line border-l px-6 py-10 xl:flex">
            <div className="min-w-0">
                <p className="eyebrow">On this page</p>
                <TreeNav
                    className="mt-4"
                    root={
                        <a
                            href="#overview"
                            className={cn(
                                "flex min-w-0 items-center gap-2 transition-colors",
                                active === "overview" ? "text-ui-heading" : "text-ui-secondary hover:text-ui-heading"
                            )}
                        >
                            <FileText className="size-3.5 shrink-0" style={{ color: "var(--ui-accent)" }} />
                            <span className="truncate font-medium">{title}</span>
                        </a>
                    }
                    items={sections.map((section) => ({
                        key: section.id,
                        label: section.title,
                        href: `#${section.id}`,
                        active: active === section.id,
                    }))}
                />
            </div>

            <button
                type="button"
                onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" }))}
                className="flex cursor-pointer items-center gap-2 grid-line border-t pt-4 text-xs text-ui-caption transition-colors hover:text-ui-heading"
            >
                <ArrowUp className="size-3.5" />
                Back to top
            </button>
        </aside>
    )
}
