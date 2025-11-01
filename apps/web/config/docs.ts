
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
                    title: "Installation",
                    href: "/docs/installation",
                    items: [],
                },
            ],
        },
        {
            title: "Components",
            items: [
                {
                    title: "Buttons & Controls",
                    items: [
                        {
                            title: "Button",
                            href: "/docs/components/button",
                            items: [],
                        },
                    ],
                },
                {
                    title: "Cards & Containers",
                    items: [
                        {
                            title: "Expandable Card",
                            href: "/docs/components/expandable",
                            items: [],
                        },
                    ],
                },
                {
                    title: "Interactive Elements",
                    items: [
                        {
                            title: "Dynamic Island",
                            href: "/docs/components/button",
                            items: [],
                        }
                    ],
                },
            ],
        },
    ],
}
