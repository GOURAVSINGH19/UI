import type { ComponentType, SVGProps } from "react"
import { ArrowUpRight } from "lucide-react"
import { Icons, NextjsIcon } from "@workspace/ui/components/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { resources, site } from "@/lib/site"

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
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ui-caption">
                {site.name} stands on a small, boring-in-a-good-way stack. Next.js, Tailwind CSS and Motion do the
                heavy lifting; the rest handle docs, scrolling and icons.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
                {ordered.map((resource) => (
                    <li key={resource.name}>
                        <a
                            href={resource.href}
                            target="_blank"
                            rel="noreferrer"
                            title={`${resource.name}: ${resource.use}`}
                            className="group btn btn-secondary h-9 gap-2 pr-3 pl-1.5 text-sm"
                        >
                            <Logo name={resource.name} />
                            <span className="text-ui-heading">{resource.name}</span>
                            {resource.core && <span className="text-xs text-ui-hint">{resource.category}</span>}
                            <ArrowUpRight className="size-3 text-ui-hint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ui-heading" />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
