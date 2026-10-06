"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

export type FlickeringGridProps = React.HTMLAttributes<HTMLDivElement> & {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  maxOpacity?: number
  active?: boolean
}

type Grid = { cols: number; rows: number; squares: Float32Array; dpr: number }

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
  const [resolvedColor, setResolvedColor] = useState("rgb(0, 0, 0)")

  const resolveColor = useCallback((value: string | undefined) => {
    const host = containerRef.current
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
  }, [])

  useEffect(() => {
    const update = () => setResolvedColor(resolveColor(color))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [color, resolveColor])

  const rgbaPrefix = useMemo(() => {
    if (typeof document === "undefined") return "rgba(0, 0, 0,"
    const ctx = document.createElement("canvas").getContext("2d")
    if (!ctx) return "rgba(0, 0, 0,"
    ctx.fillStyle = resolvedColor
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
    return `rgba(${r}, ${g}, ${b},`
  }, [resolvedColor])

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number): Grid => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      const cols = Math.floor(w / (squareSize + gridGap))
      const rows = Math.floor(h / (squareSize + gridGap))
      const squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) squares[i] = Math.random() * maxOpacity
      return { cols, rows, squares, dpr }
    },
    [squareSize, gridGap, maxOpacity]
  )

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) squares[i] = Math.random() * maxOpacity
      }
    },
    [flickerChance, maxOpacity]
  )

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D, grid: Grid, w: number, h: number) => {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < grid.cols; i++) {
        for (let j = 0; j < grid.rows; j++) {
          ctx.fillStyle = `${rgbaPrefix}${grid.squares[i * grid.rows + j]})`
          ctx.fillRect(
            i * (squareSize + gridGap) * grid.dpr,
            j * (squareSize + gridGap) * grid.dpr,
            squareSize * grid.dpr,
            squareSize * grid.dpr
          )
        }
      }
    },
    [rgbaPrefix, squareSize, gridGap]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !container || !ctx) return

    let frame = 0
    let grid: Grid
    const resize = () => {
      const w = width ?? container.clientWidth
      const h = height ?? container.clientHeight
      setCanvasSize({ width: w, height: h })
      grid = setupCanvas(canvas, w, h)
      drawGrid(ctx, grid, canvas.width, canvas.height)
    }
    resize()

    let lastTime: number | null = null
    const animate = (time: number) => {
      const deltaTime = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time
      updateSquares(grid.squares, deltaTime)
      drawGrid(ctx, grid, canvas.width, canvas.height)
      frame = requestAnimationFrame(animate)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    const intersectionObserver = new IntersectionObserver(([entry]) => setIsInView(Boolean(entry?.isIntersecting)), {
      threshold: 0,
    })
    intersectionObserver.observe(canvas)

    if (isInView && active) frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView, active])

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)} {...props}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
    </div>
  )
}
