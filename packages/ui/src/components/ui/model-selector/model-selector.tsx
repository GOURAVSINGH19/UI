"use client"

import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { cn } from "@workspace/ui/lib/utils"
import { ModelRow, ThinkingSwitch } from "./model-row"
import { ModelTrigger } from "./model-trigger"
import { SPRING, type ModelOption, type ModelSelectorProps } from "./types"

/**
 * Open state and keyboard for a single-select listbox. The highlight (`active`)
 * skips disabled options; Enter or Space picks, Escape closes and refocuses the trigger.
 */
function useListbox(models: ModelOption[], selected: string | undefined, onPick: (id: string) => void) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    requestAnimationFrame(() => listRef.current?.focus())
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  const show = () => {
    setActive(Math.max(0, models.findIndex((model) => model.id === selected)))
    setOpen(true)
  }
  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }
  const choose = (model: ModelOption | undefined) => {
    if (!model || model.disabled) return
    onPick(model.id)
    close()
  }
  const step = (dir: number) => {
    if (!models.some((model) => !model.disabled)) return
    let next = active
    do next = (next + dir + models.length) % models.length
    while (models[next]?.disabled)
    setActive(next)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => step(1),
      ArrowUp: () => step(-1),
      Home: () => setActive(0),
      End: () => setActive(models.length - 1),
      Enter: () => choose(models[active]),
      " ": () => choose(models[active]),
      Escape: close,
    }
    if (!keys[event.key]) return
    event.preventDefault()
    keys[event.key]!()
  }

  const toggle = () => (open ? setOpen(false) : show())
  return { open, setOpen, active, setActive, show, toggle, choose, onKeyDown, rootRef, triggerRef, listRef }
}

export function ModelSelector({
  models, value, defaultValue, onValueChange, thinking, onThinkingChange,
  side = "bottom", align = "start", label = "Model", className, triggerClassName,
}: ModelSelectorProps) {
  const [inner, setInner] = useState(defaultValue ?? models[0]?.id)
  const selected = value ?? inner
  const list = useListbox(models, selected, (id) => {
    setInner(id)
    onValueChange?.(id)
  })
  const reduce = useReducedMotion()
  const id = useId().replace(/:/g, "")
  const current = models.find((model) => model.id === selected) ?? models[0]
  const fromTop = side === "bottom"

  return (
    <div
      ref={list.rootRef}
      className={cn("relative inline-flex", className)}
      onBlur={(event) => {
        if (list.open && !list.rootRef.current?.contains(event.relatedTarget as Node)) list.setOpen(false)
      }}
    >
      <ModelTrigger
        triggerRef={list.triggerRef}
        current={current}
        open={list.open}
        thinking={thinking}
        fromTop={fromTop}
        listId={`${id}-list`}
        label={label}
        onClick={list.toggle}
        onOpen={list.show}
        className={triggerClassName}
      />

      <AnimatePresence>
        {list.open && (
          <motion.div
            className={cn(
              "absolute z-50 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-ui-border bg-ui-bg p-1.5 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.25),0_4px_12px_-4px_rgb(0_0_0/0.08)]",
              fromTop ? "top-full mt-2" : "bottom-full mb-2",
              align === "start" ? "left-0" : "right-0"
            )}
            style={{ transformOrigin: `${fromTop ? "top" : "bottom"} ${align === "start" ? "left" : "right"}` }}
            initial={{ opacity: 0, scale: 0.92, y: fromTop ? -6 : 6, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: fromTop ? -4 : 4, filter: "blur(4px)", transition: { duration: 0.14 } }}
            transition={reduce ? { duration: 0 } : SPRING}
          >
            <div
              ref={list.listRef}
              id={`${id}-list`}
              role="listbox"
              tabIndex={-1}
              aria-label={label}
              aria-activedescendant={`${id}-${list.active}`}
              onKeyDown={list.onKeyDown}
              className="outline-none"
            >
              {models.map((model, index) => (
                <ModelRow
                  key={model.id}
                  model={model}
                  index={index}
                  optionId={`${id}-${index}`}
                  highlightId={`${id}-hover`}
                  isActive={index === list.active}
                  isSelected={model.id === selected}
                  fromTop={fromTop}
                  onHover={() => list.setActive(index)}
                  onPick={() => list.choose(model)}
                />
              ))}
            </div>
            {thinking !== undefined && onThinkingChange && <ThinkingSwitch on={thinking} onChange={onThinkingChange} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
