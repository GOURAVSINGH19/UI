import { cacheLife } from "next/cache"

// Audience stats from PostHog, read with HogQL on the server. "Since launch" means since the first
// tracked pageview, capped at a year.
// Needs POSTHOG_PROJECT_ID and POSTHOG_PERSONAL_API_KEY (scope: query:read) in the server env.
// The public project key (NEXT_PUBLIC_POSTHOG_KEY) only sends events; it can't read them.

/** Change against the previous period as a fraction (0.12 = +12%), or null when there's nothing to compare. */
export type Trend = number | null

export type SiteStats =
  | {
    available: true
    since: string
    pageViews: number
    /** Running page-view total at even steps from launch to today, oldest first. */
    pageViewsGrowth: { date: string; total: number }[]
    /** Last 30 days vs the 30 before. */
    pageViewsTrend: Trend
    visitors: number
    /** Unique visitors in each of the last 7 rolling weeks, oldest first; the last is the past 7 days. */
    weeklyVisitors: { start: string; end: string; visitors: number }[]
    /** Past 7 days vs the 7 before. */
    visitorsTrend: Trend
    avgSessionSeconds: number
    /** Last 30 days vs the 30 before. */
    avgSessionTrend: Trend
  }
  | { available: false }

// The query API lives on the app host (us.posthog.com), not the ingest host (us.i.posthog.com).
const host = () => (process.env.POSTHOG_HOST ?? "https://us.posthog.com").replace(".i.posthog.com", ".posthog.com")

const PAGEVIEWS = `event = '$pageview' AND timestamp >= now() - INTERVAL 365 DAY`
const QUERIES = [
  // 0: page views per day since launch
  `SELECT toDate(timestamp) AS day, count() FROM events WHERE ${PAGEVIEWS} GROUP BY day ORDER BY day`,
  // 1: unique visitors since launch
  `SELECT count(DISTINCT person_id) FROM events WHERE ${PAGEVIEWS}`,
  // 2: unique visitors per rolling week; week 0 is the last 7 days
  `SELECT intDiv(dateDiff('day', toDate(timestamp), today()), 7) AS week, count(DISTINCT person_id)
   FROM events WHERE event = '$pageview' AND timestamp >= today() - INTERVAL 48 DAY
   GROUP BY week ORDER BY week`,
  // 3: average session length in seconds: overall, last 30 days, the 30 before
  `SELECT avg($session_duration),
          avgIf($session_duration, $start_timestamp >= now() - INTERVAL 30 DAY),
          avgIf($session_duration, $start_timestamp < now() - INTERVAL 30 DAY AND $start_timestamp >= now() - INTERVAL 60 DAY)
   FROM sessions WHERE $start_timestamp >= now() - INTERVAL 365 DAY`,
]

type Rows = unknown[][]

async function hogql(query: string, projectId: string, key: string): Promise<Rows | null> {
  const res = await fetch(`${host()}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
  })
  if (!res.ok) return null
  return (await res.json())?.results ?? null
}

const DAY = 864e5
const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10)

/** Relative change; null when the earlier period is empty or missing (a brand-new site has no "before"). */
function trend(current: number, previous: number): Trend {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous <= 0) return null
  return (current - previous) / previous
}

/** Running total of daily counts, sampled at `points` evenly spaced days (always ending on the last day). */
function growth(days: { date: string; count: number }[], points: number) {
  let total = 0
  const running = days.map((d) => ({ date: d.date, total: (total += d.count) }))
  if (running.length <= points) return running
  return Array.from({ length: points }, (_, i) => running[Math.round((i / (points - 1)) * (running.length - 1))]!)
}

export async function getSiteStats(): Promise<SiteStats> {
  "use cache"
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 })

  const { POSTHOG_PROJECT_ID: id, POSTHOG_PERSONAL_API_KEY: key } = process.env
  if (!id || !key) return { available: false }

  try {
    const [daily, visitors, weekly, session] = await Promise.all(QUERIES.map((q) => hogql(q, id, key)))
    if (!daily?.length || !visitors) return { available: false }

    const days = daily.map((r) => ({ date: String(r[0]).slice(0, 10), count: Number(r[1]) }))
    const now = Date.now()
    const sumBetween = (fromDaysAgo: number, toDaysAgo: number) =>
      days
        .filter((d) => d.date > isoDay(now - fromDaysAgo * DAY) && d.date <= isoDay(now - toDaysAgo * DAY))
        .reduce((a, d) => a + d.count, 0)

    // Fill any week with no visits so there are always 7 bars. Week w covers (w*7+6 .. w*7) days ago.
    const byWeek = new Map((weekly ?? []).map((r) => [Number(r[0]), Number(r[1])]))
    const weeks = Array.from({ length: 7 }, (_, i) => {
      const w = 6 - i
      return { start: isoDay(now - (w * 7 + 6) * DAY), end: isoDay(now - w * 7 * DAY), visitors: byWeek.get(w) ?? 0 }
    })

    const [avgAll, avgRecent, avgBefore] = (session?.[0] ?? []).map(Number)

    return {
      available: true,
      since: days[0]!.date,
      pageViews: days.reduce((a, d) => a + d.count, 0),
      pageViewsGrowth: growth(days, 5),
      pageViewsTrend: trend(sumBetween(30, 0), sumBetween(60, 30)),
      visitors: Number(visitors[0]?.[0] ?? 0),
      weeklyVisitors: weeks,
      visitorsTrend: trend(weeks[6]!.visitors, weeks[5]!.visitors),
      avgSessionSeconds: avgAll ?? 0,
      avgSessionTrend: trend(avgRecent ?? NaN, avgBefore ?? NaN),
    }
  } catch {
    return { available: false }
  }
}
