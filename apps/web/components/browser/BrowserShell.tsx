import { getComponents, groupByCategory } from "@/lib/components-index"
import { BrowserSidebar } from "./BrowserSidebar"

// Three-column frame shared by /components and every component page.
// Children render the <main> column and, optionally, an <OnThisPage /> aside.
export function BrowserShell({ children }: { children: React.ReactNode }) {
    const categories = groupByCategory(getComponents())

    return (
        // Outer rails frame all three columns; the columns' own borders are the inner grid lines.
        <div className="mx-auto grid w-full max-w-[calc(var(--ui-sidebar-width)+var(--ui-browser-main-width)+var(--ui-toc-width))] flex-1 grid-line pt-14 md:border-x lg:grid-cols-[var(--ui-sidebar-width)_minmax(0,1fr)] xl:grid-cols-[var(--ui-sidebar-width)_minmax(0,1fr)_var(--ui-toc-width)]">
            <BrowserSidebar categories={categories} />
            {children}
        </div>
    )
}
