export type SimpleSearchItem = {
  title: string
  group: string
  href?: string
  description?: string
  badge?: string
  keywords?: string
}

export type SimpleSearchProps = {
  items: SimpleSearchItem[]
  onSelect: (item: SimpleSearchItem) => void
  hotkey?: string | false
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
  showFilter?: boolean
  onFilterChange?: (group: string, direction: "forward" | "back") => void
  label?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & Record<`data-${string}`, string | boolean>
  triggerClassName?: string
}

export type ResultGroup = [group: string, items: Array<SimpleSearchItem & { index: number }>]

export const ease = [0.22, 1, 0.36, 1] as const
