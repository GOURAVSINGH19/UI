"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@workspace/ui/lib/utils"

// Icons swap via the `dark:` variant rather than resolvedTheme, so the server
// render and the first client render match (no hydration flash).
export function ThemeToggle({ className }: { className?: string }) {
    const { resolvedTheme, setTheme } = useTheme()

    return (
        <button
            type="button"
            aria-label="Toggle theme"
            data-cuelume-toggle
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className={cn(
                "relative inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-ui-secondary transition-colors hover:bg-ui-muted hover:text-ui-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ui-border",
                className
            )}
        >
            <Sun className="size-4 scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute size-4 scale-0 rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0" />
        </button>
    )
}
