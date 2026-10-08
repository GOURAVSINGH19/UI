"use client"

import { useCallback, useRef, useState } from "react"
import { dissolve as run, restore as undo } from "./dissolve"
import type { DissolveOptions } from "./types"

/**
 * Attach `ref` to the element, then call `dissolve()`. It resolves when the dust is gone,
 * so you can remove the item from state right after awaiting it.
 */
export function useDissolve<T extends HTMLElement = HTMLDivElement>(options?: DissolveOptions) {
  const ref = useRef<T>(null)
  const [dissolving, setDissolving] = useState(false)
  const optionsRef = useRef(options)
  optionsRef.current = options

  const dissolve = useCallback(async (override?: DissolveOptions) => {
    const el = ref.current
    if (!el || el.dataset.dissolving) return
    el.dataset.dissolving = "true"
    setDissolving(true)
    try {
      await run(el, { ...optionsRef.current, ...override })
    } finally {
      setDissolving(false)
    }
  }, [])

  const restore = useCallback(() => {
    const el = ref.current
    if (!el) return
    delete el.dataset.dissolving
    undo(el)
  }, [])

  return { ref, dissolve, restore, dissolving }
}
