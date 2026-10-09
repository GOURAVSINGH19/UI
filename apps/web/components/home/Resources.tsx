import type { ComponentType, SVGProps } from "react"
import { ArrowUpRight } from "lucide-react"
import { Icons, NextjsIcon } from "@workspace/ui/components/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { resources, site } from "@/lib/site"
import Link from "next/link"

// Real marks where we have them; everything else gets a serif monogram in the same circle.
const logos: Partial<Record<string, { Icon: ComponentType<SVGProps<SVGSVGElement>>; className?: string }>> = {
    "Next.js": { Icon: NextjsIcon, className: "rounded-full bg-black" },
    "Tailwind CSS": { Icon: Icons.tailwind, className: "text-sky-500" },
}

function Logo({ name }: { name: string }) {
    const logo = logos[name]
    return (
        <span
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center rounded-full border border-ui-border bg-ui-bg text-ui-heading"
        >
            {logo ? (
                <logo.Icon className={cn("size-3.5", logo.className)} />
            ) : (
                <span className="font-serif text-[13px] leading-none italic">{name.charAt(0)}</span>
            )}
        </span>
    )
}

/** The tools the library is built with, as a row of link badges. Core stack first. */
export function Resources() {
    const ordered = [...resources].sort((a, b) => Number(Boolean(b.core)) - Number(Boolean(a.core)))

    return (
        <div>
            <p className="eyebrow">Resources</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-ui-heading">Built on good tools.</h2>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-ui-caption">
                {site.name} stands on a small, boring-in-a-good-way stack. Next.js, Tailwind CSS and Motion do the
                heavy lifting; the rest handle docs, scrolling and icons.
            </p>

            <ul className="mt-6 divide-y divide-ui-border/60 border-y border-ui-border/60">
                {ordered.map((resource) => (
                    <li key={resource.name}>
                        <Link
                            href={resource.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center justify-between gap-4 py-3 px-2 transition-colors hover:bg-ui-muted/50 rounded-lg"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <Logo name={resource.name} />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-ui-heading">
                                            {resource.name}
                                        </span>
                                        {resource.category && (
                                            <span className="rounded-full border border-ui-border bg-ui-bg px-2 py-0.5 text-[11px] font-medium text-ui-hint">
                                                {resource.category}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-ui-caption truncate mt-0.5">
                                        {resource.use}
                                    </p>
                                </div>
                            </div>
                            <ArrowUpRight className="size-4 shrink-0 text-ui-hint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ui-heading" />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
