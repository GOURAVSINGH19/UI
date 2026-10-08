"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@workspace/ui/lib/utils"

export interface FolderPaper {
  rotate: number
  x: number
  color: string
}

const DEFAULT_PAPERS: FolderPaper[] = [
  { rotate: -12, x: -26, color: "#f4f1ea" },
  { rotate: 2, x: 0, color: "#ffffff" },
  { rotate: 14, x: 26, color: "#eef3f7" },
]

export interface FolderProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  color?: string
  flap?: [string, string]
  papers?: FolderPaper[]
  className?: string
}

const shade = (color: string, amount: number) => `color-mix(in oklab, ${color}, black ${amount}%)`
const tint = (color: string, amount: number) => `color-mix(in oklab, ${color}, white ${amount}%)`

const spring = { type: "spring", stiffness: 300, damping: 24 } as const
// Critically damped so the flap never swings past flat and dips behind the papers.
const flapSpring = { type: "spring", stiffness: 300, damping: 35 } as const

export function Folder({
  open: controlledOpen,
  onOpenChange,
  color = "#5b8def",
  flap = ["#7aa5f7", "#6495f2"],
  papers = DEFAULT_PAPERS,
  className,
}: FolderProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen

  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <div
      className={cn("grid place-items-center", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close folder" : "Open folder"}
        className="relative h-28 w-36 cursor-pointer"
        style={{ perspective: 600 }}
      >
        {/* Contact shadow on the ground, spreading as the folder lifts. */}
        <motion.div
          aria-hidden
          className="absolute -bottom-3 left-1/2 h-4 w-[110%] -translate-x-1/2 rounded-[50%] bg-black/30 blur-md"
          animate={{ scaleX: open ? 1.08 : 0.92, opacity: open ? 0.45 : 0.6 }}
          transition={spring}
        />

        <motion.div
          className="absolute inset-0"
          style={{ perspective: 600 }}
          animate={{ y: open ? -3 : 0 }}
          transition={spring}
        >
          {/* Back panel and tab, lit from above with a darker inner well. */}
          <div
            className="absolute -top-2.5 left-0 h-5 w-14 rounded-t-lg"
            style={{
              background: `linear-gradient(to bottom, ${tint(color, 18)}, ${color})`,
              boxShadow: `inset 0 1px 0 ${tint(color, 45)}`,
            }}
          />
          <div
            className="absolute inset-0 rounded-lg rounded-tl-none"
            style={{
              background: `linear-gradient(to bottom, ${color}, ${shade(color, 18)})`,
              boxShadow: `inset 0 1px 0 ${tint(color, 35)}, inset 0 -18px 24px ${shade(color, 35)}, 0 1px 2px rgba(0,0,0,0.25)`,
            }}
          />

          {papers.map((paper, i) => (
            <motion.div
              key={i}
              className="absolute top-2 left-1/2 h-24 w-20 -translate-x-1/2 rounded-md"
              style={{
                background: `linear-gradient(160deg, ${paper.color} 55%, ${shade(paper.color, 6)})`,
                boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 6px 14px -6px rgba(0,0,0,0.35), inset 0 0 0 0.5px rgba(0,0,0,0.06)",
              }}
              animate={open ? { y: -34 - i * 4, x: paper.x, rotate: paper.rotate } : { y: 0, x: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22, delay: open ? i * 0.04 : 0 }}
            >
              <div className="mx-3 mt-4 space-y-1.5">
                <div className="h-1 w-3/4 rounded bg-black/10" />
                <div className="h-1 w-full rounded bg-black/10" />
                <div className="h-1 w-2/3 rounded bg-black/10" />
              </div>
            </motion.div>
          ))}

          {/* Shadow the front flap casts onto the papers, deepening as it swings open. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-1 bottom-[70%] h-6 rounded-t-lg"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.28), transparent)" }}
            animate={{ opacity: open ? 0.9 : 0.4 }}
            transition={spring}
          />

          {/* Front flap with a thick bottom edge, top highlight and glossy sheen. */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-[82%] origin-bottom overflow-hidden rounded-lg"
            style={{
              background: `linear-gradient(to bottom, ${flap[0]}, ${flap[1]})`,
              boxShadow: `inset 0 1px 0 ${tint(flap[0], 55)}, inset 0 -3px 0 ${shade(flap[1], 22)}, 0 -2px 6px -2px rgba(0,0,0,0.25)`,
            }}
            animate={{ rotateX: open ? -28 : 0 }}
            transition={flapSpring}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 38%, transparent 55%)" }}
            />
            <motion.div
              aria-hidden
              className="absolute inset-0 bg-black"
              animate={{ opacity: open ? 0.08 : 0 }}
              transition={spring}
            />
            <div
              aria-hidden
              className="absolute inset-x-3 top-1.5 h-px rounded-full"
              style={{ background: tint(flap[0], 60), opacity: 0.6 }}
            />
          </motion.div>
        </motion.div>
      </button>
    </div>
  )
}
