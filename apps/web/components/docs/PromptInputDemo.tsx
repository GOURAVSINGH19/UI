"use client"

import { useState } from "react"
import { PromptInput } from "@workspace/ui/components/ui/prompt-input/index"

const wait = (ms: number, signal: AbortSignal) =>
    new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, ms)
        signal.addEventListener("abort", () => {
            clearTimeout(timer)
            resolve()
        })
    })

export function PromptInputDemo() {
    const [status, setStatus] = useState("Click the input to open it up.")

    return (
        <div className="flex h-[420px] w-full flex-col items-center gap-4 pt-16">
            <PromptInput
                expandedWidth={560}
                onSubmit={async (value, { attachments, model, signal }) => {
                    const files = attachments.length ? ` with ${attachments.length} file${attachments.length > 1 ? "s" : ""}` : ""
                    setStatus(`Running “${value || "…"}”${files} on ${model}`)
                    await wait(3200, signal)
                    setStatus(signal.aborted ? "Stopped." : "Done. Ask something else.")
                }}
            />
            <p role="status" className="px-1 text-xs text-ui-caption">
                {status}
            </p>
        </div>
    )
}
