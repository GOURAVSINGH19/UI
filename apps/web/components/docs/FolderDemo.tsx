"use client"

import { Folder } from "@workspace/ui/components/ui/folder"

const VARIANTS = [
    { name: "Blue", color: "#5b8def", flap: ["#7aa5f7", "#6495f2"] as [string, string] },
    { name: "Amber", color: "#e0a030", flap: ["#f3c25e", "#eab14a"] as [string, string] },
    { name: "Sage", color: "#5f8f6a", flap: ["#86b391", "#719f7c"] as [string, string] },
]

export function FolderDemo() {
    return (
        <div className="flex w-full flex-wrap items-end justify-center gap-10 py-14">
            {VARIANTS.map((variant) => (
                <figure key={variant.name} className="flex flex-col items-center gap-4">
                    <Folder color={variant.color} flap={variant.flap} className="h-40 w-40" />
                    <figcaption className="text-xs text-ui-caption">{variant.name}</figcaption>
                </figure>
            ))}
        </div>
    )
}
