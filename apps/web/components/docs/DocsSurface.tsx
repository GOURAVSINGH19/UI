import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

type DocsTableProps = {
  headers: string[]
  rows: Array<Array<React.ReactNode>>
  className?: string
}

export function DocsTable({ headers, rows, className }: DocsTableProps) {
  return (
    <table
      className={cn(
        "w-full border-separate border-spacing-y-2 border-spacing-x-4 text-left text-sm",
        className
      )}
    >
      <thead>
        <tr className="text-neutral-500">
          {headers.map((header) => (
            <th key={header} className="font-semibold">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="[&_tr]:align-top [&_tr]:border-b [&_td]:py-2">
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
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
        "w-full flex justify-center rounded-xs mt-6 border border-white/5 bg-[var(--bg)]",
        inset ? "p-0" : "py-8 px-4",
        className
      )}
    >
      {children}
    </div>
  )
}

