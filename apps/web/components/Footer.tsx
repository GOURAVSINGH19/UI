"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Copy, Github, Linkedin, Mail } from "lucide-react"
import { cue } from "@/lib/sound"
import { Icons } from "@workspace/ui/components/ui/icons"
import { site, socials } from "@/lib/site"

const SOCIAL_ICONS = {
    x: (props: { className?: string }) => <Icons.twitter {...props} className={`${props.className} fill-current`} />,
    linkedin: Linkedin,
    github: Github,
}

const columnTitle = "eyebrow"
const columnLink =
    "inline-flex items-center gap-2 text-sm text-ui-secondary transition-colors hover:text-ui-heading"

function CopyEmail() {
    const [copied, setCopied] = useState(false)

    return (
        <button
            type="button"
            data-sound="off"
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(site.email)
                    cue("success", { emphasis: "subtle" })
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1600)
                } catch {
                    window.location.href = `mailto:${site.email}`
                }
            }}
            className="group btn btn-secondary h-8 gap-2 pr-3 pl-2.5 text-sm text-ui-strong"
        >
            <Mail className="size-3.5 text-ui-caption" />
            {site.email}
            {copied ? (
                <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
                <Copy className="size-3.5 text-ui-hint transition-colors group-hover:text-ui-heading" />
            )}
            <span role="status" className="sr-only">{copied ? "Email copied" : ""}</span>
        </button>
    )
}

const Footer = () => {
    return (
        <div>
            <div className="grid gap-10 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-14">
                <div>
                    <Link href="/" className="font-serif text-2xl leading-none text-ui-heading">
                        {site.name}
                    </Link>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-ui-caption">
                        Free, open source React components. Copy them in and make them yours.
                    </p>
                    <div className="mt-5">
                        <CopyEmail />
                    </div>
                </div>

                <nav aria-label="Explore">
                    <p className={columnTitle}>Explore</p>
                    <ul className="mt-3 space-y-2">
                        <li><Link href="/" className={columnLink}>Home</Link></li>
                        <li><Link href="/components" className={columnLink}>Components</Link></li>
                        <li><a href={site.repo} target="_blank" rel="noreferrer" className={columnLink}>Source code</a></li>
                    </ul>
                </nav>

                <nav aria-label="Connect">
                    <p className={columnTitle}>Connect</p>
                    <ul className="mt-3 space-y-2">
                        {socials.map((social) => {
                            const Icon = SOCIAL_ICONS[social.key]
                            return (
                                <li key={social.key}>
                                    <a href={social.href} target="_blank" rel="noreferrer" className={columnLink}>
                                        <Icon className="size-3.5" />
                                        {social.label}
                                    </a>
                                </li>
                            )
                        })}
                        <li>
                            <a href={`mailto:${site.email}`} className={columnLink}>
                                <Mail className="size-3.5" />
                                Email
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="mt-10 flex flex-col gap-2 border-t border-ui-border-subtle pt-5 text-xs text-ui-caption sm:flex-row sm:items-center sm:justify-between">
                <p>
                    Built in public by{" "}
                    <a href={socials[0].href} target="_blank" rel="noreferrer" className="text-ui-strong underline-offset-4 hover:underline">
                        {site.author}
                    </a>
                </p>
                <p>© 2026 {site.name} · MIT licensed</p>
            </div>
        </div>
    )
}
export default Footer
