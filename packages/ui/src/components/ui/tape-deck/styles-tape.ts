/* The 3D cassette: faces, window, reels and the cover label. */

export const TAPE_CSS = `
.td-tape {
  position: absolute; width: var(--w); height: var(--h);
  margin: calc(var(--h) * -1) 0 0 calc(var(--w) / -2);
  transform-style: preserve-3d; will-change: transform; cursor: pointer; outline: none;
}
.td-face { position: absolute; backface-visibility: hidden; transition: filter 0.6s ease; }
.td-focused .td-tape:not(.td-selected) .td-face { filter: brightness(0.22) saturate(0.6); }

.td-front, .td-back { width: var(--w); height: var(--h); border-radius: 9px; }
.td-front {
  transform: translateZ(calc(var(--d) / 2));
  background:
    radial-gradient(circle at 9px 9px, #666 2px, transparent 3.5px),
    radial-gradient(circle at calc(100% - 9px) 9px, #666 2px, transparent 3.5px),
    radial-gradient(circle at 9px calc(100% - 9px), #666 2px, transparent 3.5px),
    radial-gradient(circle at calc(100% - 9px) calc(100% - 9px), #666 2px, transparent 3.5px),
    linear-gradient(160deg, #2e2e2e, #121212 60%, #1c1c1c);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.12), inset 0 1px 0 rgb(255 255 255 / 0.25);
}
.td-tape:focus-visible .td-front { box-shadow: inset 0 0 0 2px var(--fg); }
.td-back { transform: rotateY(180deg) translateZ(calc(var(--d) / 2)); background: #151515; }
.td-top, .td-bottom {
  top: calc(50% - var(--d) / 2); width: var(--w); height: var(--d);
  background: linear-gradient(#262626, #141414);
}
.td-top { transform: rotateX(90deg) translateZ(calc(var(--h) / 2)); }
.td-bottom { transform: rotateX(-90deg) translateZ(calc(var(--h) / 2)); background: #0a0a0a; }
.td-left, .td-right {
  left: calc(50% - var(--d) / 2); width: var(--d); height: var(--h);
  background: linear-gradient(90deg, #1d1d1d, #2b2b2b 50%, #161616);
}
.td-left { transform: rotateY(-90deg) translateZ(calc(var(--w) / 2)); }
.td-right { transform: rotateY(90deg) translateZ(calc(var(--w) / 2)); }

.td-label { position: absolute; inset: 5% 5% 28%; overflow: hidden; border-radius: 4px; }
.td-label img { width: 100%; height: 100%; object-fit: cover; }
.td-window {
  position: absolute; top: 36%; left: 50%; width: 40%; height: 17%;
  transform: translateX(-50%); border-radius: 999px;
  background: linear-gradient(#3a2a1f, #140d09);
  box-shadow: inset 0 0 0 2px rgb(0 0 0 / 0.6), 0 0 0 3px rgb(255 255 255 / 0.75);
}
.td-reel {
  position: absolute; top: 50%; height: 72%; aspect-ratio: 1; translate: 0 -50%;
  border-radius: 50%; background: repeating-conic-gradient(#eee 0 20deg, #555 20deg 60deg);
}
.td-reel:first-child { left: 6%; }
.td-reel:last-child { right: 6%; }
.td-playing .td-reel { animation: td-spin calc(var(--beat) * 3) linear infinite; }
.td-bridge {
  position: absolute; bottom: 0; left: 14%; right: 14%; height: 19%;
  background:
    radial-gradient(circle at 30% 60%, #2a2a2a 3px, transparent 4px),
    radial-gradient(circle at 70% 60%, #2a2a2a 3px, transparent 4px),
    #0f0f0f;
  clip-path: polygon(9% 0, 91% 0, 100% 100%, 0 100%);
}
.td-gloss {
  position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background: linear-gradient(115deg, rgb(255 255 255 / 0.2), transparent 32% 70%, rgb(255 255 255 / 0.06));
}

.td-cover { position: relative; height: 100%; padding: 6px 8px; white-space: pre-line; line-height: 0.95; }
.td-block { font-family: var(--font-display); font-size: calc(var(--w) * 0.075); }
.td-hand { font-family: var(--font-hand); font-size: calc(var(--w) * 0.065); }
.td-mono { font-family: var(--font); font-size: calc(var(--w) * 0.04); font-weight: 700; }
.td-side { position: absolute; right: 7px; bottom: 5px; font-family: var(--font); font-size: 9px; font-weight: 700; }
`
