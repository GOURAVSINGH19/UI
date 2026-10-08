import fs from "node:fs/promises"
import path from "node:path"
import { highlightCode } from "@/lib/highlightCode"
import { docsConfig } from "@/config/docs"
import { CopyButton } from "@/components/copy-button"
import { site } from "@/lib/site"
import { CodeWindow, type CodeWindowFile } from "./CodeWindow"

const CN_SRC = "components/docs/snippets/cn.ts"
const TOKENS_SRC = "../../packages/ui/src/styles/tokens.css"

const toAppImports = (code: string) =>
    code.replaceAll("@workspace/ui/components/ui/", "@/components/ui/").replaceAll("@workspace/ui/lib/", "@/lib/")

async function load(src: string | undefined, inline: string | undefined, lang: string) {
    "use cache"
    const raw = src ? await fs.readFile(path.join(process.cwd(), src), "utf-8") : (inline ?? "")
    const code = toAppImports(raw).trimEnd()
    const html = await highlightCode(code, lang, docsConfig.codeTheme || "nord")
    return { code, html }
}

const langOf = (file: string) => file.split(".").pop() ?? "tsx"

/** A component folder lists its main file first, then other components, then hooks and helpers, then index. */
function folderOrder(folder: string) {
    const rank = (name: string) =>
        name === `${folder}.tsx` ? 0 : name.startsWith("index.") ? 4 : name.endsWith(".tsx") ? 1 : name.startsWith("use-") ? 2 : 3
    return (a: string, b: string) => rank(a) - rank(b) || a.localeCompare(b)
}

/** Expands a component folder into one entry per file; a plain file passes through. */
async function expand(src: string, filePath: string): Promise<Array<{ src: string; path: string }>> {
    "use cache"
    const stat = await fs.stat(path.join(process.cwd(), src))
    if (!stat.isDirectory()) return [{ src, path: filePath }]
    const folder = filePath.split("/").pop() ?? ""
    const names = (await fs.readdir(path.join(process.cwd(), src))).filter((n) => /\.(tsx?|css)$/.test(n))
    return names.sort(folderOrder(folder)).map((name) => ({ src: `${src}/${name}`, path: `${filePath}/${name}` }))
}

const isFolder = (filePath: string) => !/\.[a-z]+$/.test(filePath)

function Path({ children }: { children: React.ReactNode }) {
    return <code className="rounded-md bg-ui-muted px-1.5 py-0.5 font-mono text-[0.85em] text-ui-heading">{children}</code>
}

async function CodeFile({ src, path: filePath }: { src: string; path: string }) {
    const { code, html } = await load(src, undefined, langOf(filePath))
    return (
        <figure className="overflow-hidden rounded-xl border border-white/10 bg-[#141414] text-sm shadow-sm">
            <figcaption className="flex h-11 items-center justify-between border-b border-white/10 pr-2 pl-4 font-mono text-xs text-zinc-400">
                <span className="truncate">{filePath}</span>
                <CopyButton value={code} className="border-0 bg-transparent text-zinc-400 shadow-none hover:bg-white/10 hover:text-white" />
            </figcaption>
            <div
                data-lenis-prevent
                className="code-file max-h-[32rem] overflow-auto overscroll-contain py-3"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </figure>
    )
}

