"use client"

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react"
import { animate, motion, useMotionValue } from "framer-motion"
import { Search, X } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { GooResults, type GooGroup } from "./goo-results"
import { GooHints } from "./hints"
import { GOO_SPRING, REST_GAP, SPRING, type GooSearchItem, type GooSearchProps } from "./types"

export function GooSearch({
  items,
  onOpen,
  onClose,
  linkResults = false,
  linkAs: LinkComponent = "a",
  placeholder = "Search…",
  initialQuery = "",
  maxResultsHeight = 340,
  compact = false,
  label = "Search",
  className,
}: GooSearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputBlockRef = useRef<HTMLDivElement>(null)
  const resultsContentRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLElement | null>>([])
  const [inputBlockHeight, setInputBlockHeight] = useState(0)
  const resultsHeight = useMotionValue(0)
  const blobGap = useMotionValue(0)
  const filterId = `goo-${useId().replace(/:/g, "")}`
  const listId = `${filterId}-list`

  const trimmed = query.trim()

  const results = useMemo(() => {
    if (!trimmed) return []
    const needle = trimmed.toLowerCase()
    return items.filter((item) =>
      [item.title, item.category, item.keywords ?? ""].some((field) => field.toLowerCase().includes(needle))
    )
  }, [items, trimmed])

  const groups = useMemo(() => {
    const map = new Map<string, GooGroup[1]>()
    results.forEach((item, index) => {
      const group = map.get(item.category) ?? []
      group.push({ ...item, index })
      map.set(item.category, group)
    })
    return [...map.entries()]
  }, [results])

  const open = (item: GooSearchItem | undefined) => item && onOpen(item)

  const move = (step: number) => {
    if (!results.length) return
    setActiveIndex((current) => (current + step + results.length) % results.length)
    inputRef.current?.focus()
  }

  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  useLayoutEffect(() => {
    const block = inputBlockRef.current
    if (!block) return
    const observer = new ResizeObserver(() => setInputBlockHeight(block.offsetHeight))
    observer.observe(block)
    return () => observer.disconnect()
  }, [])

  // The results blob grows to fit, and the gap between the blobs springs open so they look like they pull apart.
  useLayoutEffect(() => {
    const contentHeight = trimmed ? (resultsContentRef.current?.scrollHeight ?? 0) : 0
    const isOpen = contentHeight > 0
    const heightControls = animate(resultsHeight, Math.min(contentHeight, maxResultsHeight), SPRING)
    const gapControls = animate(blobGap, isOpen ? REST_GAP : 0, isOpen ? GOO_SPRING : SPRING)
    return () => {
      heightControls.stop()
      gapControls.stop()
    }
  }, [trimmed, results.length, resultsHeight, blobGap, maxResultsHeight])

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      move(1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      move(-1)
    } else if (event.key === "Enter") {
      event.preventDefault()
      open(results[activeIndex])
    } else if (event.key === "Escape" && onClose) {
      onClose()
    }
  }

  const hasResults = results.length > 0

  return (
    <div className={cn("relative h-fit w-full", className)}>
      <svg aria-hidden className="absolute size-0">
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      {/* Two blobs, input and results, merged by the goo filter. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 flex flex-col"
        style={{
          filter: `url(#${filterId}) drop-shadow(0 0 0.5px color-mix(in oklab, var(--ui-text-heading) 20%, transparent)) drop-shadow(0 0px 4px rgb(0 0 0 / 0.22))`,
        }}
      >
        <div className="rounded-xs bg-ui-bg" style={{ height: inputBlockHeight }} />
        <motion.div className="rounded-xs bg-ui-bg" style={{ height: resultsHeight, marginTop: blobGap }} />
      </div>

      <div className="relative flex flex-col">
        <div ref={inputBlockRef}>
          <div className={cn("flex items-center gap-3 px-4", compact ? "h-11" : "h-14")}>
            <Search className="size-4 shrink-0 text-ui-caption" aria-hidden />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActiveIndex(0)
              }}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              role="combobox"
              aria-label={label}
              aria-expanded={hasResults}
              aria-controls={listId}
              aria-activedescendant={hasResults ? `${listId}-${activeIndex}` : undefined}
              className={cn(
                "h-full w-full bg-transparent text-ui-heading outline-none placeholder:text-ui-hint",
                compact ? "text-sm" : "text-base"
              )}
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("")
                  setActiveIndex(0)
                  inputRef.current?.focus()
                }}
                className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-ui-caption transition-colors hover:bg-ui-muted hover:text-ui-heading"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            )}
          </div>
          <GooHints hasResults={hasResults} onMove={move} onOpen={() => open(results[activeIndex])} onClose={onClose} />
        </div>

        <motion.div
          style={{ height: resultsHeight, marginTop: blobGap }}
          className="overflow-y-auto overscroll-contain [scrollbar-width:none]"
          data-lenis-prevent
        >
          <div ref={resultsContentRef} id={listId} role="listbox" aria-label="Results" className="p-2">
            <GooResults
              groups={groups}
              query={trimmed}
              listId={listId}
              layoutId={`${filterId}-active`}
              activeIndex={activeIndex}
              itemRefs={itemRefs}
              onHover={setActiveIndex}
              onOpen={onOpen}
              onClose={onClose}
              linkResults={linkResults}
              LinkComponent={LinkComponent}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
