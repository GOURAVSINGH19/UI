/** Where the dissolve starts. The rest of the element follows in a sweep. */
export type DissolveFrom = "left" | "right" | "top" | "bottom" | "center"

export type DissolveOptions = {
  /** Edge (or centre) that breaks apart first. */
  from?: DissolveFrom
  /** Steady push on every particle, in px per frame², as [x, y]. Negative y floats up. */
  wind?: [number, number]
  /** How much each particle wobbles off the wind. */
  turbulence?: number
  /** Smallest particle edge in px. Bigger is chunkier and cheaper. */
  particleSize?: number
  /** Upper bound per element; large elements sample more coarsely to stay under it. */
  maxParticles?: number
  /** Time for the sweep to cross the element, in ms. */
  sweep?: number
  /** How long one particle lives once it lets go, in ms. */
  lifetime?: number
  /** Fold the element's space away once the dust has left. */
  collapse?: boolean
}

export type DissolveConfig = Required<DissolveOptions>

export const DEFAULTS: DissolveConfig = {
  from: "left",
  wind: [0.022, -0.014],
  turbulence: 0.012,
  particleSize: 2,
  maxParticles: 8000,
  sweep: 520,
  lifetime: 1100,
  collapse: true,
}

/** Wind presets for the common looks. */
export const WIND = {
  rise: [0.022, -0.014],
  fall: [0.006, 0.03],
  left: [-0.026, -0.006],
  right: [0.028, -0.004],
} as const satisfies Record<string, [number, number]>
