import { ArrowUpRight, Plus } from "lucide-react"
import { site } from "@/lib/site"

const SPONSOR_MAIL = `mailto:${site.email}?subject=${encodeURIComponent("Sponsoring Kinetik")}`

/** Sponsor slot. No sponsors yet, so it is an honest invitation rather than a fake logo wall. */
export function Sponsors() {
    return (
        <div>
            <p className="eyebrow">Sponsors</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-ui-heading">Back the work.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ui-caption">
                Kinetik is free and built in spare time. Sponsors help pay for the hours that go
                into every component, and get their brand shown right here.
            </p>

            <a
                href={SPONSOR_MAIL}
                className="group mt-6 flex items-center justify-between gap-4 rounded-xl border border-dashed border-ui-border-strong px-4 py-4 transition-colors hover:border-ui-heading hover:bg-ui-subtle"
            >
                <span className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg border border-ui-border bg-ui-bg text-ui-caption transition-colors group-hover:text-ui-heading">
                        <Plus className="size-4" />
                    </span>
                    <span>
                        <span className="block text-sm font-medium text-ui-heading">Your brand here</span>
                        <span className="block text-xs text-ui-caption">Be the first sponsor of Kinetik</span>
                    </span>
                </span>
                <span className="flex items-center gap-1 text-xs text-ui-caption transition-colors group-hover:text-ui-heading">
                    Get in touch
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
            </a>
        </div>
    )
}
