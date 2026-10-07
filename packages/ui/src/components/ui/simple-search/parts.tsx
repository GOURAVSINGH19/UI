"use client"

import { Fragment, useEffect, useState, type RefObject } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { CornerDownLeft } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { ease, type ResultGroup, type SimpleSearchItem } from "./types"

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

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
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

/** "Search <title>…", cycling through the item titles with a blur. */
export function RotatingPlaceholder({ words }: { words: string[] }) {
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

/** Grouped results. Rows blur in one after another; the active row shows an Enter hint. */
export function SearchResults({
  groups, query, listId, active, itemRefs, onHover, onChoose,
}: {
  groups: ResultGroup[]
  query: string
  listId: string
  active: number
  itemRefs: RefObject<Array<HTMLElement | null>>
  onHover: (index: number) => void
  onChoose: (item: SimpleSearchItem) => void
}) {
  const reduceMotion = useReducedMotion()

  return (
    <>
      {groups.length === 0 && (
        <p className="px-3 py-8 text-center text-ui-caption">
          No results for “<span className="text-ui-heading">{query}</span>”
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
                onMouseMove={() => onHover(item.index)}
                onClick={() => onChoose(item)}
                className={cn("flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2", isActive && "bg-ui-muted")}
              >
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-medium text-ui-heading">
                    <span className="truncate">
                      <Highlight text={item.title} query={query} />
                    </span>
                    <Badge label={item.badge} />
                  </p>
                  {item.description && (
                    <p className="mt-0.5 truncate text-xs text-ui-caption">
                      <Highlight text={item.description} query={query} />
                    </p>
                  )}
                </div>
                {isActive && <CornerDownLeft className="size-3.5 shrink-0 text-ui-caption" />}
              </motion.div>
            )
          })}
        </Fragment>
      ))}
    </>
  )
}
