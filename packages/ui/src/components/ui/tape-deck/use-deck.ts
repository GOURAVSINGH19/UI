import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react"
import { useTapePlayer } from "./sound"
import type { TapeDeckProps } from "./types"
import { useDeckInput, type Drag } from "./use-deck-input"
import { useShelf } from "./use-shelf"

/** Everything TapeDeck does: which tape is open, playback, and the actions and keys that change them. */
export function useDeck({
  tapes,
  player,
  defaultSelected,
  reducedMotion,
}: Pick<TapeDeckProps, "tapes" | "player" | "defaultSelected"> & { reducedMotion: boolean }) {
  const count = tapes.length
  const deck = useShelf(count, reducedMotion)
  const { tapeEls, motion, shelf, kick, clampOffset } = deck
  const tipRef = useRef<HTMLDivElement>(null)
  const drag = useRef<Drag>({ active: false, moved: false, startX: 0, startOffset: 0, lastSwipe: 0 })
  const selectedRef = useRef<number | null>(null)

  const [selected, setSelected] = useState<number | null>(null)
  const [shown, setShown] = useState(0) // last opened tape; keeps its info visible while it fades out
  const [hovered, setHovered] = useState<number | null>(null)

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


  // Refs read by long-lived listeners always see the latest values.
  useLayoutEffect(() => {
    playerRef.current = player
    stepRef.current = step
  })

  useDeckInput({ deck, drag, tipRef, selectedRef, stepRef })

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

  return { ...deck, tipRef, drag, selected, shown, hovered, playing, toggle, close, hover, select, register, step, onKeyDown }
}
