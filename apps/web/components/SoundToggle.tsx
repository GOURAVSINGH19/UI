"use client"

import { useSyncExternalStore } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { cue, getSoundEnabled, setSoundEnabled, subscribeSound } from "@/lib/sound"

/** Navbar switch for UI sounds; the choice is remembered in localStorage. */
export function SoundToggle({ className }: { className?: string }) {
    // Server render assumes on; the client syncs from storage after hydration.
    const enabled = useSyncExternalStore(subscribeSound, getSoundEnabled, () => true)

    return (
        <button
            type="button"
            aria-label={enabled ? "Mute interface sounds" : "Unmute interface sounds"}
            aria-pressed={enabled}
            data-sound="off"
            onClick={() => {
                const next = !enabled
                setSoundEnabled(next)
                // Confirm by ear when turning on; turning off stays silent.
                if (next) cue("toggle")
            }}
            className={cn(
                "inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-ui-secondary transition-colors hover:bg-ui-muted hover:text-ui-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ui-border",
                className
            )}
        >
            {enabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
        </button>
    )
}
