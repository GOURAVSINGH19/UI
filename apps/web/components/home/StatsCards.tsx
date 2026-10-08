import { getSiteStats } from "@/lib/stats"
import { StatsCardsView } from "./StatsCardsView"

/** Page views, visitors and average visit length from PostHog, as three cards.
 *  Fetches on the server; renders nothing when stats aren't configured. */
export async function StatsCards({ className }: { className?: string }) {
  const stats = await getSiteStats()
  if (!stats.available) return null
  return <StatsCardsView stats={stats} className={className} />
}
