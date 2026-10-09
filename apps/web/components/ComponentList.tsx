import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { getComponents } from "@/lib/components-index"
import { ComponentBadge } from "@/components/browser/ComponentBadge"

// The four cards on the home page, in order. Previews live in public/previews/<slug>-{light,dark}.png.
const FEATURED = ["prompt-input", "model-selector", "file-attachment", "organic-growth"]

const slugOf = (href: string) => href.split("/").pop() ?? ""

const ComponentList = () => {
    const components = getComponents()
    const featured = FEATURED.map((slug) => components.find((c) => slugOf(c.href) === slug)).filter(
        (c): c is NonNullable<typeof c> => Boolean(c)
    )

    return (
        <div>
            <h2 className="font-serif text-3xl text-ui-heading">Components</h2>
            <p className="text-ui-caption tracking-tight text-ui-body">
                Every component ships with a live preview, the source, and the
                variants you need. Pick one and drop it in.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {featured.map((item) => {
                    const slug = slugOf(item.href)
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="group block overflow-hidden rounded-xl border border-ui-border bg-ui-bg transition-[border-color,box-shadow] duration-200 hover:border-ui-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ui-border-strong"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden border-b border-ui-border-subtle bg-ui-subtle">
                                    {(["light", "dark"] as const).map((theme) => (
                                        <Image
                                            key={theme}
                                            src={`/previews/${slug}-${theme}.png`}
                                            alt=""
                                            fill
                                            sizes="(min-width: 640px) 420px, 100vw"
                                            className={`object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] ${theme === "light" ? "dark:hidden" : "hidden dark:block"}`}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-start justify-between gap-3 px-4 py-3.5">
                                    <div className="min-w-0">
                                        <p className="flex items-center gap-2 text-sm font-medium text-ui-heading">
                                            {item.title}
                                            <ComponentBadge label={item.badge} />
                                        </p>
                                        <p className="mt-1 line-clamp-1 text-[13px] text-ui-caption">{item.description}</p>
                                    </div>
                                    <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-ui-hint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ui-heading" />
                                </div>
                            </Link>
                        </li>
                    )
                })}
            </ul>

            <div className="mt-8 flex justify-center">
                <Link href="/components" data-press className="btn btn-blue h-9 px-4 text-sm">
                    View all {components.length} components
                    <ArrowRight className="size-3.5" />
                </Link>
            </div>
        </div>
    )
}

export default ComponentList
