"use client"

import { useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@workspace/ui/components/ui/button/index"
import { cn } from "@workspace/ui/lib/utils"

type Variant = NonNullable<React.ComponentProps<typeof Button>["variant"]>
type Size = NonNullable<React.ComponentProps<typeof Button>["size"]>

const VARIANTS: Variant[] = ["default", "secondary", "outline", "ghost", "destructive"]
const SIZES: Size[] = ["sm", "default", "lg", "icon"]
const COLORS: Array<{ name: string; value?: string }> = [
    { name: "Text colour", value: undefined },
    { name: "Sky", value: "#38bdf8" },
    { name: "Violet", value: "#a78bfa" },
    { name: "Emerald", value: "#34d399" },
    { name: "Amber", value: "#fbbf24" },
    { name: "Rose", value: "#fb7185" },
]

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                "h-7 cursor-pointer rounded-full border px-3 text-xs capitalize transition-colors",
                active ? "border-ui-heading bg-ui-heading text-ui-bg" : "border-ui-border text-ui-secondary hover:border-ui-border-strong hover:text-ui-heading"
            )}
        >
            {children}
        </button>
    )
}

export function ButtonVariantPlayground() {
    const [variant, setVariant] = useState<Variant>("default")
    const [size, setSize] = useState<Size>("lg")
    const [flicker, setFlicker] = useState(true)
    const [color, setColor] = useState<string | undefined>("#38bdf8")
    const [squareSize, setSquareSize] = useState(3)

    return (
        <div className="flex w-full flex-col gap-8 text-sm">
            <div className="flex min-h-36 items-center justify-center">
                <Button variant={variant} size={size} flicker={flicker} flickerColor={color} flickerSize={squareSize} aria-label={size === "icon" ? "Sparkle" : undefined}>
                    {size === "icon" ? (
                        <Sparkles />
                    ) : (
                        <>
                            Hover me <ArrowRight />
                        </>
                    )}
                </Button>
            </div>

            <div className="grid gap-4 rounded-xl border border-ui-border bg-ui-bg p-4 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-x-6">
                <span className="text-xs text-ui-caption">Variant</span>
                <div className="flex flex-wrap gap-1.5">
                    {VARIANTS.map((v) => (
                        <Chip key={v} active={v === variant} onClick={() => setVariant(v)}>
                            {v}
                        </Chip>
                    ))}
                </div>

                <span className="text-xs text-ui-caption">Size</span>
                <div className="flex flex-wrap gap-1.5">
                    {SIZES.map((s) => (
                        <Chip key={s} active={s === size} onClick={() => setSize(s)}>
                            {s}
                        </Chip>
                    ))}
                </div>

                <span className="text-xs text-ui-caption">Flicker</span>
                <div className="flex flex-wrap items-center gap-1.5">
                    <Chip active={flicker} onClick={() => setFlicker(true)}>
                        On
                    </Chip>
                    <Chip active={!flicker} onClick={() => setFlicker(false)}>
                        Off
                    </Chip>
                </div>

                <span className="text-xs text-ui-caption">Flicker colour</span>
                <div className={cn("flex flex-wrap items-center gap-2", !flicker && "pointer-events-none opacity-40")}>
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
                            aria-label="Custom flicker colour"
                        />
                    </label>
                </div>

                <span className="text-xs text-ui-caption">Square size</span>
                <div className={cn("flex items-center gap-3", !flicker && "pointer-events-none opacity-40")}>
                    <input
                        type="range"
                        min={2}
                        max={8}
                        step={1}
                        value={squareSize}
                        onChange={(e) => setSquareSize(Number(e.target.value))}
                        aria-label="Flicker square size"
                        className="h-1 w-40 cursor-pointer accent-[var(--ui-text-heading)]"
                    />
                    <span className="w-9 font-mono text-xs text-ui-heading tabular-nums">{squareSize}px</span>
                </div>
            </div>
        </div>
    )
}
