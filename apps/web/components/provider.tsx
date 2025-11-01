"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    const pathname = usePathname()
    const forcedThemeFromPathname = pathname === "/" ? "light" : undefined
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            forcedTheme={forcedThemeFromPathname}
            enableSystem
            disableTransitionOnChange
            enableColorScheme
            {...props}
        >
            {children}
        </NextThemesProvider>
    )
}