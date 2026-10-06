// UI sound preference + cue helper on top of cuelume. Cuelume never persists anything, so we own the toggle.
import { play, setEnabled, setVolume, type PlayOptions, type SoundName } from "cuelume"

const STORAGE_KEY = "kinetik:sound"
const listeners = new Set<() => void>()
let enabled = true

export function initSound() {
  try {
    enabled = localStorage.getItem(STORAGE_KEY) !== "off"
  } catch {
    // Storage blocked (private mode etc.): keep the default.
  }
  setEnabled(enabled)
  setVolume(0.6)
  listeners.forEach((l) => l())
}

export const getSoundEnabled = () => enabled

export function setSoundEnabled(next: boolean) {
  enabled = next
  setEnabled(next)
  try {
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off")
  } catch { }
  listeners.forEach((l) => l())
}

export function subscribeSound(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Play a cue imperatively. Silent no-op on the server, when muted, or before the first user gesture. */
export const cue = (name: SoundName, options?: PlayOptions) => play(name, options)
