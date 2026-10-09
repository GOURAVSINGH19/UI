import { ImageResponse } from "next/og"
import { OG_SIZE, OgCard } from "./og/card"
import { site } from "@/lib/site"

export const alt = site.title
export const size = OG_SIZE
export const contentType = "image/png"

// Default social preview (link previews on X, LinkedIn, Slack, iMessage…).
export default function OpenGraphImage() {
  return new ImageResponse(
    <OgCard eyebrow="Open source · MIT" title={site.name} description={site.description} />,
    size,
  )
}
