"use client"

import { useCallback, useEffect, useRef } from "react"
import { cn } from "@workspace/ui/lib/utils"

export type ClickSparkBurst = "lines" | "curves" | "dots" | "ring" | "stars"
export type ClickSparkTrigger = "click" | "dblclick"

type Spark = { x: number; y: number; angle: number; start: number; burst: ClickSparkBurst }

let audio: AudioContext | null = null
const buffers = new Map<string, Promise<AudioBuffer>>()

function loadSound(ctx: AudioContext, url: string) {
  let buffer = buffers.get(url)
  if (!buffer) {
    buffer = fetch(url)
      .then((res) => res.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
    buffers.set(url, buffer)
  }
  return buffer
}

/** `true` plays a short synthesised pop; a string plays that audio file. */
async function playSound(sound: true | string, volume: number) {
  const ctx = (audio ??= new AudioContext())
  if (ctx.state === "suspended") await ctx.resume()
  const gain = ctx.createGain()
  gain.connect(ctx.destination)
  const t = ctx.currentTime

  if (typeof sound === "string") {
    const source = ctx.createBufferSource()
    source.buffer = await loadSound(ctx, sound)
    gain.gain.value = volume
    source.connect(gain)
    source.start()
    return
  }

  // A quick downward chirp with a fast decay reads as a soft "tick".
  const osc = ctx.createOscillator()
  osc.type = "triangle"
  osc.frequency.setValueAtTime(1400, t)
  osc.frequency.exponentialRampToValueAtTime(380, t + 0.07)
  gain.gain.setValueAtTime(volume, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09)
  osc.connect(gain)
  osc.start(t)
  osc.stop(t + 0.1)
}

export interface ClickSparkProps {
  /** Defaults to the wrapper's text colour, so it follows dark mode. */
  sparkColor?: string
  /** Length of each stroke at the start. */
  sparkSize?: number
  /** How far the strokes travel. */
  sparkRadius?: number
  sparkCount?: number
  /** Ms */
  duration?: number
  lineWidth?: number
  /** Shape of the burst. */
  burst?: ClickSparkBurst
  /** Fire on a single click or only on a double click. */
  trigger?: ClickSparkTrigger
  /** `true` for a built-in pop, or a URL to an audio file. Off by default. */
  sound?: boolean | string
  /** 0 to 1 */
  volume?: number
  className?: string
  children?: React.ReactNode
}

const easeOut = (t: number) => t * (2 - t)
const CURVE_STEPS = 8

export function ClickSpark({
  sparkColor,
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 400,
  lineWidth = 2,
  burst = "lines",
  trigger = "click",
  sound = false,
  volume = 0.4,
  className,
  children,
}: ClickSparkProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparks = useRef<Spark[]>([])
  const raf = useRef<number | null>(null)

  // Keep the canvas sized to the wrapper, and sharp on hi-DPI screens.
  useEffect(() => {
    const canvas = canvasRef.current!
    const wrapper = wrapperRef.current!
    const resize = () => {
      const { width, height } = wrapper.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      canvas.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(wrapper)
    resize()
    return () => ro.disconnect()
  }, [])

  const draw = useCallback(
    (now: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")!
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const color = sparkColor ?? getComputedStyle(wrapperRef.current!).color
      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.lineWidth = lineWidth
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      sparks.current = sparks.current.filter((s) => {
        const t = (now - s.start) / duration
        if (t >= 1) return false

        const p = easeOut(t)
        const distance = p * sparkRadius // moves outward
        const length = sparkSize * (1 - p) // shrinks to a dot
        const at = (d: number, angle = s.angle) => [s.x + d * Math.cos(angle), s.y + d * Math.sin(angle)] as const

        ctx.globalAlpha = 1 - t // fades out
        ctx.beginPath()

        switch (s.burst) {
          case "lines": {
            ctx.moveTo(...at(distance))
            ctx.lineTo(...at(distance + length))
            ctx.stroke()
            break
          }
          case "curves": {
            // Each stroke bends further the farther out it gets, so the burst swirls.
            const bend = (d: number) => s.angle + (d / Math.max(sparkRadius, 1)) * 0.9
            for (let i = 0; i <= CURVE_STEPS; i++) {
              const d = distance + (length * i) / CURVE_STEPS
              ctx[i ? "lineTo" : "moveTo"](...at(d, bend(d)))
            }
            ctx.stroke()
            break
          }
          case "dots": {
            const [x, y] = at(distance + length / 2)
            ctx.arc(x, y, Math.max(lineWidth * 1.2 * (1 - p * 0.6), 0.5), 0, Math.PI * 2)
            ctx.fill()
            break
          }
          case "ring": {
            ctx.lineWidth = lineWidth * (1 - p * 0.7)
            ctx.arc(s.x, s.y, distance + sparkSize * 0.5, 0, Math.PI * 2)
            ctx.stroke()
            ctx.lineWidth = lineWidth
            break
          }
          case "stars": {
            // A four-point sparkle that spins as it flies.
            const [x, y] = at(distance + length / 2)
            const outer = Math.max(sparkSize * 0.45 * (1 - p * 0.5), 0.5)
            const inner = outer * 0.35
            const spin = s.angle + p * Math.PI
            for (let i = 0; i < 8; i++) {
              const r = i % 2 ? inner : outer
              const a = spin + (Math.PI / 4) * i
              ctx[i ? "lineTo" : "moveTo"](x + r * Math.cos(a), y + r * Math.sin(a))
            }
            ctx.closePath()
            ctx.fill()
            break
          }
        }
        return true
      })
      ctx.globalAlpha = 1

      raf.current = sparks.current.length ? requestAnimationFrame(draw) : null
    },
    [sparkColor, sparkSize, sparkRadius, duration, lineWidth]
  )

  const fire = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = wrapperRef.current!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const now = performance.now()

    // A ring is one shape per click; the others spread evenly around the cursor.
    const count = burst === "ring" ? 1 : sparkCount
    for (let i = 0; i < count; i++) {
      sparks.current.push({ x, y, angle: (2 * Math.PI * i) / count, start: now, burst })
    }
    if (raf.current === null) raf.current = requestAnimationFrame(draw)
    if (sound) void playSound(sound, volume).catch(() => {})
  }

  useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    },
    []
  )

  return (
    <div
      ref={wrapperRef}
      onClick={trigger === "click" ? fire : undefined}
      onDoubleClick={trigger === "dblclick" ? fire : undefined}
      className={cn("relative h-full w-full", className)}
    >
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-50" />
      {children}
    </div>
  )
}
