"use client"

import type { RefObject } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Brain, ChevronDown } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { SPRING, type ModelOption } from "./types"

/** A small rounded tile in the model's colour with a sparkle, unless the model brings its own icon. */
export function Glyph({ model, size = 20 }: { model: ModelOption; size?: number }) {
  if (model.icon) return <>{model.icon}</>
  const color = model.color ?? "var(--ui-accent)"
  return (
    <span
      aria-hidden
      className="relative grid shrink-0 place-items-center rounded-[6px]"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, color-mix(in oklab, ${color} 80%, white), ${color})`,
        boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.35), 0 1px 2px color-mix(in oklab, ${color} 40%, transparent)`,
      }}
    >
      <svg viewBox="0 0 16 16" width={size * 0.6} height={size * 0.6} fill="white">
        <path d="M8 1.5c.4 3.1 1.9 5.6 6.5 6.5-4.6.9-6.1 3.4-6.5 6.5-.4-3.1-1.9-5.6-6.5-6.5 4.6-.9 6.1-3.4 6.5-6.5Z" />
      </svg>
    </span>
  )
}

/** The pill button. Its label blurs over to the new model and the pill resizes to fit. */
export function ModelTrigger({
  triggerRef, current, open, thinking, fromTop, listId, label, onClick, onOpen, className,
}: {
  triggerRef: RefObject<HTMLButtonElement | null>
  current: ModelOption | undefined
  open: boolean
  thinking?: boolean
  fromTop: boolean
  listId: string
  label: string
  onClick: () => void
  onOpen: () => void
  className?: string
}) {
  const reduce = useReducedMotion()

  return (
    <motion.button
      ref={triggerRef}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={listId}
      aria-label={`${label}: ${current?.name}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return
        event.preventDefault()
        onOpen()
      }}
      whileTap={{ scale: 0.96 }}
      layout={!reduce}
      transition={SPRING}
      className={cn(
        "flex h-9 cursor-pointer items-center gap-2 rounded-full border border-ui-border bg-ui-bg pr-2.5 pl-2 text-sm font-medium text-ui-heading shadow-[0_1px_2px_rgb(0_0_0/0.04)] outline-none transition-colors hover:bg-ui-subtle focus-visible:ring-2 focus-visible:ring-ui-accent/50",
        open && "bg-ui-subtle",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={current?.id}
          className="flex items-center gap-2 whitespace-nowrap"
          initial={{ opacity: 0, y: fromTop ? -6 : 6, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: fromTop ? 6 : -6, filter: "blur(4px)" }}
          transition={reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {current && <Glyph model={current} />}
          {current?.name}
        </motion.span>
      </AnimatePresence>
      {thinking && (
        <motion.span layout="position" aria-hidden className="text-ui-accent">
          <Brain className="size-3.5" />
        </motion.span>
      )}
      <motion.span layout="position" animate={{ rotate: open ? 180 : 0 }} transition={SPRING} className="text-ui-caption">
        <ChevronDown className="size-3.5" aria-hidden />
      </motion.span>
    </motion.button>
  )
}
