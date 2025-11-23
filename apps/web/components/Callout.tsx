import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/ui/alert"
import { Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface CalloutProps {
  icon?: string
  title?: string
  type?: "default" | "info" | "warning" | "error" | "success"
  children?: React.ReactNode
}

const calloutVariants = {
  default: "bg-background text-foreground border-border",
  info: "bg-blue-500/10 border-blue-500/50 text-blue-600 dark:text-blue-400 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
  warning: "bg-yellow-500/10 border-yellow-500/50 text-yellow-600 dark:text-yellow-400 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400",
  error: "bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
  success: "bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
}

const defaultIcons = {
  default: null,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle2,
}

export function Callout({ title, children, icon, type = "default", ...props }: CalloutProps) {
  const IconComponent = icon ? null : defaultIcons[type]
  const variant = type === "error" ? "destructive" : undefined
  
  return (
    <Alert 
      variant={variant}
      className={cn(calloutVariants[type], "my-4")}
      {...props}
    >
      {icon ? (
        <span className="mr-2 text-lg">{icon}</span>
      ) : IconComponent && (
        <IconComponent className="h-4 w-4" />
      )}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}