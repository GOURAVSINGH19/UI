import posthog from "posthog-js"

// Runs once in the browser before the app hydrates. No key → analytics stay off (local dev, forks).
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY

if (key) {
  posthog.init(key, {
    // Events go through our own /ingest rewrite (next.config.mjs) so ad-blockers don't drop them.
    api_host: "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  })
}
