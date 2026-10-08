import type { ModelOption } from "../model-selector/types"

/** A model in the picker: the same shape Model Selector uses (name, description, badge, color). */
export type PromptModel = ModelOption

/** A mode the prompt runs in, picked from the + menu (like ChatGPT's tools). */
export type PromptTool = { id: string; label: string; icon: React.ReactNode; placeholder?: string }

export type PromptSubmitContext = {
  attachments: File[]
  model: string
  /** Id of the tool picked in the + menu, or null. */
  tool: string | null
  signal: AbortSignal
}

export type PromptInputProps = {
  /** Runs on Enter or the run button. Return a promise to show the stop button until it settles. */
  onSubmit?: (value: string, context: PromptSubmitContext) => void | Promise<void>
  /** Runs when the user presses stop. The submit `signal` is aborted as well. */
  onStop?: () => void
  placeholder?: string
  models?: PromptModel[]
  /** Tools in the + menu. Defaults to Create image, Deep research, Web search and Think longer. */
  tools?: PromptTool[]
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
  { id: "kinetik-2", name: "Kinetik 2", description: "Our smartest model for everyday work", badge: "New", color: "#7c5cff" },
  { id: "kinetik-pro", name: "Kinetik Pro", description: "Deep reasoning for complex problems", badge: "Pro", color: "#f97316" },
  { id: "kinetik-fast", name: "Kinetik Fast", description: "Quick answers, lower cost", color: "#06b6d4" },
]

export const RADIUS = 24
export const WIDTH_SPRING = { type: "spring", stiffness: 260, damping: 26, mass: 0.9 } as const
export const POP_SPRING = { type: "spring", stiffness: 420, damping: 24 } as const
export const BLUR_IN = { opacity: 0, filter: "blur(8px)", scale: 0.6 }
export const BLUR_SHOWN = { opacity: 1, filter: "blur(0px)", scale: 1 }
