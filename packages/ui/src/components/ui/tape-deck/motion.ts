import { useSyncExternalStore } from "react"

/* Springs: every movement is one of these, stepped in a single rAF loop. */

export type Spring = { value: number; target: number; velocity: number; stiffness: number; damping: number }

export const createSpring = (value = 0, stiffness = 170, damping = 24): Spring => ({
  value,
  target: value,
  velocity: 0,
  stiffness,
  damping,
})

/** Moves a spring forward by `dt` seconds. Returns true while it is still moving. */
export function stepSpring(s: Spring, dt: number, instant = false) {
  if (instant) {
    s.value = s.target
    s.velocity = 0
    return false
  }
  const force = s.stiffness * (s.target - s.value) - s.damping * s.velocity
  s.velocity += force * dt
  s.value += s.velocity * dt
  const atRest = Math.abs(s.target - s.value) < 1e-4 && Math.abs(s.velocity) < 1e-4
  if (atRest) {
    s.value = s.target
    s.velocity = 0
  }
  return !atRest
}

// The shelf is one tilted "rail". The open tape undoes exactly this tilt, so it lands facing the camera.
export const RAIL = { rotateX: -20, rotateY: -40, left: 0.26, top: 0.84 }
export const PERSPECTIVE = 1400
export const FOCUS_Z = 140 // how far the open tape comes toward the viewer (px)
export const MOBILE_WIDTH = 760

export type TapeMotion = { focus: Spring; lift: Spring }
export const newTapeMotion = (): TapeMotion => ({ focus: createSpring(0, 130, 22), lift: createSpring(0, 260, 22) })

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)"
const subscribeReduced = (onChange: () => void) => {
  const media = window.matchMedia(REDUCED_QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}
export const useReducedMotion = () =>
  useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED_QUERY).matches, () => false)

export const pad = (n: number) => String(n).padStart(2, "0")
export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
