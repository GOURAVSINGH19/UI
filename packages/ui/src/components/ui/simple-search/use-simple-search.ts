import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react"
import type { ResultGroup, SimpleSearchItem, SimpleSearchProps } from "./types"

const noopSubscribe = () => () => {}

/** All of SimpleSearch's state: open/closed, query, filter, results, and the keyboard. */
export function useSimpleSearch({
  items, onSelect, hotkey = "k", open: openProp, onOpenChange, onFilterChange,
}: Pick<SimpleSearchProps, "items" | "onSelect" | "hotkey" | "open" | "onOpenChange" | "onFilterChange">) {
  const [innerOpen, setInnerOpen] = useState(false)
  const open = openProp ?? innerOpen
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("All")
  const [active, setActive] = useState(0)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemRefs = useRef<Array<HTMLElement | null>>([])
  const listId = useId()

  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false)
  const isMac = useSyncExternalStore(noopSubscribe, () => /Mac|iPhone|iPad/.test(navigator.platform), () => false)

  // Works controlled (open + onOpenChange) or uncontrolled. Refs keep the global hotkey listener stable.
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
    const map = new Map<string, ResultGroup[1]>()
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

  // Focus the input and lock page scroll while open.
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

  return {
    open, setOpen, query, setQuery, q, filter, filters, active, setActive, results, groups, placeholderWords,
    triggerRef, inputRef, itemRefs, listId, mounted, isMac, close, choose, onInputKey, changeFilter,
  }
}
