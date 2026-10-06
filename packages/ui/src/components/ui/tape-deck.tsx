"use client"

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react"

/* ============================================================================
 * Types
 * ========================================================================== */

export type TapeItem = {
  /** Stable, unique id (used as React key and to vary the demo beat). */
  id: string
  title: string
  artist: string
  /** Anything that fills the label: <TapeCover />, an <img>, your own JSX. */
  cover: ReactNode
  /** Optional audio file. Without it, a small generated beat plays instead. */
  src?: string
  /** Tempo of the generated beat and the reel speed. Defaults to 100. */
  bpm?: number
}

/** Pass one to `TapeDeck` to keep playback outside it, e.g. so music continues after a tape closes. */
export type TapePlayer = {
  /** Id of the tape loaded in the player, if any. */
  currentId: string | null
  playing: boolean
  play: (tape: TapeItem) => void
  toggle: () => void
}

export type TapeDeckProps = {
  tapes: TapeItem[]
  className?: string
  /** Outside player. Without one the deck plays tapes itself and stops when a tape is closed. */
  player?: TapePlayer
  /** Tape to open as soon as the deck mounts. */
  defaultSelected?: number
}

/* ============================================================================
 * Springs: every movement is one of these, stepped in a single rAF loop
 * ========================================================================== */

type Spring = { value: number; target: number; velocity: number; stiffness: number; damping: number }

const createSpring = (value = 0, stiffness = 170, damping = 24): Spring => ({
  value,
  target: value,
  velocity: 0,
  stiffness,
  damping,
})

/** Moves a spring forward by `dt` seconds. Returns true while it is still moving. */
function stepSpring(s: Spring, dt: number, instant = false) {
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

/* ============================================================================
 * Sound: a tiny Web Audio drum machine for tapes without a `src`
 * ========================================================================== */

const NOTES = [196, 220, 247, 262, 294, 330]
const LOOK_AHEAD = 0.12 // seconds of notes scheduled ahead, so timing stays steady

class BeatMachine {
  private ctx: AudioContext | null = null
  private hat: AudioBuffer | null = null
  private snare: AudioBuffer | null = null
  private timer = 0
  private step = 0
  private nextTime = 0
  private bpm = 100
  private seed = 0

  start(bpm: number, seed: number) {
    const ctx = (this.ctx ??= new AudioContext())
    void ctx.resume()
    this.hat ??= this.noise(0.04)
    this.snare ??= this.noise(0.14)
    this.bpm = bpm
    this.seed = seed
    this.step = 0
    this.nextTime = ctx.currentTime + 0.05
    window.clearInterval(this.timer)
    this.timer = window.setInterval(() => this.schedule(), 25)
  }

  stop() {
    window.clearInterval(this.timer)
  }

  dispose() {
    this.stop()
    void this.ctx?.close()
    this.ctx = null
  }

  private schedule() {
    const ctx = this.ctx!
    const sixteenth = 60 / this.bpm / 4
    while (this.nextTime < ctx.currentTime + LOOK_AHEAD) {
      this.play(this.step, this.nextTime)
      this.nextTime += sixteenth
      this.step = (this.step + 1) % 16
    }
  }

  private play(step: number, t: number) {
    if (step % 4 === 0 || (step === 10 && this.seed % 2)) this.kick(t)
    if (step % 8 === 4) this.burst(this.snare!, t, 1500, 0.32)
    if (step % 2 === 1) this.burst(this.hat!, t, 7000, 0.1)
    if (step % 4 === 2 || step === 7) this.note(t, NOTES[(step + this.seed) % NOTES.length]!)
  }

  private kick(t: number) {
    const osc = this.ctx!.createOscillator()
    osc.frequency.setValueAtTime(140, t)
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.15)
    osc.connect(this.envelope(t, 0.7, 0.25))
    osc.start(t)
    osc.stop(t + 0.26)
  }

  private note(t: number, freq: number) {
    const osc = this.ctx!.createOscillator()
    osc.type = "triangle"
    osc.frequency.value = freq / 2
    osc.connect(this.envelope(t, 0.12, 0.3))
    osc.start(t)
    osc.stop(t + 0.32)
  }

  private burst(buffer: AudioBuffer, t: number, cutoff: number, volume: number) {
    const ctx = this.ctx!
    const src = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    src.buffer = buffer
    filter.type = "highpass"
    filter.frequency.value = cutoff
    src.connect(filter)
    filter.connect(this.envelope(t, volume, buffer.duration))
    src.start(t)
  }

  private envelope(t: number, volume: number, length: number) {
    const gain = this.ctx!.createGain()
    gain.gain.setValueAtTime(volume, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + length)
    gain.connect(this.ctx!.destination)
    return gain
  }

  /** White noise, created once and reused for every hat/snare hit. */
  private noise(seconds: number) {
    const ctx = this.ctx!
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    return buffer
  }
}