export async function ComponentCode({
    path: filePath,
    src,
    tokens = false,
    utils = true,
    also = [],
}: {
    path: string
    src: string
    tokens?: boolean
    /** The component imports cn() from lib/utils. */
    utils?: boolean
    /** Additional files to show in tabs */
    also?: Array<{ src: string; path: string }>
}) {
    // Collect all files
    const files: Array<{ src: string; path: string }> = [
        ...(await expand(src, filePath)),
        // A component it builds on (a folder or a file) shows in the same Code tab.
        ...(await Promise.all(also.map((extra) => expand(extra.src, extra.path)))).flat(),
        ...(utils ? [{ src: CN_SRC, path: "lib/utils.ts" }] : []),
        ...(tokens ? [{ src: TOKENS_SRC, path: "styles/tokens.css" }] : []),
    ]

    // If only one file, use the simple single-file view
    if (files.length === 1) {
        const file = files[0]
        return (
            <div className="not-prose">
                <CodeFile src={file.src} path={file.path} />
            </div>
        )
    }

    // Multiple files: use CodeWindow with tabs
    const codeWindowFiles: CodeWindowFile[] = await Promise.all(
        files.map(async (file) => {
            const { code, html } = await load(file.src, undefined, langOf(file.path))
            return {
                path: file.path,
                code,
                html,
            }
        })
    )

    return (
        <div className="not-prose">
            <CodeWindow files={codeWindowFiles} />
        </div>
    )
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
    return (
        <li className="flex gap-4 border-t border-ui-border-subtle px-5 py-4">
            <span className="w-4 shrink-0 pt-0.5 font-mono text-xs text-ui-hint tabular-nums">{n}</span>
            <div className="min-w-0 flex-1 space-y-3 text-sm leading-relaxed text-ui-body">{children}</div>
        </li>
    )
}

/** The Setup section: MIT notice, then install → cn → (tokens) → component → import and render. */
export async function ComponentSetup({
    dependencies = "",
    path: filePath,
    example,
    tokens = false,
    utils = true,
}: {
    dependencies?: string
    path: string
    example: string
    tokens?: boolean
    utils?: boolean
}) {
    const packages = [utils && "clsx tailwind-merge", dependencies].filter(Boolean).join(" ")
    const install = packages ? `npm install ${packages}` : ""
    const exampleCode = example.trim()
    let n = 0

    return (
        <div className="not-prose mt-6 overflow-hidden rounded-xl border border-ui-border bg-ui-bg">
            <div className="px-5 py-2">
                <p className="text-sm font-medium text-ui-heading">How to use</p>
            </div>
            <ol>
                {install && (
                    <Step n={++n}>
                        <p>Run in your terminal:</p>
                        <div className="flex items-center gap-3 rounded-lg border border-ui-border bg-ui-subtle py-1.5 pr-1.5 pl-3.5 font-mono text-[13px] text-ui-heading">
                            <span className="text-ui-hint select-none">$</span>
                            <span className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap">{install}</span>
                            <CopyButton value={install} className="shrink-0 border-0 bg-transparent text-ui-caption shadow-none hover:bg-ui-muted hover:text-ui-heading" />
                        </div>
                    </Step>
                )}
                {utils && (
                    <Step n={++n}>
                        <p>
                            Copy <Path>lib/utils.ts</Path> from the Code tab. Skip if you already have <Path>cn()</Path>.
                        </p>
                    </Step>
                )}
                {tokens && (
                    <Step n={++n}>
                        <p>
                            Copy <Path>styles/tokens.css</Path> from the Code tab and import it in your global CSS after
                            Tailwind: <Path>@import &quot;./styles/tokens.css&quot;;</Path>
                        </p>
                    </Step>
                )}
                <Step n={++n}>
                    {isFolder(filePath) ? (
                        <p>
                            Create a <Path>{filePath}/</Path> folder and copy every file from the Code tab into it.
                            Each file does one job, so you can read or change a piece without the rest.
                        </p>
                    ) : (
                        <p>
                            Copy the component from the Code tab and create <Path>{filePath}</Path> in your project.
                        </p>
                    )}
                </Step>
                <Step n={++n}>
                    <p>Import and render:</p>
                    <div className="overflow-hidden rounded-lg border border-ui-border bg-ui-subtle">
                        <div className="flex items-center justify-between py-1 pr-1.5 pl-3.5">
                            <span className="font-mono text-[10px] tracking-widest text-ui-hint uppercase">Example</span>
                            <CopyButton value={exampleCode} className="border-0 bg-transparent text-ui-caption shadow-none hover:bg-ui-muted hover:text-ui-heading" />
                        </div>
                        <pre className="overflow-x-auto px-3.5 pb-3 font-mono text-[13px] leading-relaxed text-ui-heading">
                            {exampleCode}
                        </pre>
                    </div>
                </Step>
            </ol>
        </div>
    )
}
