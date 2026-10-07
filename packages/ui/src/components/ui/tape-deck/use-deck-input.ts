import { useEffect, type RefObject } from "react"
import type { Shelf } from "./use-shelf"

export type Drag = { active: boolean; moved: boolean; startX: number; startOffset: number; lastSwipe: number }

/** Drag and swipe to browse, horizontal wheel to scroll the shelf, and pointer tilt on the open tape. */
export function useDeckInput({
  deck,
  drag,
  tipRef,
  selectedRef,
  stepRef,
}: {
  deck: Shelf
  drag: RefObject<Drag>
  tipRef: RefObject<HTMLDivElement | null>
  selectedRef: RefObject<number | null>
  stepRef: RefObject<(dir: 1 | -1) => void>
}) {
  const { stageRef, shelf, clampOffset, kick } = deck

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
}
