import { useCallback, useEffect, useRef, useState } from "react"
import type { TapeItem } from "./types"

/* A tiny Web Audio drum machine for tapes without a `src`. */

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
