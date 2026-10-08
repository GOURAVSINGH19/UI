import { getEngine } from "./engine"
import { snapshot } from "./snapshot"
import { DEFAULTS, type DissolveOptions } from "./types"

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Folds an element's box (height, margins, padding) to nothing so neighbours slide in. */
function collapse(el: HTMLElement, duration: number) {
  const cs = getComputedStyle(el)
  return el.animate(
    [
      {
        height: `${el.offsetHeight}px`,
        marginTop: cs.marginTop,
        marginBottom: cs.marginBottom,
        paddingTop: cs.paddingTop,
        paddingBottom: cs.paddingBottom,
        overflow: "hidden",
      },
      { height: "0px", marginTop: "0px", marginBottom: "0px", paddingTop: "0px", paddingBottom: "0px", overflow: "hidden" },
    ],
    { duration, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" }
  ).finished
}

/**
 * Breaks `el` into drifting dust. Resolves once the dust is gone, which is the moment to
 * remove the item from your data. The element is hidden (and collapsed) but not removed.
 */
export async function dissolve(el: HTMLElement, options: DissolveOptions = {}) {
  const config = { ...DEFAULTS, ...options }

  if (reducedMotion()) {
    await el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" }).finished
    if (config.collapse) await collapse(el, 200)
    return
  }

  const shot = await snapshot(el)
  const total = getEngine().spawn(shot, config)
  // The particles now draw the element, so hide the real one in the same frame.
  el.style.visibility = "hidden"
  el.inert = true

  const done = wait(total)
  if (config.collapse) {
    await wait(config.sweep + 120)
    await collapse(el, 420)
  }
  await done
}

/** Brings a dissolved element back, e.g. for undo. */
export function restore(el: HTMLElement) {
  el.getAnimations().forEach((animation) => animation.cancel())
  el.style.visibility = ""
  el.inert = false
}
