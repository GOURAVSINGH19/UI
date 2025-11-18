
import { MainNavItem, SidebarNavItem } from "@/types/nav"

interface DocsConfig {
    sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
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
                    title: "Input",
                    href: "/docs/components/input",
                    items: [],
                },
                {
                    title: "LogIn",
                    href: "/docs/components/login",
                    items: [],
                },
                {
                    title: "Menu",
                    href: "/docs/components/menu",
                    items: [],
                },
                {
                    title: "Slidecard",
                    href: "/docs/components/slidecard",
                    items: [],
                },
            ],
        },
    ],
}
