"use client"

import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { ease } from "./types"

/** The "Filter: All" button and its listbox, opening upward from the footer. */
export function FilterMenu({
  value,
  options,
  onChange,
}: {
  value: string
  options: Array<{ name: string; count: number }>
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const idPrefix = useId()
  const optionId = (i: number) => `${idPrefix}-option-${i}`

  useEffect(() => {
    if (!open) return
    listRef.current?.focus()
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    return () => document.removeEventListener("pointerdown", onDown)
  }, [open])

  useEffect(() => {
    if (open) document.getElementById(optionId(highlight))?.scrollIntoView({ block: "nearest" })
  }, [open, highlight])

  const openMenu = () => {
    setHighlight(Math.max(0, options.findIndex((o) => o.name === value)))
    setOpen(true)
  }

  const pick = (name: string) => {
    setOpen(false)
    onChange(name)
  }

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      const step = e.key === "ArrowDown" ? 1 : -1
      setHighlight((i) => (i + step + options.length) % options.length)
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      pick(options[highlight]!.name)
    } else if (e.key === "Escape" || e.key === "Tab") {
      e.preventDefault()
      e.stopPropagation()
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openMenu())}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Filter results: ${value}`}
        className={cn("btn btn-secondary h-7 gap-1.5 px-2.5 text-xs", open && "text-ui-heading")}
      >
        Filter
        <span className="font-medium text-ui-heading">{value}</span>
        <ChevronsUpDown className="size-3 text-ui-caption" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={listRef}
            role="listbox"
            aria-label="Filter results"
            aria-activedescendant={optionId(highlight)}
            tabIndex={-1}
            onKeyDown={onListKey}
            data-lenis-prevent
            initial={{ opacity: 0, y: 6, scale: 0.97, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 4, scale: 0.98, filter: "blur(4px)" }}
            transition={{ duration: 0.18, ease }}
            className="absolute bottom-[calc(100%+6px)] left-0 z-10 max-h-[min(16rem,calc(18vh+6rem))] w-52 origin-bottom-left overflow-y-auto overscroll-contain rounded-lg border border-ui-border bg-ui-bg p-1 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.35)] outline-none"
          >
            <p className="px-2 pt-1 pb-1.5 text-[11px] font-medium text-ui-hint">Show results from</p>
            {options.map((option, i) => {
              const selected = option.name === value
              return (
                <div
                  key={option.name}
                  id={optionId(i)}
                  role="option"
                  aria-selected={selected}
                  data-slot="search-filter-option"
                  onMouseMove={() => setHighlight(i)}
                  onClick={() => pick(option.name)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-ui-secondary",
                    i === highlight && "bg-ui-muted text-ui-heading",
                    selected && "text-ui-heading"
                  )}
                >
                  <Check className={cn("size-3.5 shrink-0", selected ? "opacity-100" : "opacity-0")} />
                  <span className="flex-1 truncate">{option.name}</span>
                  <span className="rounded-full bg-ui-subtle px-1.5 text-[10px] tabular-nums text-ui-caption">
                    {option.count}
                  </span>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
