"use client"

import { Fragment, useId, useRef, useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { getIconForLanguageExtension } from "@workspace/ui/components/ui/icons"
import { CopyButton } from "@/components/copy-button"

export type CodeWindowFile = {
    /** Where the reader creates the file, e.g. components/ui/button.tsx. */
    path: string
    /** Raw text for the copy button. */
    code: string
    /** Shiki output. */
    html: string
}

const fileName = (path: string) => path.split("/").pop() ?? path
const extension = (path: string) => path.split(".").pop() ?? ""

/** One editor window, VS Code style: a tab per file, a breadcrumb, and a single code pane. */
export function CodeWindow({ files }: { files: CodeWindowFile[] }) {
    const [active, setActive] = useState(0)
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
    const id = useId()
    const file = files[active]
    if (!file) return null

    // Arrow keys move between tabs, as in any tablist.
    const onKeyDown = (e: React.KeyboardEvent) => {
        const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0
        const to = e.key === "Home" ? 0 : e.key === "End" ? files.length - 1 : (active + step + files.length) % files.length
        if (!step && e.key !== "Home" && e.key !== "End") return
        e.preventDefault()
        setActive(to)
        tabRefs.current[to]?.focus()
    }

    return (
        <div className="not-prose overflow-hidden rounded-xl border border-white/10 bg-[#141414] text-sm shadow-sm">
            <div role="tablist" aria-label="Files" onKeyDown={onKeyDown} className="no-scrollbar flex overflow-x-auto border-b border-white/10 bg-[#0e0e0e]">
                {files.map((f, i) => {
                    const selected = i === active
                    return (
                        <button
                            key={f.path}
                            ref={(el) => {
                                tabRefs.current[i] = el
                            }}
                            type="button"
                            role="tab"
                            id={`${id}-tab-${i}`}
                            aria-selected={selected}
                            aria-controls={`${id}-panel`}
                            tabIndex={selected ? 0 : -1}
                            title={f.path}
                            onClick={() => setActive(i)}
                            className={cn(
                                "relative flex h-10 shrink-0 cursor-pointer items-center gap-2 border-r border-white/10 px-4 font-mono text-xs transition-colors outline-none focus-visible:bg-white/5",
                                selected ? "bg-[#141414] text-zinc-100" : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300"
                            )}
                        >
                            {/* Active tab: a line on top and no bottom border, so it joins the editor. */}
                            {selected && <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-sky-400" />}
                            {selected && <span aria-hidden className="absolute inset-x-0 -bottom-px h-px bg-[#141414]" />}
                            <span className="flex [&_svg]:size-3.5 [&_svg]:fill-current">{getIconForLanguageExtension(extension(f.path))}</span>
                            {fileName(f.path)}
                        </button>
                    )
                })}
            </div>

            <div className="flex h-9 items-center gap-3 border-b border-white/5 pr-1.5 pl-4 font-mono text-[11px] text-zinc-500">
                <span className="flex min-w-0 flex-1 items-center gap-1 truncate">
                    {file.path.split("/").map((part, i, parts) => (
                        <Fragment key={i}>
                            {i > 0 && <ChevronRight className="size-3 shrink-0 text-zinc-600" />}
                            <span className={i === parts.length - 1 ? "text-zinc-300" : undefined}>{part}</span>
                        </Fragment>
                    ))}
                </span>
                <span className="hidden tabular-nums sm:inline">{file.code.split("\n").length} lines</span>
                <CopyButton
                    key={file.path}
                    value={file.code}
                    className="border-0 bg-transparent text-zinc-400 shadow-none hover:bg-white/10 hover:text-white"
                />
            </div>

            <div
                id={`${id}-panel`}
                role="tabpanel"
                aria-labelledby={`${id}-tab-${active}`}
                tabIndex={0}
                data-lenis-prevent
                className="code-file max-h-[32rem] overflow-auto overscroll-contain py-3 outline-none"
                dangerouslySetInnerHTML={{ __html: file.html }}
            />
        </div>
    )
}
