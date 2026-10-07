"use client"

import type { RefObject } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, CornerDownLeft, FileText } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import type { GooSearchItem } from "./types"

export type GooGroup = [category: string, items: Array<GooSearchItem & { index: number }>]

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

/** Results grouped by category. The highlight slides between rows with a shared layout id. */
export function GooResults({
  groups, query, listId, layoutId, activeIndex, itemRefs, onHover, onOpen, onClose, linkResults, LinkComponent,
}: {
  groups: GooGroup[]
  query: string
  listId: string
  layoutId: string
  activeIndex: number
  itemRefs: RefObject<Array<HTMLElement | null>>
  onHover: (index: number) => void
  onOpen: (item: GooSearchItem) => void
  onClose?: () => void
  linkResults: boolean
  LinkComponent: React.ElementType
}) {
  return (
    <>
      {query && !groups.length && (
        <p className="px-3 py-6 text-center text-sm text-ui-caption">
          No results for “<span className="text-ui-heading">{query}</span>”
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
                    layoutId={layoutId}
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    className="absolute inset-0 rounded-md bg-ui-muted ring-1 ring-ui-border"
                  />
                )}
                <ItemIcon className="relative size-4 shrink-0 text-ui-caption" aria-hidden />
                <span className="relative flex-1 truncate text-left">
                  <Highlight text={item.title} query={query} />
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
              onMouseMove: () => onHover(item.index),
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
    </>
  )
}
