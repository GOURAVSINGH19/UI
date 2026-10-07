/* Stage, HUD, info and controls. Override the custom properties on `.td-stage` (via className) to restyle. */

export const STAGE_CSS = `
.td-stage {
  --fg: #f2f2ee;
  --muted: #8a8a86;
  --line: rgb(242 242 238 / 0.55);
  --bg: #000;
  --font: var(--font-mono, ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace);
  --font-display: Impact, "Arial Black", sans-serif;
  --font-hand: "Segoe Print", "Bradley Hand", cursive;
  --w: 280px;
  --h: 178px;
  --d: 30px;

  position: relative;
  width: 100%;
  height: clamp(520px, 80vh, 820px);
  overflow: hidden;
  container-type: inline-size;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font);
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}
.td-focused { cursor: default; }

.td-hud, .td-hint {
  position: absolute; left: 24px; z-index: 2; margin: 0;
  font-size: 10px; letter-spacing: 0.06em; line-height: 1.5; text-transform: uppercase;
  pointer-events: none; transition: opacity 0.4s ease;
}
.td-hud { top: 20px; }
.td-hint { bottom: 18px; font-size: 9px; }
.td-muted { color: var(--muted); }
.td-focused .td-hud, .td-focused .td-hint { opacity: 0; }

.td-scene { position: absolute; inset: 0; perspective: var(--perspective); perspective-origin: 50% 40%; }
.td-rail {
  position: absolute; left: var(--rail-left); top: var(--rail-top);
  transform-style: preserve-3d; transform: var(--rail-rotate);
}

.td-info {
  position: absolute; inset-inline: 0; z-index: 2;
  text-align: center; text-transform: uppercase; letter-spacing: 0.08em;
  pointer-events: none; opacity: 0; translate: 0 10px;
  transition: opacity 0.45s ease, translate 0.6s cubic-bezier(0.2, 0.9, 0.3, 1);
}
.td-info h2 { margin: 0; font-size: 15px; font-weight: 700; color: var(--fg); }
.td-info p { margin: 6px 0 0; font-size: 10px; color: var(--muted); }
.td-info .td-time { color: var(--fg); font-variant-numeric: tabular-nums; }
.td-info .td-count { margin-top: 10px; letter-spacing: 0.14em; }

.td-bars { display: inline-flex; align-items: flex-end; gap: 2px; height: 10px; margin-right: 8px; vertical-align: -1px; }
.td-bars i { width: 2px; height: 3px; border-radius: 1px; background: currentColor; }
.td-focused:has(.td-on) .td-bars i { animation: td-level calc(var(--beat) / 2) ease-in-out infinite alternate; }
.td-bars i:nth-child(2) { animation-delay: -0.12s; }
.td-bars i:nth-child(3) { animation-delay: -0.3s; }
.td-bars i:nth-child(4) { animation-delay: -0.2s; }
.td-bars i:nth-child(5) { animation-delay: -0.05s; }

.td-controls {
  position: absolute; bottom: 22px; left: 50%; z-index: 2;
  display: flex; align-items: center; gap: 14px;
  translate: -50% 16px; opacity: 0; pointer-events: none;
  transition: opacity 0.4s ease, translate 0.6s cubic-bezier(0.2, 0.9, 0.3, 1);
}
.td-close {
  position: absolute; top: 16px; right: 16px; z-index: 2;
  opacity: 0; scale: 0.8; pointer-events: none;
  transition: opacity 0.35s ease, scale 0.5s cubic-bezier(0.2, 1.4, 0.4, 1), background-color 0.2s;
}
.td-focused .td-info, .td-focused .td-controls, .td-focused .td-close {
  opacity: 1; pointer-events: auto; translate: none; scale: none;
}
.td-focused .td-info { pointer-events: none; transition-delay: 0.15s; }
.td-focused .td-controls { translate: -50% 0; transition-delay: 0.2s; }

.td-controls button, .td-close {
  display: grid; place-items: center; width: 44px; height: 44px;
  border: 1.5px solid var(--line); border-radius: 50%;
  background: rgb(0 0 0 / 0.6); color: var(--fg); cursor: pointer;
  transition: background-color 0.2s, color 0.2s, scale 0.15s;
}
.td-controls button:hover, .td-close:hover { background: var(--fg); color: var(--bg); }
.td-controls button:active { scale: 0.92; }
.td-controls button:focus-visible, .td-close:focus-visible { outline: 2px solid var(--fg); outline-offset: 3px; }
.td-controls svg, .td-close svg {
  width: 16px; height: 16px; fill: none; stroke: currentColor;
  stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
}

.td-controls .td-play { position: relative; width: 58px; height: 58px; border-color: var(--fg); background: var(--fg); color: var(--bg); }
.td-controls .td-play svg {
  position: absolute; width: 20px; height: 20px; fill: currentColor; stroke: none;
  transition: opacity 0.25s ease, scale 0.35s cubic-bezier(0.2, 1.4, 0.4, 1), rotate 0.35s ease;
}
.td-controls .td-icon-pause, .td-controls .td-on .td-icon-play { opacity: 0; scale: 0.5; rotate: 90deg; }
.td-controls .td-on .td-icon-pause { opacity: 1; scale: 1; rotate: 0deg; }
.td-play::after {
  content: ""; position: absolute; inset: -6px;
  border: 1.5px solid var(--fg); border-radius: 50%; opacity: 0;
}
.td-play.td-on::after { animation: td-pulse var(--beat) ease-out infinite; }

.td-tooltip {
  position: absolute; top: 0; left: 0; z-index: 3;
  display: flex; flex-direction: column; gap: 1px;
  max-width: 220px; margin: 18px 0 0 14px; padding: 7px 10px;
  border: 1px solid rgb(255 255 255 / 0.14); border-radius: 10px;
  background: rgb(18 18 18 / 0.92); backdrop-filter: blur(6px);
  box-shadow: 0 8px 24px -8px rgb(0 0 0 / 0.6);
  color: var(--fg); font-size: 12px; line-height: 1.35;
  pointer-events: none; opacity: 0; scale: 0.94;
  transition: opacity 0.15s ease, scale 0.15s ease;
}
.td-tip-shown { opacity: 1; scale: 1; }
.td-tooltip strong, .td-tooltip span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.td-tooltip strong { font-weight: 600; }
.td-tooltip span { color: var(--muted); }

@keyframes td-spin { to { rotate: 360deg; } }
@keyframes td-pulse { from { opacity: 0.6; scale: 0.9; } to { opacity: 0; scale: 1.25; } }
@keyframes td-level { from { height: 3px; } to { height: 10px; } }

@container (max-width: 760px) {
  .td-scene { --w: 190px; --h: 121px; --d: 22px; }
}
@media (hover: none) {
  .td-tooltip { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .td-playing .td-reel, .td-play.td-on::after, .td-focused:has(.td-on) .td-bars i { animation: none; }
}
`
