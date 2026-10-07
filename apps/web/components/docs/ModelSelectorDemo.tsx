"use client"

import { useState } from "react"
import { ModelSelector, type ModelOption } from "@workspace/ui/components/ui/model-selector/index"

const MODELS: ModelOption[] = [
    { id: "kinetik-2", name: "Kinetik 2", description: "Our smartest model for everyday work", badge: "New", color: "#7c5cff" },
    { id: "kinetik-pro", name: "Kinetik Pro", description: "Deep reasoning for complex problems", badge: "Pro", color: "#f97316" },
    { id: "kinetik-fast", name: "Kinetik Fast", description: "Quick answers, lower cost", color: "#06b6d4" },
    { id: "kinetik-mini", name: "Kinetik Mini", description: "Lightweight, runs on device", color: "#22c55e" },
    { id: "kinetik-vision", name: "Kinetik Vision", description: "Coming soon", color: "#ec4899", disabled: true },
]

export function ModelSelectorDemo() {
    const [model, setModel] = useState("kinetik-2")
    const [thinking, setThinking] = useState(false)

    return (
        <div className="flex h-[440px] w-full flex-col items-center gap-3 pt-10">
            <ModelSelector
                models={MODELS}
                value={model}
                onValueChange={setModel}
                thinking={thinking}
                onThinkingChange={setThinking}
            />
        </div>
    )
}
