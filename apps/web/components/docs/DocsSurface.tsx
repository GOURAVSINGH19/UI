import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

type DocsTableProps = {
  headers: string[]
  rows: Array<Array<React.ReactNode>>
  className?: string
}

/*
 * Cell styles by column. The first column is the prop name; a "Type" column
 * gets coloured mono text; "Default" values sit in a small chip; anything else
 * (Notes) is regular prose.
 */
function columnClass(header: string, index: number) {
  const name = header.toLowerCase()
  if (index === 0) {
    return "w-[1%] whitespace-nowrap [&_code]:font-mono [&_code]:text-[13px] [&_code]:font-medium [&_code]:text-ui-heading"
  }
  if (name === "type") {
    return "min-w-[11rem] [&_code]:font-mono [&_code]:text-[12.5px] [&_code]:leading-relaxed [&_code]:text-[var(--ui-accent)]"
  }
  if (name === "default") {
    return "w-[1%] whitespace-nowrap text-ui-hint [&_code]:rounded-md [&_code]:border [&_code]:border-ui-border [&_code]:bg-ui-subtle [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px] [&_code]:text-ui-secondary"
  }
  return "min-w-[14rem] leading-relaxed text-ui-caption"
}

/** Props / API table: bordered, with a tinted header and row dividers. Scrolls sideways on small screens. */
export function DocsTable({ headers, rows, className }: DocsTableProps) {
  return (
    <div className={cn("my-6 overflow-x-auto rounded-xl border border-ui-border", className)} data-lenis-prevent>
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ui-border bg-ui-subtle">
            {headers.map((header) => (
              <th key={header} scope="col" className="px-4 py-2.5 text-xs font-medium text-ui-caption">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-ui-border-subtle align-top transition-colors last:border-b-0 hover:bg-ui-subtle/60"
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={cn("px-4 py-3", columnClass(headers[cellIndex] ?? "", cellIndex))}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type DocsPreviewProps = {
  children: React.ReactNode
  className?: string
  inset?: boolean
}

export function DocsPreview({
  children,
  className,
  inset = false,
}: DocsPreviewProps) {
  return (
    <div
      className={cn(
        "w-full flex justify-center rounded-xs mt-6 border border-ui-border bg-ui-bg",
        inset ? "p-0" : "py-8 px-4",
        className
      )}
    >
      {children}
    </div>
  )
}
