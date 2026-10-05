"use client"

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react"
import { animate, motion, useMotionValue } from "framer-motion"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  CornerDownLeft,
  FileText,
  Search,
  X,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export type GooSearchItem = {
  title: string
  href: string
  category: string
  keywords?: string
  external?: boolean
}

const REST_GAP = 14
const SPRING = { type: "spring", stiffness: 320, damping: 32, mass: 0.9 } as const
const GOO_SPRING = { type: "spring", stiffness: 180, damping: 15, mass: 0.1 } as const

function Highlight({ text, query }: { text: string; query: string }) {
  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (!query || index === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-[3px] bg-ui-emphasis text-ui-heading">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  )
}

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

export type GooSearchProps = {
  items: GooSearchItem[]
  onOpen: (item: GooSearchItem) => void
  onClose?: () => void
  linkResults?: boolean
  linkAs?: React.ElementType
  placeholder?: string
  initialQuery?: string
  maxResultsHeight?: number
  compact?: boolean
  label?: string
  className?: string
}

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
      [item.title, item.category, item.keywords ?? ""].some((field) =>
        field.toLowerCase().includes(needle)
      )
    )
  }, [items, trimmed])

  const groups = useMemo(() => {
    const map = new Map<string, Array<GooSearchItem & { index: number }>>()
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
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

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

          <div className="flex items-center gap-4 border-t border-ui-border px-4 py-2 text-xs text-ui-caption">
            <span className="flex items-center gap-1.5">
              <HintButton label="Previous result" onClick={() => move(-1)} disabled={!hasResults}>
                <ArrowUp className="size-3" aria-hidden />
              </HintButton>
              <HintButton label="Next result" onClick={() => move(1)} disabled={!hasResults}>
                <ArrowDown className="size-3" aria-hidden />
              </HintButton>
              to navigate
            </span>
            <span className="flex items-center gap-1.5">
              <HintButton label="Open result" onClick={() => open(results[activeIndex])} disabled={!hasResults}>
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
        </div>

        <motion.div
          style={{ height: resultsHeight, marginTop: blobGap }}
          className="overflow-y-auto overscroll-contain [scrollbar-width:none]"
          data-lenis-prevent
        >
          <div ref={resultsContentRef} id={listId} role="listbox" aria-label="Results" className="p-2">
            {trimmed && !hasResults && (
              <p className="px-3 py-6 text-center text-sm text-ui-caption">
                No results for “<span className="text-ui-heading">{trimmed}</span>”
              </p>
            )}

            {groups.map(([category, group]) => (
              <div key={category} className="mb-1 last:mb-0">
                <p className="px-2.5 pt-1.5 pb-1 text-xs tracking-wide text-ui-caption capitalize">{category}</p>
                {group.map((item) => {
                  const isActive = item.index === activeIndex
                  const ItemIcon = item.external ? ArrowUpRight : FileText
                  const content = (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId={`${filterId}-active`}
                          transition={{ type: "spring", stiffness: 500, damping: 38 }}
                          className="absolute inset-0 rounded-md bg-ui-muted ring-1 ring-ui-border"
                        />
                      )}
                      <ItemIcon className="relative size-4 shrink-0 text-ui-caption" aria-hidden />
                      <span className="relative flex-1 truncate text-left">
                        <Highlight text={item.title} query={trimmed} />
                      </span>
                      {isActive && <CornerDownLeft className="relative size-3.5 text-ui-caption" aria-hidden />}
                    </>
                  )
                  const key = `${item.category}-${item.title}`
                  const shared = {
                    id: `${listId}-${item.index}`,
                    role: "option" as const,
                    "aria-selected": isActive,
                    ref: (el: HTMLElement | null) => {
                      itemRefs.current[item.index] = el
                    },
                    onMouseMove: () => setActiveIndex(item.index),
                    className: cn(
                      "relative flex w-full cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-sm",
                      isActive ? "text-ui-heading" : "text-ui-secondary"
                    ),
                  }
                  if (!linkResults) {
                    return (
                      <button key={key} type="button" tabIndex={-1} onClick={() => onOpen(item)} {...shared}>
                        {content}
                      </button>
                    )
                  }
                  return item.external ? (
                    <a key={key} href={item.href} target="_blank" rel="noreferrer" onClick={onClose} {...shared}>
                      {content}
                    </a>
                  ) : (
                    <LinkComponent key={key} href={item.href} onClick={onClose} {...shared}>
                      {content}
                    </LinkComponent>
                  )
                })}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
