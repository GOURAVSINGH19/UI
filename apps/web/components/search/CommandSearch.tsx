"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useLenis } from "lenis/react"
import { SimpleSearch, type SimpleSearchItem } from "@workspace/ui/components/ui/simple-search"
import type { ComponentEntry } from "@/lib/component-groups"
import { cue } from "@/lib/sound"

const PAGES: SimpleSearchItem[] = [
    { title: "Home", href: "/", group: "Pages" },
    { title: "All components", href: "/components", group: "Pages", description: "Browse the full catalog" },
]

/** Navbar search: the library's SimpleSearch, wired to the router, Lenis and UI sounds. */
export function CommandSearch({ components }: { components: ComponentEntry[] }) {
    const router = useRouter()
    const lenis = useLenis()
    const [open, setOpen] = useState(false)

    const items = useMemo<SimpleSearchItem[]>(
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

    // Subtle open/close cues; the README's advice for a palette that opens many times a day.
    const wasOpen = useRef(false)
    useEffect(() => {
        if (open !== wasOpen.current) cue(open ? "open" : "close", { emphasis: "subtle" })
        wasOpen.current = open
    }, [open])

    // Lenis drives the page scroll, so pause it while the dialog is up.
    useEffect(() => {
        if (!open) return
        lenis?.stop()
        return () => lenis?.start()
    }, [open, lenis])

    return (
        <SimpleSearch
            items={items}
            open={open}
            onOpenChange={setOpen}
            onSelect={(item) => item.href && router.push(item.href)}
            onFilterChange={(_, direction) => cue("select", { direction })}
            label="Search components and pages"
            inputProps={{ "data-cuelume-type": true, "data-cuelume-emphasis": "subtle" }}
        />
    )
}
