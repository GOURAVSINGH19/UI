"use client"

import { useState } from "react"
import { SimpleSearch, type SimpleSearchItem } from "@workspace/ui/components/ui/simple-search"

const ITEMS: SimpleSearchItem[] = [
    { title: "Introduction", group: "Getting started", description: "What this library is and how to use it" },
    { title: "Installation", group: "Getting started", description: "Copy a component into your app" },
    { title: "Theming", group: "Getting started", description: "Colours, radius and dark mode tokens" },
    { title: "Button", group: "Components", description: "Primary, secondary and ghost actions" },
    { title: "Dialog", group: "Components", description: "A modal window over the page" },
    { title: "Tabs", group: "Components", description: "Switch between related views", badge: "New" },
    { title: "Tooltip", group: "Components", description: "A short hint on hover or focus" },
    { title: "useDebounce", group: "Hooks", description: "Delay a value until it stops changing" },
    { title: "useMediaQuery", group: "Hooks", description: "Match a CSS media query in React" },
]

export function SimpleSearchDemo() {
    const [picked, setPicked] = useState<string | null>(null)

    return (
        <div className="flex w-full max-w-md flex-col gap-3 self-start pt-4">
            {/* A tiny navbar so the trigger sits where it would on a real site. */}
            <div className="flex h-12 items-center justify-between rounded-full border border-ui-border bg-ui-bg pr-2.5 pl-4">
                <span className="font-serif text-lg text-ui-heading">Acme</span>
                {/* hotkey off here: this page's own navbar search already uses ⌘K. */}
                <SimpleSearch items={ITEMS} onSelect={(item) => setPicked(item.title)} hotkey={false} label="Search the demo docs" />
            </div>
            <p role="status" className="px-1 text-xs text-ui-caption">
                {picked ? `Opened “${picked}”` : "Click the search button, type, or use the filter."}
            </p>
        </div>
    )
}
