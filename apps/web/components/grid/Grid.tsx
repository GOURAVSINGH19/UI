import { cn } from "@workspace/ui/lib/utils"

export function GridCross({ className }: { className?: string }) {
    return (
        <span
            aria-hidden
            className={cn(
                "pointer-events-none absolute z-10 hidden size-[9px] md:block",
                "before:absolute before:top-0 before:left-1/2 before:h-full before:w-px before:-translate-x-1/2 before:bg-[var(--ui-grid-cross)]",
                "after:absolute after:top-1/2 after:left-0 after:h-px after:w-full after:-translate-y-1/2 after:bg-[var(--ui-grid-cross)]",
                className
            )}
        />
    )
}

/** Vertical rails around a centred column. Rails show from md up. */
export function GridFrame({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("relative mx-auto w-full grid-line md:border-x", className)}>
            {children}
        </div>
    )
}

/**
 * One row of the grid: a line along the bottom edge, with "+" marks where it
 * meets the rails. Set `top` to also draw the line above.
 */
export function GridSection({
    children,
    className,
    id,
    top = false,
    as: Tag = "section",
}: {
    children: React.ReactNode
    className?: string
    id?: string
    top?: boolean
    as?: "section" | "header" | "footer" | "div" | "nav"
}) {
    return (
        <Tag id={id} className={cn("relative grid-line border-b", top && "border-t", className)}>
            {top && (
                <>
                    <GridCross className="-top-[4px] -left-[5px]" />
                    <GridCross className="-top-[4px] -right-[5px]" />
                </>
            )}
            {children}
            <GridCross className="-bottom-[4px] -left-[5px]" />
            <GridCross className="-right-[5px] -bottom-[4px]" />
        </Tag>
    )
}
