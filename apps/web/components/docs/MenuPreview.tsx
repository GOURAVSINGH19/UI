"use client"

import { DocsSidebarNav } from "@/components/Sidenav"
import type { SidebarNavItem } from "@/types/nav"

const demoNav: SidebarNavItem[] = [
  {
    title: "Workspace",
    items: [
      { title: "Overview", href: "/docs/workspace/overview", items: [] },
      { title: "Activity", href: "/docs/workspace/activity", items: [] },
      {
        title: "Security",
        href: "/docs/workspace/security",
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

export function MenuPreview() {
  return (
    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-white">
      <DocsSidebarNav items={demoNav} />
    </div>
  )
}

