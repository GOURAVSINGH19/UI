"use client"

import { DocsSidebarNav } from "@/components/Sidenav"
import type { SidebarNavItem } from "@/types/nav"
import { cn } from "@workspace/ui/lib/utils"

// Basic usage example
const basicNav: SidebarNavItem[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs", items: [] },
      { title: "Installation", href: "/docs/installation", items: [] },
    ],
  },
]

// With labels (new, recent, updated)
const labelsNav: SidebarNavItem[] = [
  {
    title: "Components",
    items: [
      { title: "Button", href: "/docs/components/button", items: [] },
      { title: "Input", href: "/docs/components/input", label: "new", items: [] },
      { title: "Menu", href: "/docs/components/menu", label: "updated", items: [] },
      { title: "Slidecard", href: "/docs/components/slidecard", label: "recent", items: [] },
    ],
  },
]

// With disabled items
const disabledNav: SidebarNavItem[] = [
  {
    title: "Features",
    items: [
      { title: "Active Feature", href: "/docs/features/active", items: [] },
      { title: "Coming Soon", href: "/docs/features/coming-soon", disabled: true, items: [] },
      { title: "Under Maintenance", href: "/docs/features/maintenance", disabled: true, items: [] },
    ],
  },
]

// With external links
const externalNav: SidebarNavItem[] = [
  {
    title: "Resources",
    items: [
      { title: "Documentation", href: "/docs", items: [] },
      { title: "GitHub", href: "https://github.com", external: true, items: [] },
      { title: "Discord", href: "https://discord.com", external: true, items: [] },
    ],
  },
]

// With nested items (multi-level)
const nestedNav: SidebarNavItem[] = [
  {
    title: "Guides",
    items: [
      {
        title: "Getting Started",
        items: [
          { title: "Quick Start", href: "/docs/guides/quick-start", items: [] },
          { title: "Configuration", href: "/docs/guides/configuration", items: [] },
        ],
      },
      {
        title: "Advanced",
        items: [
          { title: "Customization", href: "/docs/guides/customization", items: [] },
          { title: "Best Practices", href: "/docs/guides/best-practices", items: [] },
        ],
      },
    ],
  },
]

// Complete example with all properties
const completeNav: SidebarNavItem[] = [
  {
    title: "Workspace",
    items: [
      { title: "Overview", href: "/workspace/overview", items: [] },
      { title: "Activity", href: "/workspace/activity", label: "recent", items: [] },
      {
        title: "Security",
        href: "/workspace/security",
        label: "updated",
        items: [],
      },
      { title: "Settings", href: "/workspace/settings", items: [] },
      { title: "Beta Feature", href: "/workspace/beta", disabled: true, items: [] },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Buttons", href: "/docs/components/button", items: [] },
      { title: "Input", href: "/docs/components/input", items: [] },
      {
        title: "Slidecard",
        href: "/docs/components/slidecard",
        label: "new",
        items: [],
      },
      {
        title: "Advanced",
        items: [
          { title: "Custom Components", href: "/docs/components/custom", items: [] },
          { title: "External Docs", href: "https://example.com", external: true, items: [] },
        ],
      },
    ],
  },
  {
    title: "External Links",
    items: [
      { title: "GitHub", href: "https://github.com", external: true, items: [] },
      { title: "Documentation", href: "https://docs.example.com", external: true, label: "updated", items: [] },
    ],
  },
]

export function SidebarUsageBasic() {
  return (
    <div className={cn("w-full max-w-lg rounded-2xl ring-1 bg-white p-6")}>
      <DocsSidebarNav items={basicNav} />
    </div>
  )
}

export function SidebarUsageLabels() {
  return (
    <div className={cn("w-full max-w-lg rounded-2xl ring-1 bg-white p-6")}>
      <DocsSidebarNav items={labelsNav} />
    </div>
  )
}


export function SidebarUsageNested() {
  return (
    <div className={cn("w-full max-w-lg rounded-2xl ring-1 bg-white p-6")}>
      <DocsSidebarNav items={nestedNav} />
    </div>
  )
}

export function SidebarUsageComplete() {
  return (
    <div className={cn("w-full max-w-lg rounded-2xl ring-1 bg-white p-6")}>
      <DocsSidebarNav items={completeNav} />
    </div>
  )
}

