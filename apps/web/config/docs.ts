
import { MainNavItem, SidebarNavItem } from "@/types/nav"

type CodeThemeName = "default" | "min" | "vitesse" | "slack" | "nord" | "dracula" | "one-dark-pro" | "catppuccin"

interface DocsConfig {
    sidebarNav: SidebarNavItem[]
    codeTheme?: CodeThemeName
}

export const docsConfig: DocsConfig = {
    codeTheme: (process.env.CODE_THEME as CodeThemeName) || "nord",
    sidebarNav: [
        {
            title: "Getting Started",
            items: [
                {
                    title: "Introduction",
                    href: "/docs",
                    items: []
                },
                {
                    title: "Installation",
                    href: "/docs/installation",
                    items: [],
                }
            ],

        },
        {
            title: "Components",
            items: [
                {
                    title: "Buttons",
                    href: "/docs/components/button",
                    items: []
                },
                {
                    title: "Menu",
                    href: "/docs/components/menu",
                    items: [],
                },
                {
                    title: "SlideBar",
                    href: "/docs/components/bar",
                    items: []
                },
                {
                    title: "Slidecard",
                    href: "/docs/components/slidecard",
                    items: [],
                },
            ],
        },
        {
            title: "Charts",
            items: [
                {
                    title: "Bar Chart",
                    href: "/docs/charts/barchart",
                    items: []
                }
            ]
        }
    ],
}
