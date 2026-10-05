"use client"

import { CodeWindow, type CodeWindowFile } from "./CodeWindow"

const DEMO_FILES: CodeWindowFile[] = [
    {
        path: "components/ui/goo-search.tsx",
        code: `"use client"

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react"
import { animate, motion, useMotionValue } from "framer-motion"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  CornerDownLeft,
  FileText,
  Search,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type GooSearchItem = {
  title: string
  href: string
  category: string
  keywords?: string
  external?: boolean
}`,
        html: `<div class="code-file"><pre class="shiki nord" style="background-color:#2e3440ff;color:#d8dee9ff" tabindex="0"><code><span class="line"><span style="color:#81A1C1">"use client"</span></span>
<span class="line"></span>
<span class="line"><span style="color:#81A1C1">import</span><span style="color:#ECEFF4"> {</span><span style="color:#D8DEE9FF"> useEffect</span><span style="color:#ECEFF4">,</span><span style="color:#D8DEE9FF"> useId</span><span style="color:#ECEFF4">,</span><span style="color:#D8DEE9FF"> useLayoutEffect</span><span style="color:#ECEFF4">,</span><span style="color:#D8DEE9FF"> useMemo</span><span style="color:#ECEFF4">,</span><span style="color:#D8DEE9FF"> useRef</span><span style="color:#ECEFF4">,</span><span style="color:#D8DEE9FF"> useState</span><span style="color:#ECEFF4"> }</span><span style="color:#81A1C1"> from</span><span style="color:#ECEFF4"> </span><span style="color:#A3BE8C">"react"</span></span>
<span class="line"><span style="color:#81A1C1">import</span><span style="color:#ECEFF4"> {</span><span style="color:#D8DEE9FF"> animate</span><span style="color:#ECEFF4">,</span><span style="color:#D8DEE9FF"> motion</span><span style="color:#ECEFF4">,</span><span style="color:#D8DEE9FF"> useMotionValue</span><span style="color:#ECEFF4"> }</span><span style="color:#81A1C1"> from</span><span style="color:#ECEFF4"> </span><span style="color:#A3BE8C">"framer-motion"</span></span>
<span class="line"><span style="color:#81A1C1">import</span><span style="color:#ECEFF4"> {</span></span>
<span class="line"><span style="color:#D8DEE9FF">  ArrowDown</span><span style="color:#ECEFF4">,</span></span>
<span class="line"><span style="color:#D8DEE9FF">  ArrowUp</span><span style="color:#ECEFF4">,</span></span>
<span class="line"><span style="color:#D8DEE9FF">  ArrowUpRight</span><span style="color:#ECEFF4">,</span></span>
<span class="line"><span style="color:#D8DEE9FF">  CornerDownLeft</span><span style="color:#ECEFF4">,</span></span>
<span class="line"><span style="color:#D8DEE9FF">  FileText</span><span style="color:#ECEFF4">,</span></span>
<span class="line"><span style="color:#D8DEE9FF">  Search</span><span style="color:#ECEFF4">,</span></span>
<span class="line"><span style="color:#D8DEE9FF">  X</span><span style="color:#ECEFF4">,</span></span>
<span class="line"><span style="color:#ECEFF4">}</span><span style="color:#81A1C1"> from</span><span style="color:#ECEFF4"> </span><span style="color:#A3BE8C">"lucide-react"</span></span>
<span class="line"><span style="color:#81A1C1">import</span><span style="color:#ECEFF4"> {</span><span style="color:#D8DEE9FF"> cn</span><span style="color:#ECEFF4"> }</span><span style="color:#81A1C1"> from</span><span style="color:#ECEFF4"> </span><span style="color:#A3BE8C">"@/lib/utils"</span></span>
<span class="line"></span>
<span class="line"><span style="color:#81A1C1">export</span><span style="color:#81A1C1"> type</span><span style="color:#8FBCBB"> GooSearchItem</span><span style="color:#ECEFF4"> = {</span></span>
<span class="line"><span style="color:#D8DEE9">  title</span><span style="color:#81A1C1">:</span><span style="color:#8FBCBB"> string</span></span>
<span class="line"><span style="color:#D8DEE9">  href</span><span style="color:#81A1C1">:</span><span style="color:#8FBCBB"> string</span></span>
<span class="line"><span style="color:#D8DEE9">  category</span><span style="color:#81A1C1">:</span><span style="color:#8FBCBB"> string</span></span>
<span class="line"><span style="color:#D8DEE9">  keywords</span><span style="color:#81A1C1">?:</span><span style="color:#8FBCBB"> string</span></span>
<span class="line"><span style="color:#D8DEE9">  external</span><span style="color:#81A1C1">?:</span><span style="color:#8FBCBB"> boolean</span></span>
<span class="line"><span style="color:#ECEFF4">}</span></span></code></pre></div>`,
    },
    {
        path: "lib/utils.ts",
        code: `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`,
        html: `<div class="code-file"><pre class="shiki nord" style="background-color:#2e3440ff;color:#d8dee9ff" tabindex="0"><code><span class="line"><span style="color:#81A1C1">import</span><span style="color:#ECEFF4"> {</span><span style="color:#D8DEE9FF"> clsx</span><span style="color:#ECEFF4">,</span><span style="color:#81A1C1"> type</span><span style="color:#8FBCBB"> ClassValue</span><span style="color:#ECEFF4"> }</span><span style="color:#81A1C1"> from</span><span style="color:#ECEFF4"> </span><span style="color:#A3BE8C">"clsx"</span></span>
<span class="line"><span style="color:#81A1C1">import</span><span style="color:#ECEFF4"> {</span><span style="color:#D8DEE9FF"> twMerge</span><span style="color:#ECEFF4"> }</span><span style="color:#81A1C1"> from</span><span style="color:#ECEFF4"> </span><span style="color:#A3BE8C">"tailwind-merge"</span></span>
<span class="line"></span>
<span class="line"><span style="color:#81A1C1">export</span><span style="color:#81A1C1"> function</span><span style="color:#88C0D0"> cn</span><span style="color:#ECEFF4">(</span><span style="color:#81A1C1">...</span><span style="color:#D8DEE9">inputs</span><span style="color:#81A1C1">:</span><span style="color:#8FBCBB"> ClassValue</span><span style="color:#ECEFF4">[])</span><span style="color:#ECEFF4"> {</span></span>
<span class="line"><span style="color:#81A1C1">  return</span><span style="color:#88C0D0"> twMerge</span><span style="color:#D8DEE9FF">(</span><span style="color:#88C0D0">clsx</span><span style="color:#D8DEE9FF">(</span><span style="color:#D8DEE9">inputs</span><span style="color:#D8DEE9FF">)</span><span style="color:#D8DEE9FF">)</span></span>
<span class="line"><span style="color:#ECEFF4">}</span></span></code></pre></div>`,
    },
    {
        path: "styles/tokens.css",
        code: `@layer base {
  :root {
    --ui-bg: 255 255 255;
    --ui-fg: 10 10 10;
    --ui-muted: 245 245 245;
    --ui-border: 229 229 229;
  }

  .dark {
    --ui-bg: 10 10 10;
    --ui-fg: 250 250 250;
    --ui-muted: 23 23 23;
    --ui-border: 38 38 38;
  }
}`,
        html: `<div class="code-file"><pre class="shiki nord" style="background-color:#2e3440ff;color:#d8dee9ff" tabindex="0"><code><span class="line"><span style="color:#81A1C1">@layer</span><span style="color:#D8DEE9FF"> base {</span></span>
<span class="line"><span style="color:#81A1C1">  :root</span><span style="color:#ECEFF4"> {</span></span>
<span class="line"><span style="color:#D8DEE9">    --ui-bg</span><span style="color:#81A1C1">:</span><span style="color:#B48EAD"> 255</span><span style="color:#B48EAD"> 255</span><span style="color:#B48EAD"> 255</span><span style="color:#81A1C1">;</span></span>
<span class="line"><span style="color:#D8DEE9">    --ui-fg</span><span style="color:#81A1C1">:</span><span style="color:#B48EAD"> 10</span><span style="color:#B48EAD"> 10</span><span style="color:#B48EAD"> 10</span><span style="color:#81A1C1">;</span></span>
<span class="line"><span style="color:#D8DEE9">    --ui-muted</span><span style="color:#81A1C1">:</span><span style="color:#B48EAD"> 245</span><span style="color:#B48EAD"> 245</span><span style="color:#B48EAD"> 245</span><span style="color:#81A1C1">;</span></span>
<span class="line"><span style="color:#D8DEE9">    --ui-border</span><span style="color:#81A1C1">:</span><span style="color:#B48EAD"> 229</span><span style="color:#B48EAD"> 229</span><span style="color:#B48EAD"> 229</span><span style="color:#81A1C1">;</span></span>
<span class="line"><span style="color:#ECEFF4">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#81A1C1">  .dark</span><span style="color:#ECEFF4"> {</span></span>
<span class="line"><span style="color:#D8DEE9">    --ui-bg</span><span style="color:#81A1C1">:</span><span style="color:#B48EAD"> 10</span><span style="color:#B48EAD"> 10</span><span style="color:#B48EAD"> 10</span><span style="color:#81A1C1">;</span></span>
<span class="line"><span style="color:#D8DEE9">    --ui-fg</span><span style="color:#81A1C1">:</span><span style="color:#B48EAD"> 250</span><span style="color:#B48EAD"> 250</span><span style="color:#B48EAD"> 250</span><span style="color:#81A1C1">;</span></span>
<span class="line"><span style="color:#D8DEE9">    --ui-muted</span><span style="color:#81A1C1">:</span><span style="color:#B48EAD"> 23</span><span style="color:#B48EAD"> 23</span><span style="color:#B48EAD"> 23</span><span style="color:#81A1C1">;</span></span>
<span class="line"><span style="color:#D8DEE9">    --ui-border</span><span style="color:#81A1C1">:</span><span style="color:#B48EAD"> 38</span><span style="color:#B48EAD"> 38</span><span style="color:#B48EAD"> 38</span><span style="color:#81A1C1">;</span></span>
<span class="line"><span style="color:#ECEFF4">  }</span></span>
<span class="line"><span style="color:#D8DEE9FF">}</span></span></code></pre></div>`,
    },
]

export function CodeWindowDemo() {
    return <CodeWindow files={DEMO_FILES} />
}
