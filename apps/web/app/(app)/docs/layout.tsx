
import { docsConfig } from "@/config/docs"
import { DocsSidebarNav } from "@/components/Sidenav"

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="border-b pt-10 md:pt-8">
      <div className="flex-1 items-start bg-[#FAFAFA] px-2 dark:bg-[var(--bg)] sm:px-4 md:grid md:grid-cols-[150px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-1 pt-4">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-9rem)] w-full shrink-0 md:sticky md:block rounded-md">
          <div className="h-full py-6 pr-2 lg:py-8 overflow-y-auto">
            <DocsSidebarNav items={docsConfig.sidebarNav} className="text-white" />
          </div>
        </aside>
        {children}
      </div>
    </div>
  )
}
