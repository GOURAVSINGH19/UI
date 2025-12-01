
import fs from "node:fs/promises"
import path from "node:path"
import * as React from "react"

import { highlightCode } from "../lib/highlightCode"
import { docsConfig } from "../config/docs"
import { cn } from "@workspace/ui/lib/utils"
import { CodeCollapsibleWrapper } from "@/components/codeCollapse"
import { CopyButton } from "@/components/copy-button"

export async function ComponentSource({
  name,
  src,
  title,
  language,
  collapsible = true,
  className,
}: React.ComponentProps<"div"> & {
  name?: string
  src?: string
  title?: string
  language?: string
  collapsible?: boolean
}) {
  if (!name && !src) {
    return null
  }

  let code: string | undefined

  if (src) {
    const file = await fs.readFile(path.join(process.cwd(), src), "utf-8")
    code = file
  }

  if (!code) {
    return null
  }

  const lang = language ?? title?.split(".").pop() ?? "tsx"
  const theme = docsConfig.codeTheme || "default"
  const highlightedCode = await highlightCode(code, lang, theme)

  if (!collapsible) {
    return (
      <div className={cn("relative", className)}>
        <ComponentCode
          code={code}
          highlightedCode={highlightedCode}
          language={lang}
          title={title}
        />
      </div>
    )
  }

  return (
    <CodeCollapsibleWrapper className={className}>
      <ComponentCode
        code={code}
        highlightedCode={highlightedCode}
        language={lang}
        title={title}
      />
    </CodeCollapsibleWrapper>
  )
}

function ComponentCode({
  code,
  highlightedCode,
}: {
  code: string
  highlightedCode: string
  language: string
  title: string | undefined
}) {
  return (
    <figure
      data-rehype-pretty-code-figure=""
      className="relative"
    >
      <div className="absolute top-2 right-2 z-10">
        <CopyButton value={code} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  )
}