/** Turns an id into a small number so each tape gets its own beat pattern. */
const seedOf = (id: string) => [...id].reduce((sum, c) => sum + c.charCodeAt(0), 0)

/**
 * Plays the given tape: its `src` if it has one, otherwise the generated beat.
 * `onEnded` runs when an audio clip finishes (e.g. to move on); without it, playback stops.
 */
export function useTapePlayer(tape: TapeItem | null, onEnded?: () => void) {
  const [playing, setPlaying] = useState(false)
  const audio = useRef<HTMLAudioElement | null>(null)
  const beat = useRef<BeatMachine | null>(null)
  const onEndedRef = useRef(onEnded)
  useEffect(() => {
    onEndedRef.current = onEnded
  })

  useEffect(() => {
    if (!tape || !playing) return

    if (tape.src) {
      const el = (audio.current ??= new Audio())
      if (el.dataset.src !== tape.src) el.src = el.dataset.src = tape.src // only reload on a new tape, so pause/play resumes
      const handleEnded = () => {
        el.currentTime = 0
        if (onEndedRef.current) onEndedRef.current()
        else setPlaying(false)
      }
      el.addEventListener("ended", handleEnded)
      el.play().catch(() => setPlaying(false))
      return () => {
        el.removeEventListener("ended", handleEnded)
        el.pause()
      }
    }

    const machine = (beat.current ??= new BeatMachine())
    machine.start(tape.bpm ?? 100, seedOf(tape.id))
    return () => machine.stop()
  }, [tape, playing])

  useEffect(
    () => () => {
      audio.current?.pause()
      beat.current?.dispose()
    },
    []
  )

  const toggle = useCallback(() => setPlaying((p) => !p), [])
  return { playing, setPlaying, toggle }
}

/* ============================================================================
 * Small helpers
 * ========================================================================== */

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)"
const subscribeReduced = (onChange: () => void) => {
  const media = window.matchMedia(REDUCED_QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}
const useReducedMotion = () =>
  useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED_QUERY).matches, () => false)

const pad = (n: number) => String(n).padStart(2, "0")
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/*"

/** Shows `text`, revealing it left to right through random characters whenever it changes. */
function ScrambleText({ text, animate = true }: { text: string; animate?: boolean }) {
  const [shown, setShown] = useState(text)
  useEffect(() => {
    if (!animate) return
    let revealed = 0
    const id = window.setInterval(() => {
      revealed += 1.5
      setShown(text.replace(/\S/g, (char, i: number) => (i < revealed ? char : GLYPHS[(Math.random() * GLYPHS.length) | 0]!)))
      if (revealed >= text.length) window.clearInterval(id)
    }, 28)
    return () => window.clearInterval(id)
  }, [text, animate])
  return <>{animate ? shown : text}</>
}

/** A mm:ss counter that ticks while `running`. Remount it (change its key) to reset. */
function Elapsed({ running }: { running: boolean }) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [running])
  return <>{`${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`}</>
}

/* ============================================================================
 * TapeCover: a quick label without images
 * ========================================================================== */

type TapeCoverProps = {
  /** Any CSS background: a colour, gradient or url(). */
  background: string
  text: string
  color?: string
  /** "block" = chunky display type, "hand" = marker, "mono" = small typewriter. */
  font?: "block" | "hand" | "mono"
  /** Small corner mark, like "A", "B" or "C90". */
  side?: string
}

