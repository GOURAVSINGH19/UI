"use client"

import { Fragment, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Check, ChevronsUpDown, CornerDownLeft, Search } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export type SimpleSearchItem = {
  title: string
  group: string
  href?: string
  description?: string
  badge?: string
  keywords?: string
}

export type SimpleSearchProps = {
  items: SimpleSearchItem[]
  onSelect: (item: SimpleSearchItem) => void
  hotkey?: string | false
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
  showFilter?: boolean
  onFilterChange?: (group: string, direction: "forward" | "back") => void
  label?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & Record<`data-${string}`, string | boolean>
  triggerClassName?: string
}

const ease = [0.22, 1, 0.36, 1] as const
const noopSubscribe = () => () => {}

function Highlight({ text, query }: { text: string; query: string }) {
  const index = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1
  if (index === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-sm bg-amber-300/50 px-0.5 text-ui-heading dark:bg-amber-300/30">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  )
}

function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd className={cn("rounded border border-ui-border bg-ui-subtle px-1 font-sans text-[10px] leading-4 text-ui-caption", className)}>
      {children}
    </kbd>
  )
}

function Badge({ label }: { label?: string }) {
  if (!label) return null
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-100 px-1.5 py-px text-[10px] leading-4 font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
      {label}
    </span>
  )
}

function RotatingPlaceholder({ words }: { words: string[] }) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce || words.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2200)
    return () => clearInterval(id)
  }, [reduce, words.length])

  if (!words.length) return null
  const word = words[index % words.length]

  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center gap-1 overflow-hidden text-base whitespace-nowrap text-ui-hint">
      Search
      <span className="relative inline-flex">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={word}
            initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={{ duration: 0.4, ease }}
            className="text-ui-caption"
          >
            {word}…
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  )
}

