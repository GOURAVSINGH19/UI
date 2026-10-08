/**
 * A small DOM painter: draws an element's backgrounds, borders, text, icons and
 * images onto a canvas, so the dust keeps the element's real colours.
 * It covers what UI elements usually contain, not every CSS feature.
 */

export type Snapshot = { data: Uint8ClampedArray; width: number; height: number; left: number; top: number }

const TRANSPARENT = /rgba\([^)]*,\s*0\)|transparent/

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2))
}

function sameOrigin(src: string) {
  if (src.startsWith("data:") || src.startsWith("blob:")) return true
  try {
    return new URL(src, location.href).origin === location.origin
  } catch {
    return false
  }
}

/** Inline SVG icons (Lucide etc.) are drawn by serialising them with currentColor resolved. */
async function svgImage(svg: SVGElement, color: string, w: number, h: number) {
  const clone = svg.cloneNode(true) as SVGElement
  clone.setAttribute("width", String(w))
  clone.setAttribute("height", String(h))
  clone.setAttribute("color", color)
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  const markup = new XMLSerializer().serializeToString(clone).replaceAll("currentColor", color)
  const img = new Image()
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
  await img.decode()
  return img
}

function paintText(ctx: CanvasRenderingContext2D, node: Text, cs: CSSStyleDeclaration, origin: DOMRect) {
  const text = node.textContent ?? ""
  if (!text.trim()) return
  ctx.fillStyle = cs.color
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
  ctx.letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing
  ctx.textBaseline = "middle"
  const upper = cs.textTransform === "uppercase"
  const range = document.createRange()
  // Word by word: each word is measured where the browser actually laid it out.
  let offset = 0
  for (const word of text.split(/(\s+)/)) {
    if (word && !/^\s+$/.test(word)) {
      range.setStart(node, offset)
      range.setEnd(node, offset + word.length)
      const box = range.getClientRects()[0]
      if (box) ctx.fillText(upper ? word.toUpperCase() : word, box.left - origin.left, box.top - origin.top + box.height / 2)
    }
    offset += word.length
  }
}

async function paint(ctx: CanvasRenderingContext2D, el: Element, origin: DOMRect) {
  const cs = getComputedStyle(el)
  if (cs.display === "none" || cs.visibility === "hidden" || el.hasAttribute("data-dissolve-ignore")) return
  const box = el.getBoundingClientRect()
  const x = box.left - origin.left
  const y = box.top - origin.top
  const radius = parseFloat(cs.borderTopLeftRadius) || 0

  ctx.save()
  ctx.globalAlpha *= parseFloat(cs.opacity)

  if (!TRANSPARENT.test(cs.backgroundColor)) {
    ctx.fillStyle = cs.backgroundColor
    roundRect(ctx, x, y, box.width, box.height, radius)
    ctx.fill()
  }
  const border = parseFloat(cs.borderTopWidth)
  if (border > 0 && cs.borderTopStyle !== "none" && !TRANSPARENT.test(cs.borderTopColor)) {
    ctx.strokeStyle = cs.borderTopColor
    ctx.lineWidth = border
    roundRect(ctx, x + border / 2, y + border / 2, box.width - border, box.height - border, radius)
    ctx.stroke()
  }

  if (el instanceof SVGSVGElement) {
    const img = await svgImage(el, cs.color, box.width, box.height).catch(() => null)
    if (img) ctx.drawImage(img, x, y, box.width, box.height)
  } else if (el instanceof HTMLImageElement) {
    // Cross-origin images would taint the canvas, so they become a flat tile instead.
    if (el.complete && el.naturalWidth && sameOrigin(el.currentSrc || el.src)) ctx.drawImage(el, x, y, box.width, box.height)
    else {
      ctx.fillStyle = "rgb(128 128 128 / 0.5)"
      roundRect(ctx, x, y, box.width, box.height, radius)
      ctx.fill()
    }
  } else {
    for (const child of el.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) paintText(ctx, child as Text, cs, origin)
      else if (child instanceof Element) await paint(ctx, child, origin)
    }
  }
  ctx.restore()
}

export async function snapshot(el: HTMLElement): Promise<Snapshot> {
  const box = el.getBoundingClientRect()
  const width = Math.max(1, Math.ceil(box.width))
  const height = Math.max(1, Math.ceil(box.height))
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!
  await paint(ctx, el, box)
  return { data: ctx.getImageData(0, 0, width, height).data, width, height, left: box.left, top: box.top }
}
