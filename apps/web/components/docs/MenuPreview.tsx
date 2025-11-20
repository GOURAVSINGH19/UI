"use client"

import { DocsSidebarNav } from "@/components/Sidenav"
import type { SidebarNavItem } from "@/types/nav"
import { cn } from "@workspace/ui/lib/utils"

const demoNav: SidebarNavItem[] = [
  {
    title: "Workspace",
    items: [
      { title: "Overview", href: "*", items: [] },
      { title: "Activity", href: "*", items: [] },
      {
        title: "Security",
        href: "*",
        label: "updated",
        items: [],
      },
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
    ],
  },
]

export function MenuPreview({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-lg rounded-2xl ring-1 bg-white p-6 shadow-[10px_8px_1px_1px_#121212]", className)}>
      <DocsSidebarNav items={demoNav} />
    </div>
  )
}

