export type GooSearchItem = {
  title: string
  href: string
  category: string
  keywords?: string
  external?: boolean
}

export type GooSearchProps = {
  items: GooSearchItem[]
  onOpen: (item: GooSearchItem) => void
  onClose?: () => void
  linkResults?: boolean
  linkAs?: React.ElementType
  placeholder?: string
  initialQuery?: string
  maxResultsHeight?: number
  compact?: boolean
  label?: string
  className?: string
}

export const REST_GAP = 14
export const SPRING = { type: "spring", stiffness: 320, damping: 32, mass: 0.9 } as const
export const GOO_SPRING = { type: "spring", stiffness: 180, damping: 15, mass: 0.1 } as const
