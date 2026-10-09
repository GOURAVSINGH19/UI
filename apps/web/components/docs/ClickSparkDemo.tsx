"use client"

import { useState } from "react"
import { ClickSpark, type ClickSparkBurst, type ClickSparkTrigger } from "@workspace/ui/components/ui/click-spark"
import { cn } from "@workspace/ui/lib/utils"
import { Chip } from "./ButtonVariantPlayground"

const COLORS: Array<{ name: string; value?: string }> = [
    { name: "Text colour", value: undefined },
    { name: "Sky", value: "#38bdf8" },
    { name: "Violet", value: "#a78bfa" },
    { name: "Emerald", value: "#34d399" },
    { name: "Amber", value: "#fbbf24" },
    { name: "Rose", value: "#fb7185" },
]

const BURSTS: ClickSparkBurst[] = ["lines", "curves", "dots", "ring", "stars"]
const TRIGGERS: Array<{ name: string; value: ClickSparkTrigger }> = [
    { name: "Click", value: "click" },
    { name: "Double click", value: "dblclick" },
]

function Slider({
    label,
    value,
    min,
    max,
    step = 1,
    unit = "",
    disabled = false,
    onChange,
}: {
    label: string
    value: number
    min: number
    max: number
    step?: number
    unit?: string
    disabled?: boolean
    onChange: (value: number) => void
}) {
    return (
        <>
            <span className="text-xs text-ui-caption">{label}</span>
            <div className={cn("flex items-center gap-3", disabled && "pointer-events-none opacity-40")}>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    aria-label={label}
                    className="h-1 w-40 cursor-pointer accent-[var(--ui-text-heading)]"
                />
                <span className="w-14 font-mono text-xs text-ui-heading tabular-nums">
                    {value}
                    {unit}
                </span>
            </div>
        </>
    )
}

export function ClickSparkDemo() {
    const [burst, setBurst] = useState<ClickSparkBurst>("lines")
    const [trigger, setTrigger] = useState<ClickSparkTrigger>("click")
    const [color, setColor] = useState<string | undefined>("#38bdf8")
    const [count, setCount] = useState(8)
    const [size, setSize] = useState(10)
    const [radius, setRadius] = useState(18)
    const [duration, setDuration] = useState(400)
    const [lineWidth, setLineWidth] = useState(2)
    const [sound, setSound] = useState(true)
    const [volume, setVolume] = useState(0.4)

    return (
        <div className="flex w-full flex-col gap-8 text-sm">
            <ClickSpark
                burst={burst}
                trigger={trigger}
                sparkColor={color}
                sparkCount={count}
                sparkSize={size}
                sparkRadius={radius}
                duration={duration}
                lineWidth={lineWidth}
                sound={sound}
                volume={volume}
                className="flex min-h-56 cursor-pointer items-center justify-center rounded-xl text-ui-heading"
            >
                <p className="text-sm text-ui-caption select-none">{trigger === "dblclick" ? "Double click anywhere" : "Click anywhere"}</p>
            </ClickSpark>

            <div className="grid gap-4 rounded-xl border border-ui-border bg-ui-bg p-4 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-x-6">
                <span className="text-xs text-ui-caption">Burst</span>
                <div className="flex flex-wrap gap-1.5">
                    {BURSTS.map((b) => (
                        <Chip key={b} active={b === burst} onClick={() => setBurst(b)}>
                            {b}
                        </Chip>
                    ))}
                </div>

                <span className="text-xs text-ui-caption">Trigger</span>
                <div className="flex flex-wrap gap-1.5">
                    {TRIGGERS.map((t) => (
                        <Chip key={t.value} active={t.value === trigger} onClick={() => setTrigger(t.value)}>
                            {t.name}
                        </Chip>
                    ))}
                </div>

                <span className="text-xs text-ui-caption">Colour</span>
                <div className="flex flex-wrap items-center gap-2">
                    {COLORS.map((c) => (
                        <button
                            key={c.name}
                            type="button"
                            onClick={() => setColor(c.value)}
                            aria-label={c.name}
                            aria-pressed={color === c.value}
                            title={c.name}
                            className={cn(
                                "size-6 cursor-pointer rounded-full border border-ui-border ring-offset-2 ring-offset-ui-bg transition-shadow",
                                color === c.value && "ring-2 ring-ui-heading",
                                !c.value && "bg-[conic-gradient(var(--ui-text-heading)_0_50%,var(--ui-bg)_0)]"
                            )}
                            style={c.value ? { background: c.value } : undefined}
                        />
                    ))}
                    <label className="relative flex h-6 cursor-pointer items-center gap-1.5 rounded-full border border-ui-border pr-2.5 pl-1 text-xs text-ui-secondary hover:border-ui-border-strong">
                        <span className="size-4 rounded-full border border-ui-border" style={{ background: color ?? "transparent" }} />
                        Custom
                        <input
                            type="color"
                            value={color ?? "#38bdf8"}
                            onChange={(e) => setColor(e.target.value)}
                            className="absolute inset-0 cursor-pointer opacity-0"
                            aria-label="Custom spark colour"
                        />
                    </label>
                </div>

                <Slider label="Count" value={count} min={3} max={20} onChange={setCount} />
                <Slider label="Size" value={size} min={2} max={30} unit="px" onChange={setSize} />
                <Slider label="Radius" value={radius} min={6} max={60} unit="px" onChange={setRadius} />
                <Slider label="Duration" value={duration} min={150} max={1200} step={50} unit="ms" onChange={setDuration} />
                <Slider label="Line width" value={lineWidth} min={1} max={6} step={0.5} unit="px" onChange={setLineWidth} />

                <span className="text-xs text-ui-caption">Sound</span>
                <div className="flex flex-wrap items-center gap-1.5">
                    <Chip active={sound} onClick={() => setSound(true)}>
                        On
                    </Chip>
                    <Chip active={!sound} onClick={() => setSound(false)}>
                        Off
                    </Chip>
                </div>

                <Slider label="Volume" value={volume} min={0.05} max={1} step={0.05} disabled={!sound} onChange={setVolume} />
            </div>
        </div>
    )
}
