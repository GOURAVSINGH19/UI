"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { cn } from "@workspace/ui/lib/utils"
import { type Attachment, type Handlers, POP } from "./progress-ring"
import { FileChip, ImageTile } from "./tiles"

/* ------------------------------------------------------------------ */

export function AttachmentPreview({ file, ...handlers }: { file: Attachment } & Handlers) {
  const isImage = Boolean(file.url) && (file.type?.startsWith("image/") ?? true)
  return isImage ? <ImageTile file={file} {...handlers} /> : <FileChip file={file} {...handlers} />
}

export function AttachmentList({
  items,
  className,
  ...handlers
}: { items: Attachment[]; className?: string } & Handlers) {
  const reduce = useReducedMotion()
  const uploading = items.filter((item) => item.status === "uploading").length
  return (
    <>
      <ul className={cn("flex flex-wrap items-center gap-2.5", className)} aria-label="Attachments">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((file) => (
            <motion.li
              key={file.id}
              layout={!reduce}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(6px)" }}
              transition={reduce ? { duration: 0 } : POP}
            >
              <AttachmentPreview file={file} {...handlers} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <span role="status" className="sr-only">
        {uploading ? `Uploading ${uploading} file${uploading > 1 ? "s" : ""}` : ""}
      </span>
    </>
  )
}
