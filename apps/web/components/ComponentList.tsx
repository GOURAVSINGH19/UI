import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { getComponents } from "@/lib/components-index"
import { ComponentBadge } from "@/components/browser/ComponentBadge"

const ComponentList = () => {
    const components = getComponents()

    return (
        <div>
            <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-serif text-3xl text-ui-heading">Components</h2>
                <Link href="/components" className="text-xs text-ui-caption transition-colors hover:text-ui-heading">View all {components.length} →</Link>
            </div>
            <p className="mt-heading-text text-base tracking-tight text-ui-body">
                Every component ships with a live preview, the source, and the
                variants you need. Pick one and drop it in.
            </p>

            <ul className="mt-6 border-t border-ui-border-subtle">
                {components.map((item) => (
                    <li key={item.href} className="border-b border-ui-border-subtle">
                        <Link
                            href={item.href}
                            className="group -mx-3 flex items-center justify-between rounded-md px-3 py-3 text-sm text-ui-strong transition-colors hover:bg-ui-subtle"
                        >
                            <span className="flex items-center gap-2">
                                {item.title}
                                <ComponentBadge label={item.badge} />
                                <span className="text-ui-hint">/ {item.category}</span>
                            </span>
                            <ArrowUpRight className="size-3.5 text-ui-hint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ui-heading" />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ComponentList
