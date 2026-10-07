"use client"

import { ArrowDown, ArrowUp, CornerDownLeft } from "lucide-react"

function HintButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-6 min-w-6 cursor-pointer items-center justify-center rounded-md border border-ui-border bg-ui-muted px-1.5 text-xs text-ui-heading transition-[scale,background-color,opacity] duration-150 hover:bg-ui-emphasis active:scale-90 disabled:cursor-default disabled:opacity-40 disabled:active:scale-100"
    >
      {children}
    </button>
  )
}

/** The keyboard hint row under the input. Every hint is also a button, so it works without a keyboard. */
export function GooHints({
  hasResults,
  onMove,
  onOpen,
  onClose,
}: {
  hasResults: boolean
  onMove: (step: number) => void
  onOpen: () => void
  onClose?: () => void
}) {
  return (
    <div className="flex items-center gap-4 border-t border-ui-border px-4 py-2 text-xs text-ui-caption">
      <span className="flex items-center gap-1.5">
        <HintButton label="Previous result" onClick={() => onMove(-1)} disabled={!hasResults}>
          <ArrowUp className="size-3" aria-hidden />
        </HintButton>
        <HintButton label="Next result" onClick={() => onMove(1)} disabled={!hasResults}>
          <ArrowDown className="size-3" aria-hidden />
        </HintButton>
        to navigate
      </span>
      <span className="flex items-center gap-1.5">
        <HintButton label="Open result" onClick={onOpen} disabled={!hasResults}>
          <CornerDownLeft className="size-3" aria-hidden />
        </HintButton>
        to open
      </span>
      {onClose && (
        <span className="ml-auto flex items-center gap-1.5">
          <HintButton label="Close search" onClick={onClose}>
            esc
          </HintButton>
          to close
        </span>
      )}
    </div>
  )
}
