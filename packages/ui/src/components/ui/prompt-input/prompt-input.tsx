"use client"

import { BorderBeam } from "border-beam"
import { motion, useReducedMotion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { type RefObject, useRef, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { AttachmentStrip, DropOverlay, useFilePickers, useAttachments } from "./attachments"
import { useAutoHeight, useDarkClass, useRun, useVoice } from "./hooks"
import { DEFAULT_TOOLS } from "./add-menu"
import { Toolbar } from "./toolbar"
import { DEFAULT_MODELS, RADIUS, WIDTH_SPRING, type PromptInputProps } from "./types"

/** The text row. Enter submits, Shift+Enter breaks a line, pasted images become attachments. */
export function PromptTextarea({
  textRef,
  value,
  onChange,
  onSubmit,
  onImages,
  placeholder,
  label,
}: {
  textRef: RefObject<HTMLTextAreaElement | null>
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onImages: (files: File[]) => void
  placeholder: string
  label: string
}) {
  useAutoHeight(textRef, value)

  return (
    <div className="flex items-start gap-2.5 px-4 py-3">
      <Sparkles aria-hidden className="mt-[3px] size-4 shrink-0 text-ui-accent" />
      <textarea
        ref={textRef}
        rows={1}
        value={value}
        aria-label={label}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault()
            onSubmit()
          } else if (event.key === "Escape") {
            event.currentTarget.blur()
          }
        }}
        onPaste={(event) => {
          const images = [...event.clipboardData.files].filter((file) => file.type.startsWith("image/"))
          if (!images.length) return
          event.preventDefault()
          onImages(images)
        }}
        className="min-h-6 w-full resize-none bg-transparent text-[15px] leading-6 text-ui-heading outline-none placeholder:text-ui-hint"
      />
    </div>
  )
}

export function PromptInput({
  onSubmit, onStop, placeholder = "Ask anything…", models = DEFAULT_MODELS, defaultModel, tools = DEFAULT_TOOLS,
  beam = "colorful", theme, collapsedWidth = 300, expandedWidth = 600, speech = true, label = "Prompt", className,
}: PromptInputProps) {
  const [value, setValue] = useState("")
  const [model, setModel] = useState(defaultModel ?? models[0]?.id ?? "")
  const [tool, setTool] = useState<string | null>(null)
  const [focused, setFocused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const reduce = useReducedMotion()
  const dark = useDarkClass()

  const files = useAttachments(() => textRef.current?.focus())
  const pickers = useFilePickers(files.add)
  const run = useRun(onStop)
  const base = useRef("")
  const voice = useVoice(speech, (transcript) => setValue(base.current + transcript))

  const expanded = focused || run.running || voice.listening || value.length > 0 || files.attachments.length > 0
  const canRun = run.running || value.trim().length > 0 || files.attachments.length > 0

  const submit = () => {
    if (run.running) return run.stop()
    if (!canRun) return
    if (voice.listening) voice.stop()
    const text = value.trim()
    const attachments = files.take()
    setValue("")
    run.start((signal) => onSubmit?.(text, { attachments, model, tool, signal }))
  }

  const toggleVoice = () => {
    base.current = value ? `${value.trimEnd()} ` : ""
    voice.toggle()
    textRef.current?.focus()
  }

  // Collapse only once focus has really left; a file picker steals window focus, not ours.
  const onBlur = () =>
    setTimeout(() => {
      if (document.hasFocus() && !rootRef.current?.contains(document.activeElement)) setFocused(false)
    }, 0)

  return (
    <motion.div
      ref={rootRef}
      className={cn("relative max-w-full", className)}
      initial={false}
      animate={{ width: expanded ? expandedWidth : collapsedWidth }}
      transition={reduce ? { duration: 0 } : WIDTH_SPRING}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
      onDragOver={(e) => e.dataTransfer.types.includes("Files") && (e.preventDefault(), setDragging(true))}
      onDragLeave={(e) => !rootRef.current?.contains(e.relatedTarget as Node) && setDragging(false)}
      onDrop={(e) => (e.preventDefault(), setDragging(false), files.add(e.dataTransfer.files))}
    >
      <BorderBeam
        size="md"
        colorVariant={beam}
        theme={theme ?? (dark ? "dark" : "light")}
        active={expanded && !reduce}
        duration={run.running ? 1.1 : 2.4}
        strength={run.running ? 1 : 0.75}
        borderRadius={RADIUS}
        // Beam clips its box; let the gooey menus drip out past the edge.
        css={`[data-beam="{id}"] { overflow: visible !important; }`}
        style={{ width: "100%" }}
      >
        <div
          className="relative flex flex-col border border-ui-border bg-ui-bg shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)]"
          style={{ borderRadius: RADIUS }}
          onMouseDown={(e) => {
            if ((e.target as HTMLElement).closest("button, textarea, input, a")) return
            e.preventDefault()
            textRef.current?.focus()
          }}
        >
          <AttachmentStrip items={files.attachments} onRemove={files.remove} />
          <PromptTextarea
            textRef={textRef}
            value={value}
            onChange={setValue}
            onSubmit={submit}
            onImages={files.add}
            placeholder={voice.listening ? "Listening…" : run.running ? "Thinking…" : (tools.find((t) => t.id === tool)?.placeholder ?? placeholder)}
            label={label}
          />
          <Toolbar
            show={expanded}
            models={models}
            model={model}
            onModel={setModel}
            tools={tools}
            tool={tool}
            onTool={(id) => {
              setTool(id)
              textRef.current?.focus()
            }}
            onAttach={pickers.open}
            voice={voice.supported ? { listening: voice.listening, onToggle: toggleVoice } : undefined}
            running={run.running}
            canRun={canRun}
            onRun={submit}
          />
          <DropOverlay show={dragging} />
        </div>
      </BorderBeam>

      <span role="status" className="sr-only">{run.running ? "Running" : voice.listening ? "Listening" : ""}</span>
      {pickers.inputs}
    </motion.div>
  )
}
