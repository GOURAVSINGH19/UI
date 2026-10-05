import { Plus } from "lucide-react"
import { faqs } from "@/lib/site"

/** FAQ built on <details>, so it opens with the keyboard and works without JavaScript. */
export function Faq() {
    return (
        <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-ui-heading">Good questions.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ui-caption">
                The things people ask most about using Kinetik in real projects.
            </p>

            <div className="mt-6 border-t border-ui-border-subtle">
                {faqs.map((faq) => (
                    <details key={faq.q} className="group border-b border-ui-border-subtle">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium text-ui-heading [&::-webkit-details-marker]:hidden">
                            {faq.q}
                            <Plus className="size-4 shrink-0 text-ui-caption transition-transform duration-200 group-open:rotate-45" />
                        </summary>
                        <p className="-mt-1 pr-8 pb-4 text-sm leading-relaxed text-ui-caption">{faq.a}</p>
                    </details>
                ))}
            </div>
        </div>
    )
}
