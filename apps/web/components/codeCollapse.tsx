"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/ui/collapsible"
import { Separator } from "@workspace/ui/components/ui/separator"

export function CodeCollapsibleWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible>) {
  const [isOpened, setIsOpened] = React.useState(false)

  return (
    <Collapsible
      open={isOpened}
      onOpenChange={setIsOpened}
      className={cn("group/collapsible relative md:-mx-1", className)}
      {...props}
    >
      <CollapsibleTrigger asChild>
        <div className="absolute top-1.5 right-9 z-10 flex items-center">
          <Button
            size="sm"
            className="text-muted-foreground h-7 rounded-md px-2"
          >
            {isOpened ? "Collapse" : "Expand"}
          </Button>
          <Separator orientation="vertical" className="mx-1.5 !h-4" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent
        forceMount
        className="relative overflow-hidden data-[state=closed]:max-h-80 [&>figure]:mt-0 [&>figure]:md:!mx-0"
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}