"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUp, Mic, Square, Camera, ChevronDown, ImagePlus, Paperclip, Plus } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { GooMenu } from "./goo-menu"
import { BLUR_IN, BLUR_SHOWN, POP_SPRING, type PromptModel } from "./types"

const enter = { variants: { hidden: BLUR_IN, shown: BLUR_SHOWN } }

function Waveform() {
  return (
    <span aria-hidden className="flex h-3.5 items-center gap-[2px]">
      {[0.5, 1, 0.7, 0.9].map((peak, index) => (
        <motion.span
          key={index}
          className="w-[2px] rounded-full bg-current"
          animate={{ height: ["30%", `${peak * 100}%`, "30%"] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: index * 0.12, ease: "easeInOut" }}
        />
      ))}
    </span>
  )
}

export function VoiceButton({ listening, onToggle }: { listening: boolean; onToggle: () => void }) {
  const reduce = useReducedMotion()
  return (
    <motion.button
      type="button"
      aria-label={listening ? "Stop voice input" : "Start voice input"}
      aria-pressed={listening}
      onClick={onToggle}
      whileTap={{ scale: 0.88 }}
      {...enter}
      transition={reduce ? { duration: 0 } : POP_SPRING}
      className={cn(
        "relative flex h-8 min-w-8 cursor-pointer items-center justify-center gap-1.5 rounded-full px-2 text-ui-caption transition-colors outline-none hover:bg-ui-muted hover:text-ui-heading focus-visible:ring-2 focus-visible:ring-ui-accent/60",
        listening && "bg-ui-accent/12 text-ui-accent hover:bg-ui-accent/15 hover:text-ui-accent"
      )}
    >
      {listening && !reduce && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full ring-2 ring-ui-accent"
          animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <Mic className="size-4" aria-hidden />
      {listening && <Waveform />}
    </motion.button>
  )
}

/** Arrow to run; morphs into a stop square while running. */
export function RunButton({ running, disabled, onClick }: { running: boolean; disabled: boolean; onClick: () => void }) {
  const reduce = useReducedMotion()
  const spring = reduce ? { duration: 0 } : POP_SPRING
  return (
    <motion.button
      type="button"
      aria-label={running ? "Stop" : "Run"}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.88 }}
      {...enter}
      transition={spring}
      className="relative flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-ui-inverse text-ui-on-inverse outline-none focus-visible:ring-2 focus-visible:ring-ui-accent/60 disabled:cursor-default disabled:bg-ui-emphasis disabled:text-ui-hint"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={running ? "stop" : "run"}
          initial={{ opacity: 0, scale: 0.4, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.4, filter: "blur(6px)" }}
          transition={spring}
          className="flex"
        >
          {running ? <Square className="size-3 fill-current" aria-hidden /> : <ArrowUp className="size-4" aria-hidden />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

export type ToolbarProps = {
  show: boolean
  models: PromptModel[]
  model: string
  onModel: (id: string) => void
  onAttach: (kind: "image" | "camera" | "file") => void
  voice?: { listening: boolean; onToggle: () => void }
  running: boolean
  canRun: boolean
  onRun: () => void
}

const ATTACH_ITEMS = [
  { id: "image", label: "Upload images", icon: <ImagePlus className="size-4" /> },
  { id: "camera", label: "Take a photo", icon: <Camera className="size-4" /> },
  { id: "file", label: "Attach a file", icon: <Paperclip className="size-4" /> },
]

/** The row under the text: attach + model on the left, mic + run on the right. Items blur in one by one. */
export function Toolbar({ show, models, model, onModel, onAttach, voice, running, canRun, onRun }: ToolbarProps) {
  const reduce = useReducedMotion()
  const spring = reduce ? { duration: 0 } : POP_SPRING
  const active = models.find((entry) => entry.id === model) ?? models[0]
  const item = { variants: { hidden: BLUR_IN, shown: BLUR_SHOWN }, transition: spring }

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          key="toolbar"
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0, transition: { duration: 0.2 } }}
          transition={spring}
        >
          <motion.div
            className="flex items-center gap-1.5 px-3 pb-3"
            initial="hidden"
            animate="shown"
            exit="hidden"
            variants={{ shown: { transition: { staggerChildren: reduce ? 0 : 0.05 } } }}
          >
            <motion.div {...item}>
              <GooMenu
                label="Add attachment"
                triggerClassName="w-8"
                trigger={<Plus className="size-4" aria-hidden />}
                items={ATTACH_ITEMS}
                onSelect={(id) => onAttach(id as "image" | "camera" | "file")}
              />
            </motion.div>
            <motion.div {...item}>
              <GooMenu
                label="Choose model"
                menuWidth={208}
                triggerClassName="px-3 text-[13px]"
                trigger={
                  <>
                    {active?.label}
                    <ChevronDown className="size-3.5 text-ui-caption" aria-hidden />
                  </>
                }
                items={models.map((entry) => ({ ...entry, selected: entry.id === model }))}
                onSelect={onModel}
              />
            </motion.div>

            <div className="flex-1" />

            {voice && <VoiceButton listening={voice.listening} onToggle={voice.onToggle} />}
            <RunButton running={running} disabled={!canRun} onClick={onRun} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
