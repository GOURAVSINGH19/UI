'use client'

import React, { useLayoutEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { cn } from "@workspace/ui/lib/utils"


type NavItem = {
    id: string
    title: string
    href?: string
    icon?: React.ReactNode
}

export interface NavbarLinksProps {
    items?: NavItem[]
    className?: string
    initialActive?: string
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({ items = [], className, initialActive = "home" }) => {
    const [active, setActive] = useState<string>(initialActive ?? items?.[0]?.id ?? "")
    const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [indicator, setIndicator] = useState({ width: 0, left: 0 })

    useLayoutEffect(() => {
        const el = itemRefs.current[active]
        const container = containerRef.current

        if (el && container) {
            const elRect = el.getBoundingClientRect()
            const parentRect = container.getBoundingClientRect()

            setIndicator({
                width: elRect.width,
                left: elRect.left - parentRect.left,
            })
        } else {
            setIndicator({ width: 0, left: 0 })
        }
    }, [active, items])

    return (
        <div className={cn("relative mt-10 flex justify-center", className)}>
            <div
                ref={containerRef}
                className="relative flex space-x-4 bg-[var(--bg)] shadow-[inset_0_.5px_.5px_#ffffff30,0_1px_2px_2px_#00000030,0_2px_2px_#00000015] px-2 py-1 rounded-sm"
            >
                <motion.div
                    className="absolute top-1 bottom-1 bg-[var(--bg-light)] shadow-[inset_0_.5px_.5px_#ffffff30,0_1px_2px_2px_#00000030,0_2px_2px_#00000015] rounded-sm z-0"
                    animate={{ width: indicator.width, left: indicator.left }}
                    transition={{ type: "spring", stiffness: 100, damping: 30 }}
                    style={{ position: "absolute" }}
                />

                {items.map((item) => (
                    <div
                        key={item.id}
                        ref={(el) => { itemRefs.current[item.id] = el; }}
                        onClick={() => setActive(item.id)}
                        className={cn(
                            "relative flex items-center gap-2 z-10 cursor-pointer px-3 py-1 text-sm font-medium select-none transition-colors",
                            active === item.id ? "text-neutral-300" : "text-gray-400"
                        )}
                    >
                        {item.icon && <span>{item.icon}</span>}
                        {item.href ? (
                            <Link href={item.href} className="z-10">
                                {item.title}
                            </Link>
                        ) : (
                            <span className="z-10">{item.title}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NavbarLinks
