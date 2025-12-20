
import { docsConfig } from "@/config/docs"
import { DocsSidebarNav } from "@/components/Sidenav"
import { cn } from "@workspace/ui/lib/utils"

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="border-b pt-10 md:pt-7">
      <div className="flex-1 items-start px-2 sm:px-4 md:grid md:grid-cols-[150px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-1 pt-4">
        <aside
          className={cn(
            " top-14 z-30 -ml-2 hidden w-full shrink-0 sticky md:block",
            "h-[calc(100svh)]"
          )}
        >
          <div className="h-full overflow-y-auto py-6 pr-2 lg:py-8">
            <DocsSidebarNav
              items={docsConfig.sidebarNav}
              className="text-white"
            />
          </div>
        </aside>
        {children}
      </div>
    </div>
  )
}


