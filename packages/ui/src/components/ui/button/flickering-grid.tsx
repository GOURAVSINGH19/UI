"use client"

import { useMemo, type RefObject, useEffect, useRef, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

/** Plain canvas helpers for the flickering grid: no React here. */

export type Grid = { cols: number; rows: number; squares: Float32Array; dpr: number }

export type GridOptions = { squareSize: number; gridGap: number; maxOpacity: number; flickerChance: number }

/** Sizes the canvas for the device pixel ratio and seeds every square with a random opacity. */
export function setupGrid(canvas: HTMLCanvasElement, w: number, h: number, o: GridOptions): Grid {
  const dpr = window.devicePixelRatio || 1
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  const cols = Math.floor(w / (o.squareSize + o.gridGap))
  const rows = Math.floor(h / (o.squareSize + o.gridGap))
  const squares = new Float32Array(cols * rows)
  for (let i = 0; i < squares.length; i++) squares[i] = Math.random() * o.maxOpacity
  return { cols, rows, squares, dpr }
}

/** Re-rolls a random share of squares; `deltaTime` keeps the rate the same at any frame rate. */
export function flicker(grid: Grid, deltaTime: number, o: GridOptions) {
  for (let i = 0; i < grid.squares.length; i++) {
    if (Math.random() < o.flickerChance * deltaTime) grid.squares[i] = Math.random() * o.maxOpacity
  }
}

export function drawGrid(ctx: CanvasRenderingContext2D, grid: Grid, rgbaPrefix: string, o: GridOptions) {
  const step = (o.squareSize + o.gridGap) * grid.dpr
  const size = o.squareSize * grid.dpr
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  for (let i = 0; i < grid.cols; i++) {
    for (let j = 0; j < grid.rows; j++) {
      ctx.fillStyle = `${rgbaPrefix}${grid.squares[i * grid.rows + j]})`
      ctx.fillRect(i * step, j * step, size, size)
    }
  }
}

/** Turns a CSS colour (including var() and currentColor) into an "rgba(r, g, b," prefix for canvas. */
export function useResolvedColor(host: RefObject<HTMLElement | null>, color: string | undefined) {
  const [resolved, setResolved] = useState("rgb(0, 0, 0)")

  // Re-resolve when the theme class on <html> changes, since var() colours change with it.
  useEffect(() => {
    const update = () => setResolved(resolve(host.current, color))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [host, color])

  return useMemo(() => {
    if (typeof document === "undefined") return "rgba(0, 0, 0,"
    const ctx = document.createElement("canvas").getContext("2d")
    if (!ctx) return "rgba(0, 0, 0,"
    ctx.fillStyle = resolved
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
    return `rgba(${r}, ${g}, ${b},`
  }, [resolved])
}

function resolve(host: HTMLElement | null, value: string | undefined) {
  if (!host) return "rgb(0, 0, 0)"
  if (!value || value === "currentColor") return getComputedStyle(host).color
  if (!value.startsWith("var(")) return value
  const probe = document.createElement("span")
  probe.style.color = value
  probe.style.display = "none"
  host.appendChild(probe)
  const computed = getComputedStyle(probe).color
  probe.remove()
  return computed || "rgb(0, 0, 0)"
}

export type FlickeringGridProps = React.HTMLAttributes<HTMLDivElement> & {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  maxOpacity?: number
  /** Pause the animation without unmounting. */
  active?: boolean
}

/** A canvas of small squares that twinkle at random. Only animates while on screen and active. */
export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color,
  width,
  height,
  className,
  maxOpacity = 0.3,
  active = true,
  ...props
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const rgbaPrefix = useResolvedColor(containerRef, color)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !container || !ctx) return
    const options: GridOptions = { squareSize, gridGap, maxOpacity, flickerChance }

    let frame = 0
    let grid: Grid
    const resize = () => {
      const w = width ?? container.clientWidth
      const h = height ?? container.clientHeight
      setCanvasSize({ width: w, height: h })
      grid = setupGrid(canvas, w, h, options)
      drawGrid(ctx, grid, rgbaPrefix, options)
    }
    resize()

    let lastTime: number | null = null
    const animate = (time: number) => {
      const deltaTime = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time
      flicker(grid, deltaTime, options)
      drawGrid(ctx, grid, rgbaPrefix, options)
      frame = requestAnimationFrame(animate)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    const intersectionObserver = new IntersectionObserver(([entry]) => setIsInView(Boolean(entry?.isIntersecting)))
    intersectionObserver.observe(canvas)
    if (isInView && active) frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [squareSize, gridGap, maxOpacity, flickerChance, rgbaPrefix, width, height, isInView, active])

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)} {...props}>
      <canvas ref={canvasRef} className="pointer-events-none" style={canvasSize} />
    </div>
  )
}
