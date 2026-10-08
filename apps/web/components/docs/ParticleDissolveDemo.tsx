"use client"

import { useRef, useState } from "react"
import { RotateCcw, Trash2, X } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { useDissolve, WIND, type DissolveFrom, type DissolveOptions } from "@workspace/ui/components/ui/particle-dissolve/index"

type Message = { id: number; text: string; mine: boolean }

const MESSAGES: Message[] = [
    { id: 1, text: "Can you shorten the hero headline?", mine: true },
    { id: 2, text: "Sure: “Build beautiful interfaces, fast.”", mine: false },
    { id: 3, text: "Perfect. Now delete the old draft.", mine: true },
    { id: 4, text: "Done. The old draft is gone.", mine: false },
]

const FROM: DissolveFrom[] = ["left", "center", "bottom"]
const WINDS = { rise: WIND.rise, fall: WIND.fall, right: WIND.right } as const

function Row({ message, options, onGone, register }: {
    message: Message
    options: DissolveOptions
    onGone: (id: number) => void
    register: (id: number, run: (() => Promise<void>) | null) => void
}) {
    const { ref, dissolve } = useDissolve<HTMLDivElement>(options)
    const remove = async () => {
        await dissolve()
        onGone(message.id)
    }

    return (
        <div
            ref={(el) => {
                ref.current = el
                register(message.id, el ? remove : null)
            }}
            className={cn("group mb-2.5 flex items-center gap-1.5", message.mine && "flex-row-reverse")}
        >
            <p
                className={cn(
                    "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                    message.mine
                        ? "rounded-br-md bg-ui-accent text-white"
                        : "rounded-bl-md border border-ui-border bg-ui-bg text-ui-heading"
                )}
            >
                {message.text}
            </p>
            <button
                type="button"
                aria-label="Delete message"
                data-dissolve-ignore
                onClick={remove}
                className="grid size-7 cursor-pointer place-items-center rounded-md text-ui-hint opacity-0 transition hover:bg-ui-muted hover:text-red-500 group-hover:opacity-100 focus-visible:opacity-100"
            >
                <Trash2 className="size-3.5" />
            </button>
        </div>
    )
}

function Chips<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (v: T) => void }) {
    return (
        <div className="flex items-center gap-1.5 text-xs text-ui-caption">
            {label}
            {options.map((option) => (
                <button
                    key={option}
                    type="button"
                    onClick={() => onChange(option)}
                    className={cn(
                        "h-7 cursor-pointer rounded-full border px-2.5 capitalize transition-colors",
                        value === option ? "border-ui-heading bg-ui-heading text-ui-bg" : "border-ui-border hover:text-ui-heading"
                    )}
                >
                    {option}
                </button>
            ))}
        </div>
    )
}

export function ParticleDissolveDemo() {
    const [messages, setMessages] = useState(MESSAGES)
    const [fileShown, setFileShown] = useState(true)
    const [round, setRound] = useState(0)
    const [from, setFrom] = useState<DissolveFrom>("left")
    const [wind, setWind] = useState<keyof typeof WINDS>("rise")
    const [chunky, setChunky] = useState(false)
    const runs = useRef(new Map<number, () => Promise<void>>())
    const file = useDissolve<HTMLDivElement>()

    const options: DissolveOptions = { from, wind: [...WINDS[wind]], particleSize: chunky ? 4 : 2 }
    const gone = (id: number) => setMessages((list) => list.filter((m) => m.id !== id))
    const clearAll = () =>
        [...runs.current.values()].forEach((run, i) => setTimeout(run, i * 140))
    const reset = () => {
        setMessages(MESSAGES)
        setFileShown(true)
        setRound((r) => r + 1)
    }

    return (
        <div className="flex w-full max-w-lg flex-col gap-5 self-start py-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Chips label="From" value={from} options={FROM} onChange={setFrom} />
                <Chips label="Wind" value={wind} options={Object.keys(WINDS) as (keyof typeof WINDS)[]} onChange={setWind} />
                <Chips label="Dust" value={chunky ? "chunky" : "fine"} options={["fine", "chunky"] as const} onChange={(v) => setChunky(v === "chunky")} />
            </div>

            <div key={round} className="rounded-2xl border border-ui-border bg-ui-subtle p-4">
                {messages.map((message) => (
                    <Row
                        key={message.id}
                        message={message}
                        options={options}
                        onGone={gone}
                        register={(id, run) => (run ? runs.current.set(id, run) : runs.current.delete(id))}
                    />
                ))}
                {messages.length === 0 && <p className="py-6 text-center text-sm text-ui-caption">Chat cleared.</p>}

                {fileShown && (
                    <div ref={file.ref} className="mt-1.5 flex max-w-xs items-center gap-3 rounded-xl border border-ui-border bg-ui-bg p-2.5 pr-2">
                        <span className="grid size-9 place-items-center rounded-lg bg-orange-500 text-[10px] font-bold text-white">PDF</span>
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-ui-heading">Q3-report.pdf</span>
                            <span className="block text-xs text-ui-caption">1.2 MB</span>
                        </span>
                        <button
                            type="button"
                            aria-label="Remove file"
                            data-dissolve-ignore
                            onClick={async () => {
                                await file.dissolve(options)
                                setFileShown(false)
                            }}
                            className="grid size-7 cursor-pointer place-items-center rounded-md text-ui-hint transition hover:bg-ui-muted hover:text-ui-heading"
                        >
                            <X className="size-3.5" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <button type="button" onClick={clearAll} className="btn btn-secondary h-8 text-xs">
                    <Trash2 className="size-3.5" /> Clear chat
                </button>
                <button type="button" onClick={reset} className="btn btn-secondary h-8 text-xs">
                    <RotateCcw className="size-3.5" /> Reset
                </button>
            </div>
        </div>
    )
}