export function TapeCover({ background, text, color = "#111", font = "block", side }: TapeCoverProps) {
  return (
    <div className="td-cover" style={{ background, color }}>
      <span className={`td-${font}`}>{text}</span>
      {side && <span className="td-side">{side}</span>}
    </div>
  )
}

/* ============================================================================
 * Tape: one 3D cassette box. Its transform is written by TapeDeck.
 * ========================================================================== */

const SIDES = ["back", "top", "bottom", "left", "right"] as const

type TapeProps = {
  tape: TapeItem
  index: number
  selected: boolean
  playing: boolean
  register: (index: number, el: HTMLDivElement | null) => void
  onOpen: (index: number) => void
  onHover: (index: number | null) => void
}

const Tape = memo(function Tape({ tape, index, selected, playing, register, onOpen, onHover }: TapeProps) {
  const className = ["td-tape", selected && "td-selected", playing && "td-playing"].filter(Boolean).join(" ")
  return (
    <div
      ref={(el) => register(index, el)}
      className={className}
      role="button"
      tabIndex={0}
      aria-label={`${tape.title} by ${tape.artist}`}
      onClick={(e) => {
        e.stopPropagation()
        onOpen(index)
      }}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return
        e.preventDefault()
        onOpen(index)
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(index)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(index)}
      onBlur={() => onHover(null)}
    >
      <div className="td-face td-front">
        <div className="td-label">{tape.cover}</div>
        <div className="td-window">
          <span className="td-reel" />
          <span className="td-reel" />
        </div>
        <div className="td-bridge" />
        <div className="td-gloss" />
      </div>
      {SIDES.map((side) => (
        <div key={side} className={`td-face td-${side}`} />
      ))}
    </div>
  )
})

/* ============================================================================
 * TapeDeck
 * ========================================================================== */

// The shelf is one tilted "rail". The open tape undoes exactly this tilt, so it lands facing the camera.
const RAIL = { rotateX: -20, rotateY: -40, left: 0.26, top: 0.84 }
const PERSPECTIVE = 1400
const FOCUS_Z = 140 // how far the open tape comes toward the viewer (px)
const MOBILE_WIDTH = 760

type TapeMotion = { focus: Spring; lift: Spring }
const newTapeMotion = (): TapeMotion => ({ focus: createSpring(0, 130, 22), lift: createSpring(0, 260, 22) })

