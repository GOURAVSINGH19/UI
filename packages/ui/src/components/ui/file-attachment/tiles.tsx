"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Check, RotateCw, X } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { type Attachment, EXT_COLORS, type Handlers, ProgressRing, extensionOf, formatBytes, swap, useJustDone } from "./progress-ring"

/* ------------------------------------------------------------------ */
/* Image tile                                                          */
/* ------------------------------------------------------------------ */

export function ImageTile({ file, onCancel, onRemove, onRetry }: { file: Attachment } & Handlers) {
  const reduce = useReducedMotion()
  const justDone = useJustDone(file.status)
  const uploading = file.status === "uploading"
  const failed = file.status === "error"
  const blur = uploading ? 6 * (1 - (file.progress ?? 0)) + 2 : 0

  return (
    <div className="group relative size-16">
      <div className="relative size-full overflow-hidden rounded-xl bg-ui-muted ring-1 ring-ui-border">
        <motion.img
          src={file.url}
          alt={file.name}
          className="size-full object-cover"
          initial={false}
          animate={{ filter: `blur(${blur}px) saturate(${failed ? 0.2 : 1})`, scale: uploading ? 1.08 : 1 }}
          transition={{ duration: 0.4 }}
        />
        <motion.div
          className={cn("absolute inset-0", failed ? "bg-red-500/35" : "bg-black/35")}
          initial={false}
          animate={{ opacity: uploading || failed || justDone ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 grid place-items-center text-white">
          <AnimatePresence mode="popLayout" initial={false}>
            {uploading && (
              <motion.button
                key="ring" {...swap(reduce)}
                type="button"
                aria-label={`Cancel upload of ${file.name}`}
                onClick={() => onCancel?.(file.id)}
                className="relative grid size-8 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <ProgressRing progress={file.progress} size={32} stroke={2.5} />
                <X className="absolute size-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                {file.progress !== undefined && (
                  <span className="absolute text-[9px] font-semibold tabular-nums group-hover:opacity-0">
                    {Math.round(file.progress * 100)}
                  </span>
                )}
              </motion.button>
            )}
            {justDone && (
              <motion.span key="done" {...swap(reduce)} className="grid size-7 place-items-center rounded-full bg-white text-emerald-600">
                <Check className="size-4" strokeWidth={3} aria-hidden />
              </motion.span>
            )}
            {failed && (
              <motion.button
                key="retry" {...swap(reduce)}
                type="button"
                aria-label={`Retry upload of ${file.name}`}
                onClick={() => onRetry?.(file.id)}
                whileTap={{ scale: 0.85 }}
                className="grid size-7 cursor-pointer place-items-center rounded-full bg-white text-red-600 outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <RotateCw className="size-3.5" strokeWidth={2.5} aria-hidden />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      {!uploading && onRemove && <RemoveButton name={file.name} onClick={() => onRemove(file.id)} />}
    </div>
  )
}

function RemoveButton({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={`Remove ${name}`}
      onClick={onClick}
      className="absolute -top-1.5 -right-1.5 grid size-5 cursor-pointer place-items-center rounded-full border border-ui-bg bg-ui-inverse text-ui-on-inverse opacity-0 shadow-sm transition-[opacity,scale] duration-150 group-hover:opacity-100 focus-visible:opacity-100 active:scale-85"
    >
      <X className="size-3" strokeWidth={2.5} aria-hidden />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* File chip                                                           */
/* ------------------------------------------------------------------ */

export function FileChip({ file, onCancel, onRemove, onRetry }: { file: Attachment } & Handlers) {
  const reduce = useReducedMotion()
  const justDone = useJustDone(file.status)
  const ext = extensionOf(file.name)
  const color = EXT_COLORS[ext] ?? "#71717a"
  const uploading = file.status === "uploading"
  const failed = file.status === "error"
  const loaded = file.progress !== undefined ? file.size * file.progress : undefined

  const meta = failed
    ? "Upload failed"
    : uploading
      ? loaded !== undefined
        ? `${formatBytes(loaded)} of ${formatBytes(file.size)}`
        : "Uploading…"
      : formatBytes(file.size)

  return (
    <div
      className={cn(
        "group relative flex w-60 items-center gap-3 rounded-xl border bg-ui-bg p-2 pr-2.5 transition-colors",
        failed ? "border-red-500/40" : "border-ui-border"
      )}
    >
      <span
        aria-hidden
        className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg text-[10px] font-bold tracking-wide text-white uppercase"
        style={{ background: `linear-gradient(160deg, color-mix(in oklab, ${color} 75%, white), ${color})` }}
      >
        <span className="absolute top-0 right-0 size-2.5 rounded-bl-[4px] bg-white/35" />
        {ext.slice(0, 4) || "file"}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ui-heading">{file.name}</span>
        <span className="relative block h-4 overflow-hidden text-xs">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={failed ? "f" : uploading ? "u" : "d"}
              className={cn("block tabular-nums", failed ? "text-red-500" : "text-ui-caption")}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.22 }}
            >
              {meta}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>

      <span className="relative grid size-7 shrink-0 place-items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          {uploading && (
            <motion.button
              key="ring" {...swap(reduce)}
              type="button"
              aria-label={`Cancel upload of ${file.name}`}
              onClick={() => onCancel?.(file.id)}
              className="relative grid size-7 cursor-pointer place-items-center rounded-full text-ui-accent outline-none focus-visible:ring-2 focus-visible:ring-ui-accent/50"
            >
              <ProgressRing progress={file.progress} size={28} />
              <X className="absolute size-3 text-ui-caption transition-colors group-hover:text-ui-heading" aria-hidden />
            </motion.button>
          )}
          {justDone && (
            <motion.span key="done" {...swap(reduce)} className="grid size-6 place-items-center rounded-full bg-emerald-500 text-white">
              <Check className="size-3.5" strokeWidth={3} aria-hidden />
            </motion.span>
          )}
          {failed && (
            <motion.button
              key="retry" {...swap(reduce)}
              type="button"
              aria-label={`Retry upload of ${file.name}`}
              onClick={() => onRetry?.(file.id)}
              whileTap={{ scale: 0.85 }}
              className="grid size-7 cursor-pointer place-items-center rounded-full text-red-500 transition-colors outline-none hover:bg-red-500/10 focus-visible:ring-2 focus-visible:ring-red-500/40"
            >
              <RotateCw className="size-3.5" strokeWidth={2.5} aria-hidden />
            </motion.button>
          )}
        </AnimatePresence>
      </span>

      {!uploading && onRemove && <RemoveButton name={file.name} onClick={() => onRemove(file.id)} />}
    </div>
  )
}
