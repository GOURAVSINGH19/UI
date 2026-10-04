"use client"

import { Github } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import { ThemeToggle } from "./ThemeToggle"
import { CommandSearch } from "./search/CommandSearch"
import { GridCross } from "./grid/Grid"
import type { ComponentEntry } from "@/lib/component-groups"

const Navbar = ({ components }: { components: ComponentEntry[] }) => {
    // On the home page the grid rails continue up through the navbar.
    const onHome = usePathname() === "/"

    return (
        <header className="fixed inset-x-0 top-0 z-50 grid-line border-b bg-ui-bg/80 text-sm backdrop-blur-md">
            {/* Same centered column as the home page frame. */}
            <nav className={cn(
                "relative mx-auto flex h-14 w-full max-w-[var(--ui-frame-width)] items-center justify-between gap-6 px-gutter md:px-[var(--ui-frame-pad)]",
                onHome && "grid-line md:border-x"
            )}>
                {onHome && (
                    <>
                        {/* The header's bottom border sits just below the nav box. */}
                        <GridCross className="-bottom-[5px] -left-[5px]" />
                        <GridCross className="-right-[5px] -bottom-[5px]" />
                    </>
                )}
                <Link href="/" className="font-serif text-xl leading-none text-ui-heading">
                    Uiin
                </Link>

                <div className="flex items-center gap-1.5">
                    <CommandSearch components={components} />

                    <Link
                        href="https://github.com/GOURAVSINGH19/UI"
                        target="_blank"
                        aria-label="GitHub"
                        className="inline-flex size-8 items-center justify-center rounded-full text-ui-secondary transition-colors hover:bg-ui-muted hover:text-ui-heading"
                    >
                        <Github className="size-4" />
                    </Link>
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    )
}
export default Navbar
