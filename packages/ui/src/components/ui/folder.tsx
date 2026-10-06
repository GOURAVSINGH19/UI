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
        <div className="absolute -top-2.5 left-0 h-5 w-14 rounded-t-lg" style={{ background: color }} />
        <div className="absolute inset-0 rounded-lg rounded-tl-none" style={{ background: color }} />
        {papers.map((paper, i) => (
          <motion.div
            key={i}
            className="absolute top-2 left-1/2 h-24 w-20 -translate-x-1/2 rounded-md shadow-sm"
            style={{ background: paper.color }}
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
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[82%] origin-bottom rounded-lg shadow-[0_-1px_0_rgba(255,255,255,0.35)_inset]"
          style={{ background: `linear-gradient(to bottom, ${flap[0]}, ${flap[1]})` }}
          animate={{ rotateX: open ? -28 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        />
      </button>
    </div>
  )
}
