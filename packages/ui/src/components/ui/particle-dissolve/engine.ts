import type { Snapshot } from "./snapshot"
import type { DissolveConfig, DissolveFrom } from "./types"

/**
 * One full-viewport canvas shared by every dissolve on the page.
 * Particles live in typed arrays (no object per particle), dead ones are swap-removed,
 * and the rAF loop only runs while there is dust in the air.
 */

const FIELDS = ["x", "y", "vx", "vy", "age", "life", "size", "seed"] as const
type Field = (typeof FIELDS)[number]

/** 0 → breaks first, 1 → breaks last. */
function progress(from: DissolveFrom, px: number, py: number, w: number, h: number) {
  if (from === "left") return px / w
  if (from === "right") return 1 - px / w
  if (from === "top") return py / h
  if (from === "bottom") return 1 - py / h
  return Math.min(1, Math.hypot(px / w - 0.5, py / h - 0.5) * 1.42)
}

class ParticleEngine {
  private canvas = document.createElement("canvas")
  private ctx = this.canvas.getContext("2d")!
  private dpr = 1
  private count = 0
  private cap = 0
  private f = {} as Record<Field, Float32Array>
  private color = new Uint16Array(0)
  private palette: string[] = []
  private paletteIndex = new Map<number, number>()
  private wind = new Float32Array(0)
  private frame = 0
  private last = 0

  constructor() {
    // The bitmap is sized in device pixels (resize), so the CSS size must be pinned to the viewport,
    // or a canvas shows at its bitmap size and the dust lands 2× off on retina screens.
    Object.assign(this.canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "2147483646",
    })
    this.canvas.setAttribute("aria-hidden", "true")
    document.body.appendChild(this.canvas)
    this.resize()
    window.addEventListener("resize", this.resize)
  }

  private resize = () => {
    this.dpr = Math.min(2, window.devicePixelRatio || 1)
    this.canvas.width = Math.ceil(innerWidth * this.dpr)
    this.canvas.height = Math.ceil(innerHeight * this.dpr)
  }

  private grow(min: number) {
    const cap = Math.max(min, this.cap * 2, 4096)
    for (const key of FIELDS) {
      const next = new Float32Array(cap)
      if (this.f[key]) next.set(this.f[key].subarray(0, this.count))
      this.f[key] = next
    }
    const color = new Uint16Array(cap)
    color.set(this.color.subarray(0, this.count))
    this.color = color
    const wind = new Float32Array(cap * 3)
    wind.set(this.wind.subarray(0, this.count * 3))
    this.wind = wind
    this.cap = cap
  }

  /** Colours are quantised to 5 bits per channel so the palette (and fillStyle swaps) stays small. */
  private colorOf(r: number, g: number, b: number) {
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3)
    let index = this.paletteIndex.get(key)
    if (index === undefined) {
      index = this.palette.push(`rgb(${r & 248},${g & 248},${b & 248})`) - 1
      this.paletteIndex.set(key, index)
    }
    return index
  }

  /** Turns a snapshot into particles. Returns how long until the last one is gone (ms). */
  spawn(s: Snapshot, c: DissolveConfig) {
    const step = Math.max(c.particleSize, Math.ceil(Math.sqrt((s.width * s.height) / c.maxParticles)))
    const needed = Math.ceil(s.width / step) * Math.ceil(s.height / step)
    if (this.count + needed > this.cap) this.grow(this.count + needed)
    const { x, y, vx, vy, age, life, size, seed } = this.f

    for (let py = 0; py < s.height; py += step) {
      for (let px = 0; px < s.width; px += step) {
        const p = (py * s.width + px) * 4
        if (s.data[p + 3]! < 40) continue
        const i = this.count++
        x[i] = s.left + px
        y[i] = s.top + py
        vx[i] = vy[i] = 0
        age[i] = -(progress(c.from, px, py, s.width, s.height) * c.sweep + Math.random() * 140)
        life[i] = c.lifetime * (0.75 + Math.random() * 0.6)
        size[i] = step * (0.7 + Math.random() * 0.6)
        seed[i] = Math.random() * Math.PI * 2
        this.color[i] = this.colorOf(s.data[p]!, s.data[p + 1]!, s.data[p + 2]!)
        this.wind[i * 3] = c.wind[0]
        this.wind[i * 3 + 1] = c.wind[1]
        this.wind[i * 3 + 2] = c.turbulence
      }
    }
    if (!this.frame) {
      this.last = performance.now()
      this.frame = requestAnimationFrame(this.tick)
    }
    return c.sweep + 140 + c.lifetime * 1.35
  }

  private remove(i: number) {
    const last = --this.count
    for (const key of FIELDS) this.f[key][i] = this.f[key][last]!
    this.color[i] = this.color[last]!
    this.wind.copyWithin(i * 3, last * 3, last * 3 + 3)
  }

  private tick = (now: number) => {
    const dt = Math.min(34, now - this.last)
    this.last = now
    const k = dt / 16.67
    const { ctx } = this
    const { x, y, vx, vy, age, life, size, seed } = this.f
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, innerWidth, innerHeight)

    let style = -1
    for (let i = this.count - 1; i >= 0; i--) {
      age[i]! += dt
      let alpha = 1
      let side = size[i]!
      if (age[i]! > 0) {
        const t = age[i]! / life[i]!
        if (t >= 1) {
          this.remove(i)
          continue
        }
        const turb = this.wind[i * 3 + 2]!
        vx[i]! += (this.wind[i * 3]! + Math.sin(seed[i]! + age[i]! * 0.0045) * turb) * k
        vy[i]! += (this.wind[i * 3 + 1]! + Math.cos(seed[i]! * 1.3 + age[i]! * 0.004) * turb) * k
        x[i]! += vx[i]! * k
        y[i]! += vy[i]! * k
        alpha = (1 - t) * (1 - t)
        side *= 1 - t * 0.5
      }
      if (this.color[i] !== style) {
        style = this.color[i]!
        ctx.fillStyle = this.palette[style]!
      }
      ctx.globalAlpha = alpha
      ctx.fillRect(x[i]!, y[i]!, side, side)
    }
    ctx.globalAlpha = 1
    this.frame = this.count ? requestAnimationFrame(this.tick) : 0
    if (!this.count) ctx.clearRect(0, 0, innerWidth, innerHeight)
  }
}

let engine: ParticleEngine | null = null

/** The page's single particle engine, created on first use. */
export function getEngine() {
  engine ??= new ParticleEngine()
  return engine
}

