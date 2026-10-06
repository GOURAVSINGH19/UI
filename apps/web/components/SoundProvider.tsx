"use client"

import { useEffect } from "react"
import { bind } from "cuelume"
import { cue, initSound } from "@/lib/sound"

// Things a person clicks. Anything matching gets the ripple; buttons also get the press.
const INTERACTIVE = 'a[href], button, summary, [role="button"], [role="option"], [role="tab"], [data-cuelume-tap]'
const PRESSABLE = 'button, [role="button"], [data-press]'
// Opt out of the press scale, e.g. full-width rows where shrinking looks off.
const NO_PRESS = '[data-press="off"]'
// Elements that already make their own sound (cuelume attributes, or code that calls cue()).
const HAS_OWN_SOUND =
    "[data-cuelume-tap], [data-cuelume-type], [data-cuelume-select], [data-cuelume-toggle], [data-cuelume-open], [data-cuelume-close], [data-cuelume-navigate], [data-sound='off'], [data-slot^='search-']"

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** A ring that grows out of the pointer in the clicked element's own text colour. */
function ripple(x: number, y: number, color: string) {
    const ring = document.createElement("span")
    ring.setAttribute("aria-hidden", "true")
    Object.assign(ring.style, {
        position: "fixed",
        left: `${x}px`,
        top: `${y}px`,
        width: "10px",
        height: "10px",
        margin: "-5px 0 0 -5px",
        borderRadius: "9999px",
        border: `1.5px solid ${color}`,
        pointerEvents: "none",
        zIndex: "2147483647",
    })
    document.body.appendChild(ring)
    ring.animate(
        [
            { transform: "scale(1)", opacity: 0.55 },
            { transform: "scale(4.2)", opacity: 0 },
        ],
        { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    ).onfinish = () => ring.remove()
}

/** Wires cuelume once for the whole site, plus a default tap + click animation for every button and link. */
export function SoundProvider() {
    useEffect(() => {
        initSound()
        bind()

        const pressed = new Map<Element, Animation>()

        const release = (el: Element) => {
            const down = pressed.get(el)
            if (!down) return
            pressed.delete(el)
            down.cancel()
            // Small overshoot on the way back so it feels springy.
            el.animate([{ scale: "0.96" }, { scale: "1.015", offset: 0.6 }, { scale: "1" }], {
                duration: 280,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            })
        }

        const onPointerDown = (e: PointerEvent) => {
            if (e.button !== 0 || reducedMotion()) return
            const target = (e.target as Element).closest(INTERACTIVE)
            if (!target || target.matches(":disabled, [aria-disabled='true']")) return
            ripple(e.clientX, e.clientY, getComputedStyle(target).color)

            const pressable = (e.target as Element).closest(PRESSABLE)
            if (pressable && !pressable.matches(NO_PRESS) && !pressed.has(pressable)) {
                // `scale` composes with any transform the element already has (Motion, Tailwind).
                pressed.set(pressable, pressable.animate([{ scale: "1" }, { scale: "0.96" }], { duration: 110, easing: "ease-out", fill: "forwards" }))
                const up = () => release(pressable)
                window.addEventListener("pointerup", up, { once: true })
                window.addEventListener("pointercancel", up, { once: true })
            }
        }

        // Default sound for anything not already handled. Runs on click, so Enter/Space on a button counts too.
        const onClick = (e: MouseEvent) => {
            const target = (e.target as Element).closest(INTERACTIVE)
            if (!target || target.closest(HAS_OWN_SOUND)) return
            const pointerType = (e as PointerEvent).pointerType
            const input = pointerType === "mouse" || pointerType === "touch" || pointerType === "pen" ? pointerType : "keyboard"

            if (target.tagName === "SUMMARY") {
                // <details> hasn't toggled yet at click time.
                const open = (target.parentElement as HTMLDetailsElement | null)?.open
                cue(open ? "close" : "open", { emphasis: "subtle" })
            } else if (target.hasAttribute("aria-expanded")) {
                // Disclosures (sidebar folders, menus): the attribute still holds the pre-click state.
                cue(target.getAttribute("aria-expanded") === "true" ? "close" : "open", { emphasis: "subtle" })
            } else {
                cue("tap", { input })
            }
        }

        document.addEventListener("pointerdown", onPointerDown)
        document.addEventListener("click", onClick)
        return () => {
            document.removeEventListener("pointerdown", onPointerDown)
            document.removeEventListener("click", onClick)
        }
    }, [])

    return null
}
