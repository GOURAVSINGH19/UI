"use client"

import type { CSSProperties } from "react"
import { Elapsed, ScrambleText, Tape } from "./parts"
import { PERSPECTIVE, RAIL, pad, useReducedMotion } from "./motion"
import { STAGE_CSS } from "./styles-stage"
import { TAPE_CSS } from "./styles-tape"
import type { TapeDeckProps } from "./types"
import { useDeck } from "./use-deck"

const CSS = STAGE_CSS + TAPE_CSS

export function TapeDeck({ tapes, className, player, defaultSelected }: TapeDeckProps) {
  const count = tapes.length
  const reducedMotion = useReducedMotion()
  const {
    stageRef, infoRef, tipRef, drag, selected, shown, hovered, playing,
    toggle, close, hover, select, register, step, onKeyDown,
  } = useDeck({ tapes, player, defaultSelected, reducedMotion })

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
