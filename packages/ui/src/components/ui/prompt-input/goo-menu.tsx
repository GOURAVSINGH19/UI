"use client"

import { useReducedMotion, AnimatePresence, motion } from "framer-motion"
import { Check } from "lucide-react"
import { useId, type RefObject, useLayoutEffect, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { useMenu } from "./hooks"

export const ITEM_HEIGHT = 34
export const ITEM_GAP = 6

const DRIP_SPRING = { type: "spring", stiffness: 260, damping: 18, mass: 0.7 } as const

/**
 * The liquid layer behind a GooMenu: one blob for the trigger and one per item,
 * merged by an SVG goo filter so the items look like they drip out of the button.
 */
export function GooBlobs({
  open,
  count,
  trigger,
  menuWidth,
}: {
  open: boolean
  count: number
  trigger: { width: number; height: number }
  menuWidth: number
}) {
  const reduce = useReducedMotion()
  const filterId = `goo-${useId().replace(/:/g, "")}`
  const slot = (index: number) => trigger.height + ITEM_GAP + index * (ITEM_HEIGHT + ITEM_GAP)

  return (
    <>
      <svg aria-hidden className="absolute size-0">
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0"
        style={{ filter: `url(#${filterId}) drop-shadow(0 4px 10px rgb(0 0 0 / 0.12))` }}
      >
        <div className="absolute top-0 left-0 rounded-full bg-ui-muted" style={trigger} />
        {Array.from({ length: count }, (_, index) => (
          <motion.div
            key={index}
            className="absolute top-0 left-0 rounded-full bg-ui-muted"
            initial={false}
            animate={{
              y: open ? slot(index) : 0,
              width: open ? menuWidth : trigger.width,
              height: open ? ITEM_HEIGHT : trigger.height,
              scale: open ? 1 : 0.5,
            }}
            transition={
              reduce
                ? { duration: 0 }
                : { ...DRIP_SPRING, delay: open ? index * 0.045 : (count - index) * 0.025 }
            }
          />
        ))}
      </div>
    </>
  )
}

export type GooMenuItem = { id: string; label: string; icon?: React.ReactNode; hint?: string; selected?: boolean }

/** The clickable rows, laid exactly over the liquid blobs. */
export function GooMenuItems({
  label,
  items,
  top,
  width,
  itemRefs,
  onPick,
}: {
  label: string
  items: GooMenuItem[]
  top: number
  width: number
  itemRefs: RefObject<Array<HTMLButtonElement | null>>
  onPick: (id: string) => void
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      role="menu"
      aria-label={label}
      className="absolute left-0 z-10"
      style={{ top, width }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
    >
      {items.map((item, index) => (
        <motion.button
          key={item.id}
          ref={(el) => {
            itemRefs.current[index] = el
          }}
          type="button"
          role="menuitem"
          tabIndex={-1}
          initial={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: reduce ? 0 : 0.08 + index * 0.045, duration: 0.25 }}
          onClick={() => onPick(item.id)}
          className="group flex w-full cursor-pointer items-center gap-2.5 rounded-full px-3.5 text-left text-sm text-ui-heading outline-none"
          style={{ height: ITEM_HEIGHT, marginBottom: ITEM_GAP }}
        >
          {item.icon && (
            <span className="text-ui-caption group-hover:text-ui-heading group-focus-visible:text-ui-heading">{item.icon}</span>
          )}
          <span className="flex-1 truncate decoration-ui-border-strong underline-offset-4 group-hover:underline group-focus-visible:underline">
            {item.label}
          </span>
          {item.hint && <span className="text-xs text-ui-hint">{item.hint}</span>}
          {item.selected && <Check className="size-3.5 text-ui-accent" aria-hidden />}
        </motion.button>
      ))}
    </motion.div>
  )
}


/** A menu whose items drip out of the trigger as liquid. */
export function GooMenu({
  label,
  trigger,
  items,
  onSelect,
  menuWidth = 184,
  triggerClassName,
}: {
  label: string
  trigger: React.ReactNode
  items: GooMenuItem[]
  onSelect: (id: string) => void
  menuWidth?: number
  triggerClassName?: string
}) {
  const menu = useMenu()
  const [size, setSize] = useState({ width: 32, height: 32 })

  // The blobs size themselves from the trigger, so measure it.
  useLayoutEffect(() => {
    const el = menu.triggerRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setSize({ width: el.offsetWidth, height: el.offsetHeight }))
    observer.observe(el)
    return () => observer.disconnect()
  }, [menu.triggerRef])

  return (
    <div ref={menu.rootRef} className="relative" onKeyDown={menu.open ? menu.onKeyDown : undefined}>
      <GooBlobs open={menu.open} count={items.length} trigger={size} menuWidth={menuWidth} />

      <motion.button
        ref={menu.triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={menu.open}
        whileTap={{ scale: 0.9 }}
        onClick={menu.toggle}
        className={cn(
          "relative flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-full text-sm text-ui-heading outline-none focus-visible:ring-2 focus-visible:ring-ui-accent/60",
          triggerClassName
        )}
      >
        {trigger}
      </motion.button>

      <AnimatePresence>
        {menu.open && (
          <GooMenuItems
            label={label}
            items={items}
            top={size.height + ITEM_GAP}
            width={menuWidth}
            itemRefs={menu.itemRefs}
            onPick={(id) => {
              onSelect(id)
              menu.close()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
