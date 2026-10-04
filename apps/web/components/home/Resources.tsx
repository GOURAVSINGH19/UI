import { ArrowUpRight } from "lucide-react"
import { resources } from "@/lib/site"

const domain = (href: string) => new URL(href).hostname.replace(/^www\./, "")

/** The tools Uiin is built with, as a small grid of cards (1px gaps draw the grid lines). */
export function Resources() {
    return (
        <div>
            <p className="eyebrow">Resources</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-ui-heading">Built on good tools.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ui-caption">
                The open source projects that make Uiin possible. Worth a look if you are
                building something similar.
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-ui-border bg-ui-border sm:grid-cols-2">
                {resources.map((resource) => (
                    <li key={resource.name} className="bg-ui-bg">
                        <a
                            href={resource.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex h-full items-start justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-ui-subtle"
                        >
                            <span className="min-w-0">
                                <span className="block text-sm font-medium text-ui-heading">{resource.name}</span>
                                <span className="block text-xs text-ui-caption">{resource.use}</span>
                                <span className="mt-1.5 block font-mono text-[11px] text-ui-hint">{domain(resource.href)}</span>
                            </span>
                            <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-ui-hint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ui-heading" />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
