"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@workspace/ui/lib/utils"

export type AttachmentStatus = "uploading" | "done" | "error"

export type Attachment = {
  id: string
  name: string
  /** Bytes. */
  size: number
  type?: string
  /** Preview URL; images with a URL render as a thumbnail tile. */
  url?: string
  /** 0–1. Leave undefined while uploading for a spinning ring. */
  progress?: number
  status: AttachmentStatus
}

export type Handlers = {
  onCancel?: (id: string) => void
  onRemove?: (id: string) => void
  onRetry?: (id: string) => void
}

export const POP = { type: "spring", stiffness: 520, damping: 30 } as const

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const units = ["KB", "MB", "GB"]
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`
}

export const EXT_COLORS: Record<string, string> = {
  pdf: "#ef4444",
  doc: "#3b82f6",
  docx: "#3b82f6",
  txt: "#64748b",
  md: "#64748b",
  csv: "#16a34a",
  xls: "#16a34a",
  xlsx: "#16a34a",
  ppt: "#f97316",
  pptx: "#f97316",
  zip: "#d97706",
  rar: "#d97706",
  js: "#7c5cff",
  ts: "#7c5cff",
  tsx: "#7c5cff",
  json: "#7c5cff",
  mp3: "#ec4899",
  wav: "#ec4899",
  mp4: "#06b6d4",
  mov: "#06b6d4",
}

export const extensionOf = (name: string) => (name.includes(".") ? name.split(".").pop()!.toLowerCase() : "")

/* ------------------------------------------------------------------ */

export function ProgressRing({
  progress,
  size = 28,
  stroke = 2.5,
  className,
  trackClassName,
}: {
  /** 0–1, or undefined for an indeterminate spinner. */
  progress?: number
  size?: number
  stroke?: number
  className?: string
  trackClassName?: string
}) {
  const reduce = useReducedMotion()
  const r = (size - stroke) / 2
  const indeterminate = progress === undefined
  return (
    <motion.svg
      aria-hidden
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("-rotate-90", className)}
      animate={indeterminate && !reduce ? { rotate: [-90, 270] } : { rotate: -90 }}
      transition={indeterminate ? { duration: 0.9, repeat: Infinity, ease: "linear" } : { duration: 0 }}
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className={cn("stroke-current opacity-20", trackClassName)} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        className="stroke-current"
        initial={false}
        animate={{ pathLength: indeterminate ? 0.28 : Math.max(0.02, Math.min(1, progress)) }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 22 }}
      />
    </motion.svg>
  )
}

/** True for a moment after an upload finishes, to flash the check. */
export function useJustDone(status: AttachmentStatus) {
  const [justDone, setJustDone] = useState(false)
  const prev = useRef(status)
  useEffect(() => {
    if (prev.current !== "done" && status === "done") {
      setJustDone(true)
      const timer = setTimeout(() => setJustDone(false), 1100)
      prev.current = status
      return () => clearTimeout(timer)
    }
    prev.current = status
  }, [status])
  return justDone
}

export function swap(reduce: boolean | null) {
  return {
    initial: { opacity: 0, scale: 0.4, filter: "blur(4px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.4, filter: "blur(4px)" },
    transition: reduce ? { duration: 0 } : POP,
  }
}
