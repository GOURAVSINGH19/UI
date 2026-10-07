"use client"

import * as React from "react"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@workspace/ui/lib/utils"
import { FlickeringGrid } from "./flickering-grid"

export const buttonVariants = cva(
  "relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-full border font-medium whitespace-nowrap outline-none transition-[color,background-color,border-color,box-shadow] duration-150 focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--ui-text-heading)_25%,transparent)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-[color-mix(in_oklch,var(--ui-bg-inverse),black_30%)] bg-ui-inverse bg-linear-to-b from-white/15 to-transparent text-ui-on-inverse shadow-[inset_0_1px_0_0_rgb(255_255_255/0.25)] hover:bg-[color-mix(in_oklch,var(--ui-bg-inverse),var(--ui-bg)_12%)] dark:border-[color-mix(in_oklch,var(--ui-bg-inverse),black_18%)] dark:from-transparent dark:from-55% dark:to-black/5 dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.9),inset_0_-1px_0_0_rgb(0_0_0/0.08)]",
        secondary:
          "border-[color-mix(in_oklch,var(--ui-text-heading)_15%,transparent)] bg-ui-subtle text-ui-secondary shadow-[inset_0_1px_0_0_rgb(255_255_255/0.7)] hover:bg-[color-mix(in_oklch,var(--ui-bg-subtle),var(--ui-text-heading)_5%)] hover:text-ui-heading dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08)]",
        outline: "border-ui-border bg-transparent text-ui-heading hover:border-ui-border-strong hover:bg-ui-subtle",
        ghost: "border-transparent bg-transparent text-ui-secondary hover:bg-ui-muted hover:text-ui-heading",
        destructive:
          "border-red-800 bg-red-600 bg-linear-to-b from-white/15 to-transparent text-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.25)] hover:bg-red-600/90",
        link: "border-transparent text-ui-heading underline-offset-4 hover:underline",
        primary:
          "border-[color-mix(in_oklch,var(--ui-text-heading)_15%,transparent)] bg-ui-subtle text-ui-secondary shadow-[inset_0_1px_0_0_rgb(255_255_255/0.7)] hover:bg-[color-mix(in_oklch,var(--ui-bg-subtle),var(--ui-text-heading)_5%)] hover:text-ui-heading dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08)]",
      },
      size: {
        default: "h-8 px-3.5 text-[13px]",
        sm: "h-7 gap-1 px-2.5 text-xs",
        lg: "h-10 px-5 text-sm",
        icon: "size-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>

const SPOTLIGHT = "radial-gradient(circle 70px at var(--flicker-x, 50%) var(--flicker-y, 50%), black, transparent)"

/** A flickering grid behind the label, masked to a spotlight that follows the pointer. */
export function FlickerLayer({
  visible,
  animating,
  color,
  size,
}: {
  visible: boolean
  animating: boolean
  color?: string
  size: number
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300 ease-out motion-reduce:hidden",
        visible ? "opacity-100" : "opacity-0"
      )}
      style={{ maskImage: SPOTLIGHT, WebkitMaskImage: SPOTLIGHT }}
    >
      <FlickeringGrid
        color={color}
        squareSize={size}
        gridGap={Math.max(1, Math.round(size * 0.6))}
        flickerChance={3}
        maxOpacity={0.7}
        active={animating}
      />
    </span>
  )
}

export type ButtonProps = React.ComponentProps<"button"> &
  ButtonVariantProps & {
    asChild?: boolean
    /** Show a flickering grid that follows the pointer on hover. */
    flicker?: boolean
    flickerColor?: string
    flickerSize?: number
  }

export function Button({
  className,
  variant,
  size,
  asChild = false,
  flicker = false,
  flickerColor,
  flickerSize = 3,
  children,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  ref,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  const [hovered, setHovered] = React.useState(false)
  const [animating, setAnimating] = React.useState(false)
  const fadeTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(fadeTimer.current), [])

  // The spotlight reads these CSS variables.
  const track = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty("--flicker-x", `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty("--flicker-y", `${e.clientY - rect.top}px`)
  }

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onPointerEnter={(e: React.PointerEvent<HTMLButtonElement>) => {
        if (flicker) {
          track(e)
          clearTimeout(fadeTimer.current)
          setHovered(true)
          setAnimating(true)
        }
        onPointerEnter?.(e)
      }}
      onPointerMove={(e: React.PointerEvent<HTMLButtonElement>) => {
        if (flicker) track(e)
        onPointerMove?.(e)
      }}
      onPointerLeave={(e: React.PointerEvent<HTMLButtonElement>) => {
        if (flicker) {
          setHovered(false)
          fadeTimer.current = setTimeout(() => setAnimating(false), 400)
        }
        onPointerLeave?.(e)
      }}
      {...props}
    >
      {flicker && <FlickerLayer visible={hovered} animating={animating} color={flickerColor} size={flickerSize} />}
      <Slottable>{children}</Slottable>
    </Comp>
  )
}
