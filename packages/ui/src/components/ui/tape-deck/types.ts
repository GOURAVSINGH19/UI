import type { ReactNode } from "react"

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
