import { SidebarNavItem } from "@/types/nav"
import { IconCube, IconFile, IconFolders, IconSquareChartLine, IconStarSparkle } from "nucleo-glass"
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
                    href: "/docs/introduction",
                    items: []
                },
                {
                    title: "Installation",
                    href: "/docs/installation",
                    items: [],
                },
                {
                    title: "Style",
                    href: "/docs/style/style",
                    items: [],
                    icon: <IconStarSparkle size={14} />
                }
            ],
        },
        {
            title: "Components",
            items: [
                {
                    title: "BounceTextReveal",
                    href: "/docs/components/BounceTextReveal",
                    items: []
                },
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
                {
                    title: "SliderScore",
                    href: "/docs/components/SliderScore",
                    items: [],
                },
                {
                    title: "Topup",
                    href: "/docs/components/Topup",
                    items: [],
                },
                {
                    title: "Uploader",
                    href: "/docs/components/Upload",
                    items: []
                },
            ],
            icon: <IconFolders size={16} />
        },
        {
            title: "Charts",
            items: [
                {
                    title: "Activity Chart",
                    href: "/docs/charts/activitychart",
                    items: []
                },
            ],
            icon: <IconSquareChartLine size={16} />
        },
        {
            title: "ScrollAnimation",
            items: [
                {
                    title: "Template 1",
                    href: "/docs/scrollanimation/template",
                    items: []
                },
            ],
            icon: <IconFile size={16} />
        }, {
            title: "3D",
            items: [
                {
                    title: "3D_Animation",
                    href: "/docs/THREE/ScrollAnimation",
                    items: []
                },
            ],
            icon: <IconCube size={16} />
        },
    ],
}
