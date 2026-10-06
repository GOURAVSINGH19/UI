"use client"

import { useId } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ChevronRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface TreeNavItem {
    key: string
    label: React.ReactNode
    href: string
    active?: boolean
    /** Extra content after the label, e.g. a badge. */
    trailing?: React.ReactNode
}

/*
 * Each row is a fixed 32px tall and draws its own piece of the tree in a
 * 24×32 SVG, so curves stay crisp and line up exactly from row to row:
 *
 *   x = 7.5   the rail (also the centre of the root icon)
 *   y = 16    the row's centre, where the branch lands
 *   r = 6     corner radius of the branch
 */
const ROW_H = 32
const RAIL = 7.5
const MID = ROW_H / 2
const R = 6
const ON = "var(--ui-accent)"
const OFF = "var(--ui-border-strong)"

const stroke = "transition-[stroke] duration-300"

/**
 * Tree-style navigation: a root row, a vertical rail, and one curved branch per
 * item. The rail lights up from the root down to the active item. Pass `open` +
 * `onOpenChange` to make the root a button that folds the branches away.
 */
export function TreeNav({
    root,
    items,
    linkAs: LinkComponent = "a",
    className,
    open,
    onOpenChange,
}: {
    /** Root row. Put a 15px icon first so the rail starts under its centre. */
    root?: React.ReactNode
    items: TreeNavItem[]
    /** Component for the links, e.g. Next's `Link`. Defaults to `<a>`. */
    linkAs?: React.ElementType
    className?: string
    /** Controlled open state; makes the tree collapsible when set with `onOpenChange`. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
}) {
    const activeIndex = items.findIndex((item) => item.active)
    const anyActive = activeIndex >= 0
    const collapsible = open !== undefined && onOpenChange !== undefined
    const expanded = !collapsible || open
    const listId = useId()
    const reduceMotion = useReducedMotion()

    const rootRail = items.length > 0 && (
        // Joins the root icon to the first row's rail.
        <span
            aria-hidden
            className="absolute top-[calc(50%+9px)] bottom-0 left-[7px] w-px transition-[background-color,opacity] duration-300"
            style={{ background: anyActive ? ON : OFF, opacity: expanded ? 1 : 0 }}
        />
    )

    return (
        <div className={className}>
            {root && collapsible && (
                <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={listId}
                    data-press="off"
                    onClick={() => onOpenChange(!expanded)}
                    className="group/root relative flex h-8 w-full cursor-pointer items-center gap-2 rounded-sm text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ui-border"
                >
                    {root}
                    <ChevronRight
                        aria-hidden
                        className={cn(
                            "size-3.5 shrink-0 text-ui-hint transition-transform duration-300 ease-out group-hover/root:text-ui-heading",
                            expanded && "rotate-90"
                        )}
                    />
                    {rootRail}
                </button>
            )}
            {root && !collapsible && (
                <div className="relative flex h-8 items-center gap-2 text-sm">
                    {root}
                    {rootRail}
                </div>
            )}

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.ul
                        key="items"
                        id={listId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={reduceMotion ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        {items.map((item, i) => {
                            const isActive = i === activeIndex
                            const isLast = i === items.length - 1
                            const aboveLit = anyActive && i <= activeIndex
                            const belowLit = anyActive && i < activeIndex

                            return (
                                <li key={item.key} className="relative">
                                    <svg
                                        aria-hidden
                                        width={24}
                                        height={ROW_H}
                                        viewBox={`0 0 24 ${ROW_H}`}
                                        fill="none"
                                        className="pointer-events-none absolute top-0 left-0"
                                    >
                                        <path d={`M${RAIL} 0V${MID - R}`} strokeWidth={1} className={stroke} style={{ stroke: aboveLit ? ON : OFF }} />
                                        {!isLast && (
                                            <path d={`M${RAIL} ${MID - R}V${ROW_H}`} strokeWidth={1} className={stroke} style={{ stroke: belowLit ? ON : OFF }} />
                                        )}
                                        <path
                                            d={`M${RAIL} ${MID - R}Q${RAIL} ${MID} ${RAIL + R} ${MID}H${RAIL + R + 4}`}
                                            strokeWidth={isActive ? 1.5 : 1}
                                            strokeLinecap="round"
                                            className={stroke}
                                            style={{ stroke: isActive ? ON : OFF }}
                                        />
                                        <circle
                                            cx={RAIL + R + 6}
                                            cy={MID}
                                            r={2.5}
                                            className="transition-opacity duration-300"
                                            style={{ fill: ON, opacity: isActive ? 1 : 0 }}
                                        />
                                    </svg>
                                    <LinkComponent
                                        href={item.href}
                                        aria-current={isActive ? "location" : undefined}
                                        className={cn(
                                            "flex h-8 min-w-0 items-center gap-2 pl-7 text-sm transition-colors",
                                            isActive ? "font-medium text-ui-heading" : "text-ui-caption hover:text-ui-heading"
                                        )}
                                    >
                                        <span className="truncate">{item.label}</span>
                                        {item.trailing}
                                    </LinkComponent>
                                </li>
                            )
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}
