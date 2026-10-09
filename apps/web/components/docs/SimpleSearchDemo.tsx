"use client"

import { useState } from "react"
import { SimpleSearch, type SimpleSearchItem } from "@workspace/ui/components/ui/simple-search/index"

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
        <div className="flex items-center justify-center w-full max-w-md flex-col gap-3 self-start pt-4">
            <div className="flex  items-center justify-between rounded-lg border border-ui-border bg-ui-bg px-6 py-1">
                <SimpleSearch items={ITEMS} onSelect={(item) => setPicked(item.title)} hotkey={false} label="Search the demo docs" />
            </div>
            <p role="status" className="px-1 text-xs text-ui-caption">
                {picked ? `Opened “${picked}”` : "Click the search button, type, or use the filter."}
            </p>
        </div>
    )
}