export function TapeDeck({ tapes, className, player, defaultSelected }: TapeDeckProps) {
  const count = tapes.length

  const stageRef = useRef<HTMLElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const tapeEls = useRef<(HTMLDivElement | null)[]>([])
  const motion = useRef<TapeMotion[]>([])
  const shelf = useRef({
    offset: createSpring(0, 90, 19), // scroll position along the rail, in tapes
    drop: createSpring(0, 110, 20), // pushes the shelf down while a tape is open
    tiltX: createSpring(0, 120, 16), // parallax tilt of the open tape
    tiltY: createSpring(0, 120, 16),
  })
  const size = useRef({ width: 0, height: 0, tapeWidth: 280, tapeHeight: 178 })
  const drag = useRef({ active: false, moved: false, startX: 0, startOffset: 0, lastSwipe: 0 })
  const frame = useRef(0)
  const selectedRef = useRef<number | null>(null)

  const [selected, setSelected] = useState<number | null>(null)
  const [shown, setShown] = useState(0) // last opened tape; keeps its info visible while it fades out
  const [hovered, setHovered] = useState<number | null>(null)

  const reducedMotion = useReducedMotion()
  const reducedRef = useRef(reducedMotion)

  const selectedTape = selected === null ? null : (tapes[selected] ?? null)
  const internal = useTapePlayer(player ? null : selectedTape)
  const playerRef = useRef(player)
  const playing = player ? player.playing && player.currentId === selectedTape?.id : internal.playing
  const setPlaying = internal.setPlaying
  const toggle = useCallback(() => {
    const p = playerRef.current
    if (!p) return internal.toggle()
    if (!selectedTape) return
    if (p.currentId === selectedTape.id) p.toggle()
    else p.play(selectedTape)
  }, [internal, selectedTape])

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

  /* ---------- actions ---------- */

  const clampOffset = useCallback((v: number) => clamp(v, -1, Math.max(-1, count - 4)), [count])

  const open = useCallback(
    (index: number) => {
      const next = (index + count) % count
      const prev = selectedRef.current
      if (prev === next) return

      if (prev !== null) motion.current[prev]!.focus.target = 0
      motion.current[next]!.focus.target = 1
      shelf.current.offset.target = clampOffset(next - 1.5) // keep the gap it left in view
      motion.current.forEach((m) => (m.lift.target = 0))
      shelf.current.drop.target = 1

      selectedRef.current = next
      setSelected(next)
      setShown(next)
      setHovered(null)
      // With an outside player, stepping while music plays switches the song.
      const p = playerRef.current
      if (p?.playing && p.currentId !== tapes[next]!.id) p.play(tapes[next]!)
      kick()
    },
    [count, clampOffset, kick, tapes]
  )

  // Open `defaultSelected` once, after the stage has been measured.
  const initial = useRef(defaultSelected)
  useEffect(() => {
    const index = initial.current
    if (index == null || index < 0 || index >= count) return
    const id = requestAnimationFrame(() => {
      initial.current = undefined
      open(index)
    })
    return () => cancelAnimationFrame(id)
  }, [count, open])

  // When the outside player moves on by itself (a clip ended), bring the open tape along.
  const currentId = player?.currentId ?? null
  useEffect(() => {
    if (selectedRef.current === null || currentId === null) return
    const index = tapes.findIndex((t) => t.id === currentId)
    if (index >= 0 && index !== selectedRef.current) open(index)
  }, [currentId, tapes, open])

  const close = useCallback(() => {
    const prev = selectedRef.current
    if (prev === null) return
    const { drop, tiltX, tiltY } = shelf.current
    motion.current[prev]!.focus.target = 0
    drop.target = tiltX.target = tiltY.target = 0

    selectedRef.current = null
    setSelected(null)
    if (!playerRef.current) setPlaying(false)
    tapeEls.current[prev]?.focus({ preventScroll: true })
    kick()
  }, [kick, setPlaying])

  const hover = useCallback(
    (index: number | null) => {
      if (selectedRef.current !== null) return
      motion.current.forEach((m, i) => (m.lift.target = i === index ? 1 : 0))
      setHovered(index)
      kick()
    },
    [kick]
  )

  // A click that ends a drag shouldn't open a tape.
  const select = useCallback((index: number) => !drag.current.moved && open(index), [open])

  const register = useCallback((index: number, el: HTMLDivElement | null) => {
    tapeEls.current[index] = el
  }, [])

  const step = (dir: 1 | -1) => selectedRef.current !== null && open(selectedRef.current + dir)
  const stepRef = useRef(step)

  // Refs read by the render loop and long-lived listeners always see the latest values.
  useLayoutEffect(() => {
    reducedRef.current = reducedMotion
    playerRef.current = player
    stepRef.current = step
  })

  /* ---------- input: drag, swipe, horizontal wheel, tilt ---------- */

  useEffect(() => {
    const stage = stageRef.current!

    // Only horizontal scrolling moves the shelf, so normal page scrolling still works.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || selectedRef.current !== null) return
      e.preventDefault()
      shelf.current.offset.target = clampOffset(shelf.current.offset.target + e.deltaX / 160)
      kick()
    }

    const onDown = (e: PointerEvent) => {
      drag.current = { ...drag.current, active: true, moved: false, startX: e.clientX, startOffset: shelf.current.offset.target }
    }

    const onMove = (e: PointerEvent) => {
      // The hover tooltip trails the cursor; written straight to the DOM so it never re-renders.
      const r = stage.getBoundingClientRect()
      if (tipRef.current) tipRef.current.style.translate = `${e.clientX - r.left}px ${e.clientY - r.top}px`
      const d = drag.current
      const isOpen = selectedRef.current !== null

      if (isOpen && e.pointerType === "mouse") {
        shelf.current.tiltY.target = ((e.clientX - r.left) / r.width - 0.5) * 16
        shelf.current.tiltX.target = -((e.clientY - r.top) / r.height - 0.5) * 12
        kick()
      }
      if (!d.active) return

      const dx = e.clientX - d.startX
      if (Math.abs(dx) > 6) d.moved = true

      if (!isOpen) {
        shelf.current.offset.target = clampOffset(d.startOffset - dx / 90)
        kick()
      } else if (Math.abs(dx) > 60 && performance.now() - d.lastSwipe > 350) {
        // Swipe to the next/previous tape.
        d.lastSwipe = performance.now()
        d.startX = e.clientX
        stepRef.current(dx < 0 ? 1 : -1)
      }
    }

    const onUp = () => {
      drag.current.active = false
      setTimeout(() => (drag.current.moved = false)) // let the click handler see `moved` first
    }

    stage.addEventListener("wheel", onWheel, { passive: false })
    stage.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      stage.removeEventListener("wheel", onWheel)
      stage.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [clampOffset, kick])

  const onKeyDown = (e: KeyboardEvent) => {
    const isOpen = selectedRef.current !== null
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault()
      const dir = e.key === "ArrowRight" ? 1 : -1
      if (isOpen) step(dir)
      else {
        shelf.current.offset.target = clampOffset(shelf.current.offset.target + dir)
        kick()
      }
    } else if (isOpen && e.key === "Escape") {
      e.stopPropagation() // close just the tape, not a modal the deck sits in
      close()
    } else if (isOpen && e.key === " " && !(e.target as HTMLElement).closest("button, [role=button]")) {
      e.preventDefault()
      toggle()
    }
  }

  /* ---------- view ---------- */

  const current = tapes[shown]
  const tip = hovered !== null && selected === null ? tapes[hovered] : null
  const stageStyle = {
    "--rail-left": `${RAIL.left * 100}%`,
    "--rail-top": `${RAIL.top * 100}%`,
    "--rail-rotate": `rotateX(${RAIL.rotateX}deg) rotateY(${RAIL.rotateY}deg)`,
    "--perspective": `${PERSPECTIVE}px`,
    "--beat": `${60 / (current?.bpm ?? 100)}s`,
  } as CSSProperties

  return (
    <section
      ref={stageRef}
      className={["td-stage", selected !== null && "td-focused", className].filter(Boolean).join(" ")}
      style={stageStyle}
      aria-label="Tape deck. Drag to browse, select a tape to open it."
      onKeyDown={onKeyDown}
      onClick={() => !drag.current.moved && close()}
    >
      {/* React 19 hoists this into <head> once, however many decks are on the page. */}
      <style href="tape-deck" precedence="default">
        {CSS}
      </style>

      <div className="td-hud" aria-hidden="true">
        <div>
          <ScrambleText text={hovered === null ? "Pick a tape" : tapes[hovered]!.title} animate={!reducedMotion} />
        </div>
        <div className="td-muted">
          <ScrambleText text={hovered === null ? "Hover to read it" : tapes[hovered]!.artist} animate={!reducedMotion} />
        </div>
      </div>
      <p className="td-hint">Click a tape to open it</p>

      {/* Always mounted so it already sits under the cursor when it appears. */}
      <div ref={tipRef} className={`td-tooltip ${tip ? "td-tip-shown" : ""}`} aria-hidden="true">
        {tip && (
          <>
            <strong>{tip.title}</strong>
            <span>{tip.artist}</span>
          </>
        )}
      </div>

      <div className="td-scene">
        <div className="td-rail">
          {tapes.map((tape, i) => (
            <Tape
              key={tape.id}
              tape={tape}
              index={i}
              selected={i === selected}
              playing={playing && i === selected}
              register={register}
              onOpen={select}
              onHover={hover}
            />
          ))}
        </div>
      </div>

      {current && (
        <div ref={infoRef} className="td-info" aria-live="polite">
          <h2>
            <ScrambleText text={current.title} animate={!reducedMotion} />
          </h2>
          <p>{current.artist}</p>
          <p className="td-time">
            <span className="td-bars" aria-hidden="true">
              <i /> <i /> <i /> <i /> <i />
            </span>
            <Elapsed key={shown} running={playing} />
          </p>
          <p className="td-count">
            {pad(shown + 1)} / {pad(count)}
          </p>
        </div>
      )}

      <button type="button" className="td-close" aria-label="Close" onClick={(e) => (e.stopPropagation(), close())}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className="td-controls" onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Previous tape" onClick={() => step(-1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          className={`td-play ${playing ? "td-on" : ""}`}
          aria-label={playing ? "Pause" : "Play"}
          aria-pressed={playing}
          onClick={toggle}
        >
          <svg className="td-icon-play" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
          <svg className="td-icon-pause" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
          </svg>
        </button>
        <button type="button" aria-label="Next tape" onClick={() => step(1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}

/* ============================================================================
 * Styles. Override the custom properties on `.td-stage` (via className) to restyle.
 * ========================================================================== */

const CSS = `
.td-stage {
  --fg: #f2f2ee;
  --muted: #8a8a86;
  --line: rgb(242 242 238 / 0.55);
  --bg: #000;
  --font: var(--font-mono, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace);
  --font-display: Impact, "Arial Black", sans-serif;
  --font-hand: "Segoe Print", "Bradley Hand", cursive;
  --w: 280px;
  --h: 178px;
  --d: 30px;

  position: relative;
  width: 100%;
  height: clamp(520px, 80vh, 820px);
  overflow: hidden;
  container-type: inline-size;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font);
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}
.td-focused { cursor: default; }

.td-hud, .td-hint {
  position: absolute; left: 24px; z-index: 2; margin: 0;
  font-size: 10px; letter-spacing: 0.06em; line-height: 1.5; text-transform: uppercase;
  pointer-events: none; transition: opacity 0.4s ease;
}
.td-hud { top: 20px; }
.td-hint { bottom: 18px; font-size: 9px; }
.td-muted { color: var(--muted); }
.td-focused .td-hud, .td-focused .td-hint { opacity: 0; }

.td-scene { position: absolute; inset: 0; perspective: var(--perspective); perspective-origin: 50% 40%; }
.td-rail {
  position: absolute; left: var(--rail-left); top: var(--rail-top);
  transform-style: preserve-3d; transform: var(--rail-rotate);
}

.td-tape {
  position: absolute; width: var(--w); height: var(--h);
  margin: calc(var(--h) * -1) 0 0 calc(var(--w) / -2);
  transform-style: preserve-3d; will-change: transform; cursor: pointer; outline: none;
}
.td-face { position: absolute; backface-visibility: hidden; transition: filter 0.6s ease; }
.td-focused .td-tape:not(.td-selected) .td-face { filter: brightness(0.22) saturate(0.6); }

.td-front, .td-back { width: var(--w); height: var(--h); border-radius: 9px; }
.td-front {
  transform: translateZ(calc(var(--d) / 2));
  background:
    radial-gradient(circle at 9px 9px, #666 2px, transparent 3.5px),
    radial-gradient(circle at calc(100% - 9px) 9px, #666 2px, transparent 3.5px),
    radial-gradient(circle at 9px calc(100% - 9px), #666 2px, transparent 3.5px),
    radial-gradient(circle at calc(100% - 9px) calc(100% - 9px), #666 2px, transparent 3.5px),
    linear-gradient(160deg, #2e2e2e, #121212 60%, #1c1c1c);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.12), inset 0 1px 0 rgb(255 255 255 / 0.25);
}
.td-tape:focus-visible .td-front { box-shadow: inset 0 0 0 2px var(--fg); }
.td-back { transform: rotateY(180deg) translateZ(calc(var(--d) / 2)); background: #151515; }
.td-top, .td-bottom {
  top: calc(50% - var(--d) / 2); width: var(--w); height: var(--d);
  background: linear-gradient(#262626, #141414);
}
.td-top { transform: rotateX(90deg) translateZ(calc(var(--h) / 2)); }
.td-bottom { transform: rotateX(-90deg) translateZ(calc(var(--h) / 2)); background: #0a0a0a; }
.td-left, .td-right {
  left: calc(50% - var(--d) / 2); width: var(--d); height: var(--h);
  background: linear-gradient(90deg, #1d1d1d, #2b2b2b 50%, #161616);
}
.td-left { transform: rotateY(-90deg) translateZ(calc(var(--w) / 2)); }
.td-right { transform: rotateY(90deg) translateZ(calc(var(--w) / 2)); }

.td-label { position: absolute; inset: 5% 5% 28%; overflow: hidden; border-radius: 4px; }
.td-label img { width: 100%; height: 100%; object-fit: cover; }
.td-window {
  position: absolute; top: 36%; left: 50%; width: 40%; height: 17%;
  transform: translateX(-50%); border-radius: 999px;
  background: linear-gradient(#3a2a1f, #140d09);
  box-shadow: inset 0 0 0 2px rgb(0 0 0 / 0.6), 0 0 0 3px rgb(255 255 255 / 0.75);
}
.td-reel {
  position: absolute; top: 50%; height: 72%; aspect-ratio: 1; translate: 0 -50%;
  border-radius: 50%; background: repeating-conic-gradient(#eee 0 20deg, #555 20deg 60deg);
}
.td-reel:first-child { left: 6%; }
.td-reel:last-child { right: 6%; }
.td-playing .td-reel { animation: td-spin calc(var(--beat) * 3) linear infinite; }
.td-bridge {
  position: absolute; bottom: 0; left: 14%; right: 14%; height: 19%;
  background:
    radial-gradient(circle at 30% 60%, #2a2a2a 3px, transparent 4px),
    radial-gradient(circle at 70% 60%, #2a2a2a 3px, transparent 4px),
    #0f0f0f;
  clip-path: polygon(9% 0, 91% 0, 100% 100%, 0 100%);
}
.td-gloss {
  position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background: linear-gradient(115deg, rgb(255 255 255 / 0.2), transparent 32% 70%, rgb(255 255 255 / 0.06));
}

.td-cover { position: relative; height: 100%; padding: 6px 8px; white-space: pre-line; line-height: 0.95; }
.td-block { font-family: var(--font-display); font-size: calc(var(--w) * 0.075); }
.td-hand { font-family: var(--font-hand); font-size: calc(var(--w) * 0.065); }
.td-mono { font-family: var(--font); font-size: calc(var(--w) * 0.04); font-weight: 700; }
.td-side { position: absolute; right: 7px; bottom: 5px; font-family: var(--font); font-size: 9px; font-weight: 700; }

.td-info {
  position: absolute; inset-inline: 0; z-index: 2;
  text-align: center; text-transform: uppercase; letter-spacing: 0.08em;
  pointer-events: none; opacity: 0; translate: 0 10px;
  transition: opacity 0.45s ease, translate 0.6s cubic-bezier(0.2, 0.9, 0.3, 1);
}
.td-info h2 { margin: 0; font-size: 15px; font-weight: 700; color: var(--fg); }
.td-info p { margin: 6px 0 0; font-size: 10px; color: var(--muted); }
.td-info .td-time { color: var(--fg); font-variant-numeric: tabular-nums; }
.td-info .td-count { margin-top: 10px; letter-spacing: 0.14em; }

.td-bars { display: inline-flex; align-items: flex-end; gap: 2px; height: 10px; margin-right: 8px; vertical-align: -1px; }
.td-bars i { width: 2px; height: 3px; border-radius: 1px; background: currentColor; }
.td-focused:has(.td-on) .td-bars i { animation: td-level calc(var(--beat) / 2) ease-in-out infinite alternate; }
.td-bars i:nth-child(2) { animation-delay: -0.12s; }
.td-bars i:nth-child(3) { animation-delay: -0.3s; }
.td-bars i:nth-child(4) { animation-delay: -0.2s; }
.td-bars i:nth-child(5) { animation-delay: -0.05s; }

.td-controls {
  position: absolute; bottom: 22px; left: 50%; z-index: 2;
  display: flex; align-items: center; gap: 14px;
  translate: -50% 16px; opacity: 0; pointer-events: none;
  transition: opacity 0.4s ease, translate 0.6s cubic-bezier(0.2, 0.9, 0.3, 1);
}
.td-close {
  position: absolute; top: 16px; right: 16px; z-index: 2;
  opacity: 0; scale: 0.8; pointer-events: none;
  transition: opacity 0.35s ease, scale 0.5s cubic-bezier(0.2, 1.4, 0.4, 1), background-color 0.2s;
}
.td-focused .td-info, .td-focused .td-controls, .td-focused .td-close {
  opacity: 1; pointer-events: auto; translate: none; scale: none;
}
.td-focused .td-info { pointer-events: none; transition-delay: 0.15s; }
.td-focused .td-controls { translate: -50% 0; transition-delay: 0.2s; }

.td-controls button, .td-close {
  display: grid; place-items: center; width: 44px; height: 44px;
  border: 1.5px solid var(--line); border-radius: 50%;
  background: rgb(0 0 0 / 0.6); color: var(--fg); cursor: pointer;
  transition: background-color 0.2s, color 0.2s, scale 0.15s;
}
.td-controls button:hover, .td-close:hover { background: var(--fg); color: var(--bg); }
.td-controls button:active { scale: 0.92; }
.td-controls button:focus-visible, .td-close:focus-visible { outline: 2px solid var(--fg); outline-offset: 3px; }
.td-controls svg, .td-close svg {
  width: 16px; height: 16px; fill: none; stroke: currentColor;
  stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
}

.td-controls .td-play { position: relative; width: 58px; height: 58px; border-color: var(--fg); background: var(--fg); color: var(--bg); }
.td-controls .td-play svg {
  position: absolute; width: 20px; height: 20px; fill: currentColor; stroke: none;
  transition: opacity 0.25s ease, scale 0.35s cubic-bezier(0.2, 1.4, 0.4, 1), rotate 0.35s ease;
}
.td-controls .td-icon-pause, .td-controls .td-on .td-icon-play { opacity: 0; scale: 0.5; rotate: 90deg; }
.td-controls .td-on .td-icon-pause { opacity: 1; scale: 1; rotate: 0deg; }
.td-play::after {
  content: ""; position: absolute; inset: -6px;
  border: 1.5px solid var(--fg); border-radius: 50%; opacity: 0;
}
.td-play.td-on::after { animation: td-pulse var(--beat) ease-out infinite; }

.td-tooltip {
  position: absolute; top: 0; left: 0; z-index: 3;
  display: flex; flex-direction: column; gap: 1px;
  max-width: 220px; margin: 18px 0 0 14px; padding: 7px 10px;
  border: 1px solid rgb(255 255 255 / 0.14); border-radius: 10px;
  background: rgb(18 18 18 / 0.92); backdrop-filter: blur(6px);
  box-shadow: 0 8px 24px -8px rgb(0 0 0 / 0.6);
  color: var(--fg); font-size: 12px; line-height: 1.35;
  pointer-events: none; opacity: 0; scale: 0.94;
  transition: opacity 0.15s ease, scale 0.15s ease;
}
.td-tip-shown { opacity: 1; scale: 1; }
.td-tooltip strong, .td-tooltip span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.td-tooltip strong { font-weight: 600; }
.td-tooltip span { color: var(--muted); }

@keyframes td-spin { to { rotate: 360deg; } }
@keyframes td-pulse { from { opacity: 0.6; scale: 0.9; } to { opacity: 0; scale: 1.25; } }
@keyframes td-level { from { height: 3px; } to { height: 10px; } }

@container (max-width: 760px) {
  .td-scene { --w: 190px; --h: 121px; --d: 22px; }
}
@media (hover: none) {
  .td-tooltip { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .td-playing .td-reel, .td-play.td-on::after, .td-focused:has(.td-on) .td-bars i { animation: none; }
}
`
