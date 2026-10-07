"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ImagePlus, Paperclip, X } from "lucide-react"
import { useCallback, useEffect, useState, useRef } from "react"
import { type Attachment, BLUR_IN, BLUR_SHOWN, POP_SPRING, RADIUS } from "./types"

/** Files added to the prompt, with object URLs for image previews that are freed on removal. */
export function useAttachments(onChange?: () => void) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const latest = useRef(attachments)
  latest.current = attachments

  useEffect(() => () => latest.current.forEach((item) => item.url && URL.revokeObjectURL(item.url)), [])

  const add = useCallback(
    (files: FileList | File[] | null) => {
      if (!files?.length) return
      const next = [...files].map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        url: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      }))
      setAttachments((current) => [...current, ...next])
      onChange?.()
    },
    [onChange]
  )

  const remove = (id: string) => {
    setAttachments((current) => {
      const item = current.find((entry) => entry.id === id)
      if (item?.url) URL.revokeObjectURL(item.url)
      return current.filter((entry) => entry.id !== id)
    })
    onChange?.()
  }

  /** Hands the files over and empties the list. */
  const take = () => {
    const files = latest.current.map((item) => item.file)
    latest.current.forEach((item) => item.url && URL.revokeObjectURL(item.url))
    setAttachments([])
    return files
  }

  return { attachments, add, remove, take }
}

export type PickerKind = "image" | "camera" | "file"

/** Hidden file inputs for the attach menu. Returns `open(kind)` and the inputs to render. */
export function useFilePickers(onFiles: (files: FileList | null) => void) {
  const refs = {
    image: useRef<HTMLInputElement>(null),
    camera: useRef<HTMLInputElement>(null),
    file: useRef<HTMLInputElement>(null),
  }

  const inputs = (["image", "camera", "file"] as const).map((kind) => (
    <input
      key={kind}
      ref={refs[kind]}
      type="file"
      hidden
      multiple={kind !== "camera"}
      accept={kind === "file" ? undefined : "image/*"}
      capture={kind === "camera" ? "environment" : undefined}
      onChange={(event) => {
        onFiles(event.target.files)
        event.target.value = ""
      }}
    />
  ))

  return { open: (kind: PickerKind) => refs[kind].current?.click(), inputs }
}

/** Thumbnails of attached files above the text. Each one blurs in and can be removed. */
export function AttachmentStrip({ items, onRemove }: { items: Attachment[]; onRemove: (id: string) => void }) {
  const reduce = useReducedMotion()
  const spring = reduce ? { duration: 0 } : POP_SPRING

  return (
    <AnimatePresence initial={false}>
      {items.length > 0 && (
        <motion.div
          key="attachments"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={spring}
          className="overflow-hidden"
        >
          <ul className="flex flex-wrap gap-2 px-4 pt-3.5" aria-label="Attachments">
            <AnimatePresence initial={false} mode="popLayout">
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={BLUR_IN}
                  animate={BLUR_SHOWN}
                  exit={BLUR_IN}
                  transition={spring}
                  className="group relative"
                >
                  {item.url ? (
                    <img src={item.url} alt={item.file.name} className="size-14 rounded-xl object-cover ring-1 ring-ui-border" />
                  ) : (
                    <span className="flex h-14 max-w-40 items-center gap-2 rounded-xl bg-ui-muted px-3 text-xs text-ui-heading ring-1 ring-ui-border">
                      <Paperclip className="size-3.5 shrink-0 text-ui-caption" aria-hidden />
                      <span className="truncate">{item.file.name}</span>
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={`Remove ${item.file.name}`}
                    onClick={() => onRemove(item.id)}
                    className="absolute -top-1.5 -right-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full bg-ui-inverse text-ui-on-inverse opacity-0 shadow transition-[opacity,scale] group-hover:opacity-100 focus-visible:opacity-100 active:scale-90"
                  >
                    <X className="size-3" aria-hidden />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Frosted overlay while files are dragged over the input. */
export function DropOverlay({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 bg-ui-bg/70 text-sm text-ui-heading"
          style={{ borderRadius: RADIUS }}
        >
          <ImagePlus className="size-4 text-ui-accent" aria-hidden /> Drop to attach
        </motion.div>
      )}
    </AnimatePresence>
  )
}
