import { cn } from "@workspace/ui/lib/utils"

/** Small pill from a component's `badge` frontmatter, e.g. "New". */
export function ComponentBadge({ label, className }: { label?: string; className?: string }) {
    if (!label) return null
    return (
        <span
            className={cn(
                "inline-flex shrink-0 items-center rounded-full bg-emerald-100 px-1.5 py-px text-[10px] leading-4 font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
                className
            )}
        >
            {label}
        </span>
    )
}
