import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

interface ProgressProps {
    value: number
    className?: string
}

export function Progress({ value, className }: ProgressProps) {
    return (
        <div className={cn("w-full bg-neutral-400 rounded-full h-3 flex justify-start items-center", className)}>
            <div
                className="bg-[var(--bg-light)] m-[.2em] to-blue-600 h-[.4em] rounded-full transition-all"
                style={{ width: `${value}%` }}
            />
        </div>
    )
}
