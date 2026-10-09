import { site } from "@/lib/site"

export const OG_SIZE = { width: 1200, height: 630 }

/** Social preview card shared by the site-wide image and the per-component /og route. */
export function OgCard({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#fbfbfb",
        color: "#1a1a1a",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#666" }}>{eyebrow}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: -3 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 38, color: "#666", marginTop: 16, maxWidth: 1000 }}>{description}</div>
      </div>
      <div style={{ display: "flex", fontSize: 28, color: "#444" }}>{`${site.name} · by ${site.author}`}</div>
    </div>
  )
}
