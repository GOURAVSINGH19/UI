"use client"

import { useRef, useState, type ReactNode } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import NumberFlow from "@number-flow/react"
import { cn } from "@workspace/ui/lib/utils"
import type { SiteStats, Trend } from "@/lib/stats"

type Stats = Extract<SiteStats, { available: true }>
type Read = (text: string | null) => void

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const exact = new Intl.NumberFormat("en")
const shortDay = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" })
const day = (iso: string) => shortDay.format(new Date(`${iso}T00:00:00Z`))

/** Rounded down to two significant digits from 1,000 up (512_340 → 510_000), so "510K+" never overstates. */
const floor2 = (n: number) => {
  if (n < 1000) return Math.floor(n)
  const step = 10 ** (Math.floor(Math.log10(n)) - 1)
  return Math.floor(n / step) * step
}

function duration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return m ? `${m} min ${s} sec` : `${s} sec`
}

/* ------------------------------------------------------------------ pieces */

/** "↑ 18%" in plain colored text; nothing when there's no earlier period to compare with. */
function TrendText({ value, period }: { value: Trend; period: string }) {
  if (value === null) return null
  const pct = Math.round(Math.abs(value) * 100)
  const up = value >= 0
  return (
    <span
      title={`${up ? "Up" : "Down"} ${pct}% vs ${period}`}
      className={cn("text-xs font-medium tabular-nums", up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}
    >
      {up ? "↑" : "↓"} {pct}%<span className="sr-only"> vs {period}</span>
    </span>
  )
}

function Stat({
  label,
  value,
  trend,
  caption,
  readout,
  children,
}: {
  label: string
  value: ReactNode
  trend: ReactNode
  caption: string
  /** Replaces the caption while the graphic is hovered. */
  readout: string | null
  children: ReactNode
}) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } }}
      className="flex flex-col p-5"
    >
      <p className="text-xs text-ui-caption">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="font-serif text-3xl leading-none text-ui-heading tabular-nums">{value}</p>
        {trend}
      </div>
      <div className="mt-5 h-10">{children}</div>
      <p className={cn("mt-2 truncate text-[11px] tabular-nums transition-colors", readout ? "text-ui-heading" : "text-ui-hint")}>
        {readout ?? caption}
      </p>
    </motion.div>
  )
}

/* --------------------------------------------------------------- graphics */

/** Running page-view total as a thin line with a faint fill. Hover snaps to the nearest sample. */
function Sparkline({ points, show, onRead }: { points: Stats["pageViewsGrowth"]; show: boolean; onRead: Read }) {
  const [active, setActive] = useState<number | null>(null)
  const w = 200
  const h = 40
  const max = Math.max(...points.map((p) => p.total), 1)
  const xy = points.map((p, i) => [(i / Math.max(points.length - 1, 1)) * w, h - (p.total / max) * (h - 3) - 1.5] as const)
  const line = xy.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")
  const dot = active === null ? null : xy[active]!

  return (
    <div
      className="relative size-full"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        const i = Math.min(Math.max(Math.round(((e.clientX - r.left) / r.width) * (points.length - 1)), 0), points.length - 1)
        setActive(i)
        onRead(`${day(points[i]!.date)} · ${exact.format(points[i]!.total)} views`)
      }}
      onPointerLeave={() => {
        setActive(null)
        onRead(null)
      }}
    >
      {/* Revealed left to right with a clip: pathLength miscounts once the stroke is non-scaling. */}
      <motion.svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="size-full overflow-visible"
        role="img"
        aria-label="Page views growing since launch"
        initial={{ clipPath: "inset(-4px 100% -4px -4px)" }}
        animate={{ clipPath: show ? "inset(-4px -4px -4px -4px)" : "inset(-4px 100% -4px -4px)" }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
      >
        <polygon points={`0,${h} ${line} ${w},${h}`} fill="var(--ui-bg-muted)" opacity={0.7} />
        <polyline
          points={line}
          fill="none"
          stroke="var(--ui-text-heading)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </motion.svg>
      {/* Dot in HTML so the stretched SVG doesn't squash it. */}
      {dot && (
        <span
          className="pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ui-bg bg-ui-heading"
          style={{ left: `${(dot[0] / w) * 100}%`, top: `${(dot[1] / h) * 100}%` }}
        />
      )}
    </div>
  )
}

