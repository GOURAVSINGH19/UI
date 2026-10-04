"use client"

import { useId, useState } from "react"
import OrganicGrowth, { type Sprout } from "@workspace/ui/components/ui/organic-growth"

// Short vines that fit around a small card.
const SPROUTS: Sprout[] = [
    { edge: "top", t: 0.12, side: -1, length: 60, end: "curl", branch: false },
    { edge: "top", t: 0.6, side: 1, length: 45, end: "bloom", branch: false },
    { edge: "right", t: 0.3, side: 1, length: 55, end: "bloom", branch: false },
    { edge: "right", t: 0.8, side: -1, length: 40, end: "curl", branch: false },
    { edge: "bottom", t: 0.85, side: 1, length: 50, end: "curl", branch: false },
    { edge: "bottom", t: 0.25, side: -1, length: 45, end: "bloom", branch: false },
    { edge: "left", t: 0.7, side: -1, length: 55, end: "bloom", branch: false, blooms: [0.5] },
    { edge: "left", t: 0.2, side: 1, length: 40, end: "curl", branch: false },
]

const field =
    "h-10 w-full rounded-lg border border-ui-border bg-ui-bg px-3 text-sm text-ui-heading outline-none transition-colors placeholder:text-ui-hint focus:border-ui-border-strong"

/** A suggestion form: vines grow while you hover or type, and stay once it's sent. */
export function OrganicGrowthDemo() {
    const [sent, setSent] = useState(false)
    const id = useId()

    return (
        <div className="grid w-full place-items-center py-16">
            <OrganicGrowth
                active={sent ? true : undefined}
                sprouts={SPROUTS}
                padding={70}
                tuck={12}
                style={{ width: "min(300px, 78%)" }}
            >
                <section
                    aria-labelledby={`${id}-title`}
                    className="rounded-2xl border border-ui-border bg-ui-bg p-5 shadow-[0_30px_60px_-35px_rgba(35,48,39,0.35)]"
                >
                    <h3 id={`${id}-title`} className="text-lg tracking-tight text-ui-heading">
                        Suggest a component
                    </h3>
                    {sent ? (
                        <div className="mt-2 space-y-3">
                            <p className="text-sm text-ui-caption">Thanks! Your idea is in the garden now.</p>
                            <button
                                type="button"
                                onClick={() => setSent(false)}
                                className="cursor-pointer text-sm font-medium text-ui-heading underline decoration-ui-border underline-offset-4 transition-colors hover:decoration-ui-heading"
                            >
                                Suggest another
                            </button>
                        </div>
                    ) : (
                        <form
                            className="mt-3 grid gap-2.5"
                            onSubmit={(e) => {
                                e.preventDefault()
                                setSent(true)
                            }}
                        >
                            <label className="sr-only" htmlFor={`${id}-name`}>
                                Component name
                            </label>
                            <input id={`${id}-name`} type="text" placeholder="Component name" required className={field} />
                            <label className="sr-only" htmlFor={`${id}-link`}>
                                Reference link
                            </label>
                            <input id={`${id}-link`} type="url" placeholder="https:// (optional)" className={field} />
                            <button
                                type="submit"
                                className="mt-1 h-10 cursor-pointer rounded-lg bg-ui-inverse text-sm font-medium text-ui-on-inverse transition-[opacity,scale] duration-200 hover:opacity-90 active:scale-[0.98]"
                            >
                                Send suggestion
                            </button>
                        </form>
                    )}
                </section>
            </OrganicGrowth>
        </div>
    )
}
