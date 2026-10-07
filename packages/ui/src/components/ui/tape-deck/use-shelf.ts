import { useCallback, useEffect, useLayoutEffect, useRef } from "react"
import { FOCUS_Z, MOBILE_WIDTH, PERSPECTIVE, RAIL, clamp, createSpring, newTapeMotion, stepSpring, type TapeMotion } from "./motion"

/**
 * The 3D shelf: one spring pair per tape plus a few for the shelf itself, stepped in a
 * rAF loop that writes transforms straight to the DOM, so motion never re-renders React.
 */
export function useShelf(count: number, reducedMotion: boolean) {
  const stageRef = useRef<HTMLElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const tapeEls = useRef<(HTMLDivElement | null)[]>([])
  const motion = useRef<TapeMotion[]>([])
  const shelf = useRef({
    offset: createSpring(0, 90, 19), // scroll position along the rail, in tapes
    drop: createSpring(0, 110, 20), // pushes the shelf down while a tape is open
    tiltX: createSpring(0, 120, 16), // parallax tilt of the open tape
    tiltY: createSpring(0, 120, 16),
  })
  const size = useRef({ width: 0, height: 0, tapeWidth: 280, tapeHeight: 178 })
  const frame = useRef(0)
  const reducedRef = useRef(reducedMotion)
  useLayoutEffect(() => {
    reducedRef.current = reducedMotion
  })

  // One spring pair per tape, ready before the render loop or listeners read them.
  useLayoutEffect(() => {
    while (motion.current.length < count) motion.current.push(newTapeMotion())
    motion.current.length = count
  }, [count])

  /* ---------- render loop: writes transforms straight to the DOM, no React re-renders ---------- */

  const renderFrame = useCallback((dt: number) => {
    const { offset, drop, tiltX, tiltY } = shelf.current
    const instant = reducedRef.current
    let moving = false
    for (const s of [offset, drop, tiltX, tiltY]) moving = stepSpring(s, dt, instant) || moving

    const { width, height, tapeWidth, tapeHeight } = size.current
    const mobile = width < MOBILE_WIDTH
    const gap = mobile ? 62 : 86

    // Where the open tape lands: centred horizontally, in the upper part of the stage.
    const depth = PERSPECTIVE / (PERSPECTIVE - FOCUS_Z)
    const centerY = mobile ? 0.3 : 0.4
    const cardWidth = Math.min(width * (mobile ? 0.82 : 0.58), 520, height * (mobile ? 0.32 : 0.46) * (tapeWidth / tapeHeight))
    const scale = cardWidth / tapeWidth / depth
    const toX = width * (0.5 - RAIL.left)
    const toY = height * (centerY - RAIL.top) + tapeHeight / 2

    if (infoRef.current) {
      infoRef.current.style.top = `${height * centerY + (tapeHeight * scale * depth) / 2 + 18}px`
    }

    motion.current.forEach((m, i) => {
      moving = stepSpring(m.focus, dt, instant) || moving
      moving = stepSpring(m.lift, dt, instant) || moving
      const el = tapeEls.current[i]
      if (!el) return

      const f = m.focus.value // 0 = on the shelf, 1 = open (can overshoot a little)
      const fc = clamp(f, 0, 1)
      const z = -(i - offset.value) * gap * (1 - fc)
      const lift =
        m.lift.value * 46 + // hover pop
        Math.sin(fc * Math.PI) * 70 - // arc up and out of the row
        drop.value * height * (mobile ? 0.16 : 0.1) * (1 - fc) // shelf sinks while something is open

      el.style.transform =
        `translate3d(0, ${-lift}px, ${z}px) ` +
        `rotateY(${-RAIL.rotateY * f}deg) rotateX(${-RAIL.rotateX * f}deg) ` +
        `translate3d(${toX * f}px, ${toY * f}px, ${FOCUS_Z * f}px) ` +
        `rotateX(${tiltX.value * fc}deg) rotateY(${tiltY.value * fc}deg) ` +
        `scale(${1 + (scale - 1) * f})`
    })

    return moving
  }, [])

  /** Starts the loop if it is asleep. It stops itself once every spring is at rest. */
  const kick = useCallback(() => {
    if (frame.current) return
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000)
      last = now
      frame.current = renderFrame(dt) ? requestAnimationFrame(tick) : 0
    }
    frame.current = requestAnimationFrame(tick)
  }, [renderFrame])

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  // Measure the stage (and a tape, which shrinks in small containers) whenever it resizes.
  useEffect(() => {
    const stage = stageRef.current!
    const observer = new ResizeObserver(() => {
      const tape = tapeEls.current[0]
      size.current = {
        width: stage.clientWidth,
        height: stage.clientHeight,
        tapeWidth: tape?.offsetWidth ?? 280,
        tapeHeight: tape?.offsetHeight ?? 178,
      }
      renderFrame(0)
      kick()
    })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [renderFrame, kick])

  const clampOffset = useCallback((v: number) => clamp(v, -1, Math.max(-1, count - 4)), [count])

  return { stageRef, infoRef, tapeEls, motion, shelf, kick, clampOffset }
}

export type Shelf = ReturnType<typeof useShelf>
