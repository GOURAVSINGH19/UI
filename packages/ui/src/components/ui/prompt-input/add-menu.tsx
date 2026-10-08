"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Camera, Globe, ImageIcon, Lightbulb, Paperclip, Plus, Telescope, X } from "lucide-react"
import { useId, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { useMenu } from "./hooks"
import type { PromptTool } from "./types"

export const DEFAULT_TOOLS: PromptTool[] = [
  { id: "image", label: "Create image", icon: <ImageIcon className="size-4" />, placeholder: "Describe an image…" },
  { id: "research", label: "Deep research", icon: <Telescope className="size-4" />, placeholder: "What should I research?" },
  { id: "search", label: "Web search", icon: <Globe className="size-4" />, placeholder: "Search the web…" },
  { id: "think", label: "Think longer", icon: <Lightbulb className="size-4" />, placeholder: "Ask a hard question…" },
]

const SPRING = { type: "spring", stiffness: 520, damping: 34, mass: 0.7 } as const

type Row = { id: string; label: string; icon: React.ReactNode; selected?: boolean }

/** The + button and its menu: add files first, then the tools. */
export function AddMenu({
  tools,
  tool,
  onTool,
  onAttach,
}: {
  tools: PromptTool[]
  tool: string | null
  onTool: (id: string | null) => void
  onAttach: (kind: "file" | "camera") => void
}) {
  const menu = useMenu()
  const reduce = useReducedMotion()
  const [hover, setHover] = useState<string | null>(null)
  const highlight = `add-${useId().replace(/:/g, "")}`
  const files: Row[] = [
    { id: "file", label: "Add photos and files", icon: <Paperclip className="size-4" /> },
    { id: "camera", label: "Take a photo", icon: <Camera className="size-4" /> },
  ]
  const groups = [files, tools.map((t) => ({ ...t, selected: t.id === tool }))]
  let index = -1

  const pick = (id: string) => {
    if (id === "file" || id === "camera") onAttach(id)
    else onTool(id === tool ? null : id)
    menu.close()
  }

  return (
    <div ref={menu.rootRef} className="relative" onKeyDown={menu.open ? menu.onKeyDown : undefined}>
      <motion.button
        ref={menu.triggerRef}
        type="button"
        aria-label="Add files and tools"
        aria-haspopup="menu"
        aria-expanded={menu.open}
        onClick={menu.toggle}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "grid size-8 cursor-pointer place-items-center rounded-full text-ui-heading transition-colors outline-none hover:bg-ui-muted focus-visible:ring-2 focus-visible:ring-ui-accent/60",
          menu.open && "bg-ui-muted"
        )}
      >
        <motion.span animate={{ rotate: menu.open ? 45 : 0 }} transition={SPRING} className="grid">
          <Plus className="size-4" aria-hidden />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {menu.open && (
          <motion.div
            role="menu"
            aria-label="Add files and tools"
            onPointerLeave={() => setHover(null)}
            className="absolute top-full left-0 z-50 mt-2 w-60 origin-top-left rounded-2xl border border-ui-border bg-ui-bg p-1.5 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.25),0_4px_12px_-4px_rgb(0_0_0/0.08)]"
            initial={{ opacity: 0, scale: 0.92, y: -6, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: -4, filter: "blur(4px)", transition: { duration: 0.14 } }}
            transition={reduce ? { duration: 0 } : SPRING}
          >
            {groups.map((rows, g) => (
              <div key={g} className={cn(g > 0 && "mt-1.5 border-t border-ui-border pt-1.5")}>
                {rows.map((row) => {
                  const i = ++index
                  return (
                    <motion.button
                      key={row.id}
                      ref={(el) => {
                        menu.itemRefs.current[i] = el
                      }}
                      type="button"
                      role={g > 0 ? "menuitemradio" : "menuitem"}
                      aria-checked={g > 0 ? Boolean(row.selected) : undefined}
                      tabIndex={-1}
                      onClick={() => pick(row.id)}
                      onPointerMove={() => setHover(row.id)}
                      onFocus={() => setHover(row.id)}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={reduce ? { duration: 0 } : { delay: 0.03 + i * 0.025, duration: 0.2 }}
                      className={cn(
                        "relative flex h-9 w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 text-left text-sm text-ui-heading outline-none",
                        row.selected && "text-ui-accent"
                      )}
                    >
                      {hover === row.id && (
                        <motion.span
                          layoutId={highlight}
                          className="absolute inset-0 rounded-xl bg-ui-muted"
                          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 600, damping: 40 }}
                        />
                      )}
                      <span className={cn("relative", row.selected ? "text-ui-accent" : "text-ui-caption")}>{row.icon}</span>
                      <span className="relative flex-1">{row.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** The picked tool, shown beside +. Click it to turn the tool off. */
export function ToolChip({ tool, onClear }: { tool: PromptTool | undefined; onClear: () => void }) {
  const reduce = useReducedMotion()
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {tool && (
        <motion.button
          key={tool.id}
          type="button"
          onClick={onClear}
          aria-label={`Turn off ${tool.label}`}
          initial={{ opacity: 0, scale: 0.6, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.6, filter: "blur(6px)" }}
          transition={reduce ? { duration: 0 } : SPRING}
          className="group flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-ui-accent/12 px-2.5 text-[13px] font-medium text-ui-accent outline-none hover:bg-ui-accent/18 focus-visible:ring-2 focus-visible:ring-ui-accent/60"
        >
          <span className="grid group-hover:hidden">{tool.icon}</span>
          <X className="hidden size-4 group-hover:block" aria-hidden />
          {tool.label}
        </motion.button>
      )}
    </AnimatePresence>
  )
}
