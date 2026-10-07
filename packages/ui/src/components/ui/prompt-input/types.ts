export type PromptModel = { id: string; label: string; hint?: string }

export type PromptSubmitContext = {
  attachments: File[]
  model: string
  signal: AbortSignal
}

export type PromptInputProps = {
  /** Runs on Enter or the run button. Return a promise to show the stop button until it settles. */
  onSubmit?: (value: string, context: PromptSubmitContext) => void | Promise<void>
  /** Runs when the user presses stop. The submit `signal` is aborted as well. */
  onStop?: () => void
  placeholder?: string
  models?: PromptModel[]
  defaultModel?: string
  /** Beam colours, from border-beam. */
  beam?: "colorful" | "mono" | "ocean" | "sunset" | "forest" | "candy" | "ice" | "gold"
  /** Light or dark beam. Defaults to following a `.dark` class on <html>. */
  theme?: "light" | "dark"
  collapsedWidth?: number
  expandedWidth?: number
  /** Use the browser's speech recognition for the mic button when it exists. */
  speech?: boolean
  label?: string
  className?: string
}

export type Attachment = { id: string; file: File; url?: string }

export const DEFAULT_MODELS: PromptModel[] = [
  { id: "kinetik-1.5", label: "Kinetik 1.5", hint: "Balanced" },
  { id: "kinetik-fast", label: "Kinetik Fast", hint: "Quick answers" },
  { id: "kinetik-pro", label: "Kinetik Pro", hint: "Deep reasoning" },
]

export const RADIUS = 24
export const WIDTH_SPRING = { type: "spring", stiffness: 260, damping: 26, mass: 0.9 } as const
export const POP_SPRING = { type: "spring", stiffness: 420, damping: 24 } as const
export const BLUR_IN = { opacity: 0, filter: "blur(8px)", scale: 0.6 }
export const BLUR_SHOWN = { opacity: 1, filter: "blur(0px)", scale: 1 }
