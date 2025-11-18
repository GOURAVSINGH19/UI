"use client"

import { useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { cn } from "@workspace/ui/lib/utils"

const variants: Array<React.ComponentProps<typeof Button>["variant"]> = [
    "default",
    "outline",
    "ghost",
    "secondary",
    "destructive",
]

const Size: Array<React.ComponentProps<typeof Button>["size"]> = [
    "default",
    "sm",
    "lg",
    "icon"
]

export function ButtonVariantPlayground() {
    const [variant, setVariant] =
        useState<React.ComponentProps<typeof Button>["variant"]>("default")
    const [size, setSize] = useState<React.ComponentProps<typeof Button>['size']>("default")

    return (
        <div className="flex w-full h-full flex-col gap-6 text-sm p-4">
            <div className="flex flex-wrap gap-2">
                <div className="flex flex-wrap gap-2">
                    {variants.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => setVariant(option)}
                            className={cn(
                                "rounded-full border cursor-pointer px-4 py-1 capitalize text-xs tracking-wider transition-colors",
                                option === variant
                                    ? "border-transparent bg-white text-neutral-900 shadow"
                                    : "border-white/20 text-neutral-200 hover:border-white/60"
                            )}
                            aria-pressed={option === variant}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <div className="w-[.5px] border border-zinc-800 bg-[var(--bg-light)]"></div>
                <div className="flex flex-wrap gap-2">
                    {
                        Size.map((option) => (
                            <button
                                className={cn(
                                    "rounded-full border cursor-pointer px-4 py-1 capitalize text-xs tracking-wider transition-colors",
                                    option === size
                                        ? "border-transparent bg-white text-neutral-900 shadow"
                                        : "border-white/20 text-neutral-200 hover:border-white/60"
                                )}
                                key={option}
                                type="button"
                                onClick={() => setSize(option)}
                                aria-pressed={option === size}
                            >
                                {option}
                            </button>
                        ))
                    }</div>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xs p-8 text-center">
                <Button variant={variant} size={size} className="mt-4 capitalize">
                    {variant}
                </Button>
            </div>
        </div>
    )
}

