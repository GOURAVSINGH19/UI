"use client"

import { useEffect, useRef, useState } from "react"
import { Paperclip, RotateCcw } from "lucide-react"
import { AttachmentList, type Attachment } from "@workspace/ui/components/ui/file-attachment/index"

// Sample thumbnails drawn as gradients, so the demo needs no image files.
function gradientImage(stops: string[]) {
    if (typeof document === "undefined") return ""
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 160
    const ctx = canvas.getContext("2d")!
    const g = ctx.createLinearGradient(0, 0, 160, 160)
    stops.forEach((stop, i) => g.addColorStop(i / (stops.length - 1), stop))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 160, 160)
    const r = ctx.createRadialGradient(110, 50, 0, 110, 50, 90)
    r.addColorStop(0, "rgba(255,255,255,.55)")
    r.addColorStop(1, "rgba(255,255,255,0)")
    ctx.fillStyle = r
    ctx.fillRect(0, 0, 160, 160)
    return canvas.toDataURL()
}

type Sample = Omit<Attachment, "url" | "progress" | "status"> & { stops?: string[]; speed: number; failAt?: number }

const SAMPLES: Sample[] = [
    { id: "a", name: "hero-shot.png", size: 2_400_000, type: "image/png", stops: ["#7c5cff", "#53eafd"], speed: 0.9 },
    { id: "b", name: "moodboard.jpg", size: 3_800_000, type: "image/jpeg", stops: ["#ff2056", "#fac800"], speed: 0.55 },
    { id: "c", name: "Q3-report.pdf", size: 1_200_000, speed: 0.75 },
    { id: "d", name: "pricing-data.csv", size: 640_000, speed: 1.2 },
    { id: "e", name: "design-system.zip", size: 18_400_000, speed: 0.45, failAt: 0.62 },
]

type Item = Attachment & { speed: number; failAt?: number }

const fresh = (urls: Record<string, string>): Item[] =>
    SAMPLES.map(({ stops, ...s }) => ({ ...s, url: stops ? urls[s.id] : undefined, progress: 0, status: "uploading" }))

export function FileAttachmentDemo() {
    const [items, setItems] = useState<Item[]>([])
    const urls = useRef<Record<string, string>>({})
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        SAMPLES.forEach((s) => s.stops && (urls.current[s.id] = gradientImage(s.stops)))
        setItems(fresh(urls.current))
    }, [])

    // Simulated network: each file climbs at its own pace.
    useEffect(() => {
        const timer = setInterval(() => {
            setItems((current) =>
                current.map((item) => {
                    if (item.status !== "uploading") return item
                    const next = Math.min(1, (item.progress ?? 0) + (0.02 + Math.random() * 0.05) * item.speed)
                    if (item.failAt && next >= item.failAt) return { ...item, progress: item.failAt, status: "error", failAt: undefined }
                    return next >= 1 ? { ...item, progress: 1, status: "done" } : { ...item, progress: next }
                })
            )
        }, 120)
        return () => clearInterval(timer)
    }, [])

    const remove = (id: string) => setItems((current) => current.filter((item) => item.id !== id))
    const retry = (id: string) =>
        setItems((current) => current.map((item) => (item.id === id ? { ...item, status: "uploading", progress: 0 } : item)))

    const addFiles = (files: FileList | null) => {
        if (!files) return
        const added: Item[] = [...files].map((file) => ({
            id: `${file.name}-${Math.random().toString(36).slice(2, 7)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
            progress: 0,
            status: "uploading",
            speed: 0.6 + Math.random() * 0.6,
        }))
        setItems((current) => [...current, ...added])
    }

    return (
        <div className="flex w-full max-w-xl flex-col gap-4 self-start pt-6">
            <div className="rounded-2xl border border-ui-border bg-ui-bg p-3 shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
                <AttachmentList items={items} onCancel={remove} onRemove={remove} onRetry={retry} className="min-h-16" />
                <div className="mt-3 flex items-center gap-2 border-t border-ui-border pt-3">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm text-ui-secondary transition-colors hover:bg-ui-muted hover:text-ui-heading"
                    >
                        <Paperclip className="size-3.5" aria-hidden /> Add files
                    </button>
                    <button
                        type="button"
                        onClick={() => setItems(fresh(urls.current))}
                        className="ml-auto flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm text-ui-caption transition-colors hover:bg-ui-muted hover:text-ui-heading"
                    >
                        <RotateCcw className="size-3.5" aria-hidden /> Replay
                    </button>
                    <input ref={inputRef} type="file" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = "" }} />
                </div>
            </div>
            <p className="px-1 text-xs text-ui-caption">Hover a ring to cancel. One upload fails on purpose; press its retry button.</p>
        </div>
    )
}
