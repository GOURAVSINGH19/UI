import posthog from "posthog-js"

const key = process.env.POSTHOG_KEY

if (key) {
  posthog.init(key, {
    api_host: "/ingest",
    ui_host: process.env.POSTHOG_HOST ?? "https://us.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  })
}
