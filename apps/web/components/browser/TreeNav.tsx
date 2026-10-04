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
 * item. The rail lights up from the root down to the active item.
 */
export function TreeNav({
    root,
    items,
    linkAs: LinkComponent = "a",
    className,
}: {
    /** Root row. Put a 15px icon first so the rail starts under its centre. */
    root?: React.ReactNode
    items: TreeNavItem[]
    /** Component for the links, e.g. Next's `Link`. Defaults to `<a>`. */
    linkAs?: React.ElementType
    className?: string
}) {
    const activeIndex = items.findIndex((item) => item.active)
    const anyActive = activeIndex >= 0

    return (
        <div className={className}>
            {root && (
                <div className="relative flex h-8 items-center gap-2 text-sm">
                    {root}
                    {/* Joins the root icon to the first row's rail. */}
                    {items.length > 0 && (
                        <span
                            aria-hidden
                            className="absolute top-[calc(50%+9px)] bottom-0 left-[7px] w-px transition-colors duration-300"
                            style={{ background: anyActive ? ON : OFF }}
                        />
                    )}
                </div>
            )}

            <ul>
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
                                {/* Rail from the row above down to where the curve starts. */}
                                <path d={`M${RAIL} 0V${MID - R}`} strokeWidth={1} className={stroke} style={{ stroke: aboveLit ? ON : OFF }} />
                                {/* Rail on to the next row. */}
                                {!isLast && (
                                    <path d={`M${RAIL} ${MID - R}V${ROW_H}`} strokeWidth={1} className={stroke} style={{ stroke: belowLit ? ON : OFF }} />
                                )}
                                {/* The branch: a quarter curve into the row, then a short tail. */}
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
            </ul>
        </div>
    )
}
