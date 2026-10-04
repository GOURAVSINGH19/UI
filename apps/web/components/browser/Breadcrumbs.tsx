import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface Crumb {
    label: string
    href?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-ui-caption">
                {items.map((item, i) => {
                    const last = i === items.length - 1
                    return (
                        <li key={item.label} className="flex items-center gap-1">
                            {item.href && !last ? (
                                <Link href={item.href} className="transition-colors hover:text-ui-heading">
                                    {item.label}
                                </Link>
                            ) : (
                                <span aria-current={last ? "page" : undefined} className={last ? "text-ui-strong" : undefined}>
                                    {item.label}
                                </span>
                            )}
                            {!last && <ChevronRight className="size-3 text-ui-hint" aria-hidden />}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
