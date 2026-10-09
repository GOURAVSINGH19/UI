import { ImageResponse } from "next/og"
import { OG_SIZE, OgCard } from "./card"
import { site } from "@/lib/site"

// Per-page social preview: /og?title=...&description=... (used by the component docs pages).
export function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const title = params.get("title")?.slice(0, 80) || site.name
  const description = params.get("description")?.slice(0, 200) || site.description

  return new ImageResponse(<OgCard eyebrow={`${site.name} / Components`} title={title} description={description} />, OG_SIZE)
}
