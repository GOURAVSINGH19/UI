"use client"

import { memo, useEffect, useState } from "react"
import { pad } from "./motion"
import type { TapeItem } from "./types"

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/*"

/** Shows `text`, revealing it left to right through random characters whenever it changes. */
export function ScrambleText({ text, animate = true }: { text: string; animate?: boolean }) {
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
export function Elapsed({ running }: { running: boolean }) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [running])
  return <>{`${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`}</>
}

/* TapeCover: a quick label without images. */

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

/* Tape: one 3D cassette box. Its transform is written by TapeDeck. */

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

export const Tape = memo(function Tape({ tape, index, selected, playing, register, onOpen, onHover }: TapeProps) {
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
