"use client"

import { useState } from "react"
import { GooSearch, type GooSearchItem } from "@workspace/ui/components/ui/goo-search/index"

const ITEMS: GooSearchItem[] = [
    ...["Accordion", "Button", "Dialog", "Dropdown Menu", "Popover", "Tabs", "Toggle", "Tooltip"].map((title) => ({
        title,
        href: "#",
        category: "Components",
    })),
    ...["useDebounce", "useLockBodyScroll", "useMediaQuery", "useClickOutside"].map((title) => ({
        title,
        href: "#",
        category: "Hooks",
    })),
    ...["Installation", "Theming", "Dark mode", "Animations"].map((title) => ({
        title,
        href: "#",
        category: "Guides",
    })),
]

export function GooSearchDemo() {
    const [opened, setOpened] = useState<string | null>(null)

    return (
        <div className="flex h-96 w-full max-w-md flex-col gap-3 self-start pt-4">
            <GooSearch
                items={ITEMS}
                onOpen={(item) => setOpened(item.title)}
                placeholder="Try “use” or “button”…"
                label="Search the demo docs"
                maxResultsHeight={240}
                compact
            />
            <p role="status" className="px-1 text-xs text-ui-caption">
                {opened ? `Opened “${opened}”` : "Type to see the results melt out of the input."}
            </p>
        </div>
    )
}
