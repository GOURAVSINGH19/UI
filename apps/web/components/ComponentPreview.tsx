"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/ui/tabs"

export function ComponentPreviewTabs({
  className,
  align = "center",
  hideCode = false,
  component,
  source,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "center" | "start" | "end"
  hideCode?: boolean
  component: React.ReactNode
  source: React.ReactNode
  className?: string
}) {

  const [tab, setTab] = React.useState("preview")

  return (
    <div
      className={cn("relative mt-4 mb-12 flex flex-col gap-2 w-full", className)}
      {...props}
    >
      <Tabs
        className="relative mr-auto w-full"
        value={tab}
        onValueChange={setTab}
      >
        <div className="flex items-center justify-between">
          {!hideCode && (
            <TabsList>
              <TabsTrigger className="cursor-pointer" value="preview">Preview</TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="code">Code</TabsTrigger>
            </TabsList>
          )}
        </div>
      </Tabs>
      <div
        data-tab={tab}
        className="data-[tab=code]:border-code relative rounded-xl border md:-mx-1"
      >
        {
          tab === "preview" ? (
            <div
              data-slot="preview"
              data-active={tab === "preview"}
              className="invisible data-[active=true]:visible"
            >
              <div
                data-align={align}
                className={cn(
                  "preview flex overflow-y-auto min-h-80 relative w-full justify-center p-2 lg:p-10 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start overflow-hidden "
                )}
              >
                {component}
              </div>
            </div>
          ) :
            <div
              data-slot="code"
              data-active={tab === "code"}
              className="overflow-auto data-[active=true]:block bg-[var(--bg)] rounded-lg p-4"
            >
              {source}
            </div>
        }
      </div>
    </div>
  )
}