function FilterMenu({
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

export function SimpleSearch({
  items,
  onSelect,
  hotkey = "k",
  open: openProp,
  onOpenChange,
  showTrigger = true,
  showFilter = true,
  onFilterChange,
  label = "Search",
  inputProps,
  triggerClassName,
}: SimpleSearchProps) {
  const [innerOpen, setInnerOpen] = useState(false)
  const open = openProp ?? innerOpen
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("All")
  const [active, setActive] = useState(0)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemRefs = useRef<Array<HTMLElement | null>>([])
  const listId = useId()
  const reduceMotion = useReducedMotion()

  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false)
  const isMac = useSyncExternalStore(noopSubscribe, () => /Mac|iPhone|iPad/.test(navigator.platform), () => false)

  const onOpenChangeRef = useRef(onOpenChange)
  onOpenChangeRef.current = onOpenChange
  const isControlled = openProp !== undefined
  const setOpen = (next: boolean) => {
    if (!isControlled) setInnerOpen(next)
    onOpenChangeRef.current?.(next)
  }
  const setOpenRef = useRef(setOpen)
  setOpenRef.current = setOpen
  const openRef = useRef(open)
  openRef.current = open

  const filters = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of items) counts.set(item.group, (counts.get(item.group) ?? 0) + 1)
    return [{ name: "All", count: items.length }, ...[...counts].map(([name, count]) => ({ name, count }))]
  }, [items])

  const placeholderWords = useMemo(
    () => items.filter((item) => filter === "All" || item.group === filter).map((item) => item.title),
    [items, filter]
  )

  const q = query.trim()
  const results = useMemo(() => {
    const needle = q.toLowerCase()
    return items.filter(
      (item) =>
        (filter === "All" || item.group === filter) &&
        (!needle ||
          [item.title, item.group, item.description ?? "", item.keywords ?? ""].some((f) => f.toLowerCase().includes(needle)))
    )
  }, [items, filter, q])

  const groups = useMemo(() => {
    const map = new Map<string, Array<SimpleSearchItem & { index: number }>>()
    results.forEach((item, index) => {
      map.set(item.group, [...(map.get(item.group) ?? []), { ...item, index }])
    })
    return [...map.entries()]
  }, [results])

  const reset = () => {
    setQuery("")
    setFilter("All")
    setActive(0)
  }

  const close = () => {
    setOpen(false)
    reset()
    triggerRef.current?.focus()
  }

  const choose = (item: SimpleSearchItem | undefined) => {
    if (!item) return
    close()
    onSelect(item)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (hotkey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === hotkey.toLowerCase()) {
        e.preventDefault()
        setOpenRef.current(!openRef.current)
      } else if (e.key === "Escape" && openRef.current) {
        setOpenRef.current(false)
        reset()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [hotkey])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = overflow
    }
  }, [open])

  useEffect(() => {
    itemRefs.current[active]?.scrollIntoView({ block: "nearest" })
  }, [active])

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      if (!results.length) return
      const step = e.key === "ArrowDown" ? 1 : -1
      setActive((i) => (i + step + results.length) % results.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      choose(results[active])
    } else if (e.key === "Escape") {
      e.preventDefault()
      close()
    }
  }

  const changeFilter = (value: string) => {
    const from = filters.findIndex((f) => f.name === filter)
    const to = filters.findIndex((f) => f.name === value)
    onFilterChange?.(value, to < from ? "back" : "forward")
    setFilter(value)
    setActive(0)
    inputRef.current?.focus()
  }

  return (
    <>
      {showTrigger && (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={hotkey ? `${label} (${isMac ? "⌘" : "Ctrl"}+${hotkey.toUpperCase()})` : label}
          aria-haspopup="dialog"
          data-slot="search-trigger"
          className={cn("btn btn-secondary h-7 gap-1.5 px-2 text-ui-caption", triggerClassName)}
        >
          <Search className="size-3.5" />
          {hotkey && (
            <>
              <Kbd className="hidden sm:inline">{isMac ? "⌘" : "Ctrl"}</Kbd>
              <Kbd className="hidden sm:inline">{hotkey.toUpperCase()}</Kbd>
            </>
          )}
        </button>
      )}

      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-[100]">
            <div
              aria-hidden
              onClick={close}
              className="absolute inset-0 bg-ui-bg/40 backdrop-blur-[3px] animate-in fade-in-0 duration-150"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={label}
              className="absolute top-[18vh] left-1/2 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-xl border border-ui-border bg-ui-bg text-sm shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)] animate-in fade-in-0 zoom-in-95 duration-150"
            >
              <div className="flex items-center gap-2.5 px-3.5 py-3">
                <Search className="size-4 shrink-0 text-ui-caption" />
                <div className="relative flex min-w-0 flex-1">
                  {!query && <RotatingPlaceholder words={placeholderWords} />}
                  <input
                    ref={inputRef}
                    {...inputProps}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setActive(0)
                    }}
                    onKeyDown={onInputKey}
                    aria-label={label}
                    role="combobox"
                    aria-expanded="true"
                    aria-controls={listId}
                    aria-activedescendant={results.length ? `${listId}-${active}` : undefined}
                    autoComplete="off"
                    spellCheck={false}
                    className="relative w-0 flex-1 bg-transparent text-base text-ui-heading outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={close}
                  data-slot="search-close"
                  className="cursor-pointer rounded-md border border-ui-border px-1.5 py-0.5 text-[10px] font-medium text-ui-caption transition-colors hover:text-ui-heading"
                >
                  ESC
                </button>
              </div>

              <div
                key={filter}
                id={listId}
                role="listbox"
                aria-label="Results"
                data-lenis-prevent
                className="max-h-[min(26rem,55vh)] overflow-y-auto overscroll-contain border-t border-ui-border-subtle p-1.5"
              >
                {results.length === 0 && (
                  <p className="px-3 py-8 text-center text-ui-caption">
                    No results for “<span className="text-ui-heading">{q}</span>”
                  </p>
                )}
                {groups.map(([group, groupItems]) => (
                  <Fragment key={group}>
                    <p className="px-2.5 pt-2 pb-1 text-xs font-medium text-ui-hint">{group}</p>
                    {groupItems.map((item) => {
                      const isActive = item.index === active
                      return (
                        <motion.div
                          key={`${item.group}:${item.title}`}
                          initial={reduceMotion ? false : { opacity: 0, y: 6, filter: "blur(6px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{ duration: 0.3, ease, delay: Math.min(item.index, 10) * 0.035 }}
                          id={`${listId}-${item.index}`}
                          ref={(el) => {
                            itemRefs.current[item.index] = el
                          }}
                          role="option"
                          aria-selected={isActive}
                          data-slot="search-option"
                          onMouseMove={() => setActive(item.index)}
                          onClick={() => choose(item)}
                          className={cn("flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2", isActive && "bg-ui-muted")}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-2 font-medium text-ui-heading">
                              <span className="truncate">
                                <Highlight text={item.title} query={q} />
                              </span>
                              <Badge label={item.badge} />
                            </p>
                            {item.description && (
                              <p className="mt-0.5 truncate text-xs text-ui-caption">
                                <Highlight text={item.description} query={q} />
                              </p>
                            )}
                          </div>
                          {isActive && <CornerDownLeft className="size-3.5 shrink-0 text-ui-caption" />}
                        </motion.div>
                      )
                    })}
                  </Fragment>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-ui-border-subtle px-2.5 py-2 text-xs text-ui-caption">
                {showFilter ? <FilterMenu value={filter} options={filters} onChange={changeFilter} /> : <span />}
                <span className="hidden items-center gap-1.5 sm:flex">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd> to move
                  <Kbd className="ml-2">↵</Kbd> to open
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
