
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
                    items: [
                        {
                            title: "Button",
                            href: "/docs/components/button",
                            items: [],
                        },
                    ],
                },
                {
                    title: "Cards",
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
                            href: "/docs/components/animate",
                            items: [],
                        }
                    ],
                },
            ],
        },
    ],
}
