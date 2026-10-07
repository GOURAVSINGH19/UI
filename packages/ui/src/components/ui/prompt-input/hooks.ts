import { useCallback, useLayoutEffect, type RefObject, useEffect, useRef, useState } from "react"

/**
 * Run / stop state for a submit that may return a promise.
 * While it is pending, `running` is true; `stop` aborts the signal it was given.
 */
export function useRun(onStop?: () => void) {
  const [running, setRunning] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => () => controllerRef.current?.abort(), [])

  const stop = () => {
    controllerRef.current?.abort()
    controllerRef.current = null
    setRunning(false)
    onStop?.()
  }

  const start = (task: (signal: AbortSignal) => void | Promise<void>) => {
    const controller = new AbortController()
    controllerRef.current = controller
    setRunning(true)
    Promise.resolve()
      .then(() => task(controller.signal))
      .catch(() => {})
      .finally(() => {
        if (controllerRef.current !== controller) return
        controllerRef.current = null
        setRunning(false)
      })
  }

  return { running, start, stop }
}

type Recognition = {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

function getRecognition(): (new () => Recognition) | undefined {
  if (typeof window === "undefined") return undefined
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition) as (new () => Recognition) | undefined
}

/** Browser speech recognition. `onText` receives the full transcript so far on every result. */
export function useVoice(enabled: boolean, onText: (transcript: string) => void) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<Recognition | null>(null)

  useEffect(() => setSupported(enabled && Boolean(getRecognition())), [enabled])
  useEffect(() => () => recognitionRef.current?.stop(), [])

  const stop = () => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setListening(false)
  }

  const start = () => {
    const Recognition = getRecognition()
    if (!Recognition) return
    const recognition = new Recognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = navigator.language
    recognition.onresult = (event) =>
      onText(Array.from(event.results, (result) => result[0]?.transcript ?? "").join(""))
    recognition.onend = () => {
      recognitionRef.current = null
      setListening(false)
    }
    recognition.onerror = recognition.onend
    recognitionRef.current = recognition
    setListening(true)
    recognition.start()
  }

  return { supported, listening, start, stop, toggle: () => (listening ? stop() : start()) }
}

/** Tracks a `.dark` class on <html>, the way next-themes and Tailwind class-based dark mode work. */
export function useDarkClass() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const read = () => setDark(root.classList.contains("dark"))
    read()
    const observer = new MutationObserver(read)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return dark
}

/** Grows a textarea with its content, and re-measures when its width changes (wrapping moves). */
export function useAutoHeight(ref: RefObject<HTMLTextAreaElement | null>, value: string, max = 200) {
  const fit = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, max)}px`
  }, [ref, max])

  useLayoutEffect(fit, [value, fit])

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    let width = el.offsetWidth
    const observer = new ResizeObserver(() => {
      if (el.offsetWidth === width) return
      width = el.offsetWidth
      fit()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, fit])
}

/** Open state, outside-click closing and arrow-key focus for a small menu of buttons. */
export function useMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    const focusTimer = setTimeout(() => itemRefs.current[0]?.focus(), 60)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      clearTimeout(focusTimer)
    }
  }, [open])

  const close = (refocus = true) => {
    setOpen(false)
    if (refocus) triggerRef.current?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const buttons = itemRefs.current.filter(Boolean) as HTMLButtonElement[]
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      const step = event.key === "ArrowDown" ? 1 : -1
      buttons[(index + step + buttons.length) % buttons.length]?.focus()
    } else if (event.key === "Escape") {
      event.preventDefault()
      event.stopPropagation()
      close()
    } else if (event.key === "Tab") {
      close(false)
    }
  }

  return { open, toggle: () => setOpen((o) => !o), close, rootRef, triggerRef, itemRefs, onKeyDown }
}
