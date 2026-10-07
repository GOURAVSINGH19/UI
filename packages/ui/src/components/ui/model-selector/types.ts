export type ModelOption = {
  id: string
  name: string
  description?: string
  /** Shown as a small pill, e.g. "New" or "Pro". */
  badge?: string
  /** Colour of the model's glyph. */
  color?: string
  /** Replaces the default glyph. */
  icon?: React.ReactNode
  disabled?: boolean
}

export type ModelSelectorProps = {
  models: ModelOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (id: string) => void
  /** Adds an "Extended thinking" switch under the list when set. */
  thinking?: boolean
  onThinkingChange?: (on: boolean) => void
  /** Which side of the trigger the menu opens on. */
  side?: "top" | "bottom"
  align?: "start" | "end"
  label?: string
  className?: string
}

export const SPRING = { type: "spring", stiffness: 520, damping: 34, mass: 0.7 } as const