/** Weekly visitors as slim bars; the past 7 days in full ink, earlier weeks faded. */
function Bars({ weeks, show, onRead }: { weeks: Stats["weeklyVisitors"]; show: boolean; onRead: Read }) {
  const [active, setActive] = useState<number | null>(null)
  const max = Math.max(...weeks.map((w) => w.visitors), 1)
  const last = weeks.length - 1
  const read = (i: number | null) => {
    setActive(i)
    onRead(i === null ? null : `${day(weeks[i]!.start)}–${day(weeks[i]!.end)} · ${exact.format(weeks[i]!.visitors)} visitors`)
  }

  return (
    <ul className="flex size-full items-end gap-1" aria-label="Visitors per week, last 7 weeks" onPointerLeave={() => read(null)}>
      {weeks.map((w, i) => {
        const highlighted = active === null ? i === last : i === active
        return (
          <motion.li
            key={w.start}
            tabIndex={0}
            aria-label={`${day(w.start)} to ${day(w.end)}: ${exact.format(w.visitors)} visitors`}
            onPointerEnter={() => read(i)}
            onFocus={() => read(i)}
            onBlur={() => read(null)}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: show ? 1 : 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.2 + i * 0.04 }}
            style={{ height: `${Math.max((w.visitors / max) * 100, 8)}%`, originY: 1 }}
            className={cn(
              "flex-1 rounded-[2px] outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ui-border-strong",
              highlighted ? "bg-ui-heading" : "bg-ui-border"
            )}
          />
        )
      })}
    </ul>
  )
}

/** Average visit as a single track filled up to the value, on a 0–5 min scale. */
function Meter({ seconds, show, onRead }: { seconds: number; show: boolean; onRead: Read }) {
  const fill = Math.min(seconds / 300, 1)
  return (
    <div
      className="flex size-full items-end"
      role="img"
      aria-label={`Average visit ${duration(seconds)}, on a scale up to 5 minutes`}
      onPointerEnter={() => onRead(`${duration(seconds)} average`)}
      onPointerLeave={() => onRead(null)}
    >
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-ui-muted">
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full bg-ui-heading"
          initial={{ width: "0%" }}
          animate={{ width: show ? `${fill * 100}%` : "0%" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- view */

export function StatsCardsView({ stats, className }: { stats: Stats; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduce = useReducedMotion()
  const show = inView || !!reduce
  const [reads, setReads] = useState<Record<string, string | null>>({})
  const reader = (key: string) => (t: string | null) => setReads((r) => ({ ...r, [key]: t }))

  const count = (n: number, suffix?: string) => (
    <NumberFlow value={show ? n : 0} format={{ notation: n >= 1000 ? "compact" : "standard" }} suffix={suffix} />
  )
  const minutes = stats.avgSessionSeconds / 60

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : "hidden"}
      animate={show ? "visible" : "hidden"}
      variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      className={cn(
        "grid divide-y divide-ui-border-subtle overflow-hidden rounded-xl border border-ui-border bg-ui-bg sm:grid-cols-3 sm:divide-x sm:divide-y-0",
        className
      )}
    >
      <Stat
        label="Page views"
        value={count(floor2(stats.pageViews), stats.pageViews >= 1000 ? "+" : undefined)}
        trend={<TrendText value={stats.pageViewsTrend} period="the previous 30 days" />}
        caption="Since launch"
        readout={reads.views ?? null}
      >
        <Sparkline points={stats.pageViewsGrowth} show={show} onRead={reader("views")} />
      </Stat>

      <Stat
        label="Visitors"
        value={count(floor2(stats.visitors), stats.visitors >= 1000 ? "+" : undefined)}
        trend={<TrendText value={stats.visitorsTrend} period="the week before" />}
        caption="Last 7 weeks"
        readout={reads.visitors ?? null}
      >
        <Bars weeks={stats.weeklyVisitors} show={show} onRead={reader("visitors")} />
      </Stat>

      <Stat
        label="Avg. visit"
        value={minutes >= 1 ? count(Math.round(minutes), " min") : count(Math.round(stats.avgSessionSeconds), " sec")}
        trend={<TrendText value={stats.avgSessionTrend} period="the previous 30 days" />}
        caption="Out of 5 min"
        readout={reads.session ?? null}
      >
        <Meter seconds={stats.avgSessionSeconds} show={show} onRead={reader("session")} />
      </Stat>
    </motion.div>
  )
}
