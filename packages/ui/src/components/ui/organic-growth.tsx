"use client"

import {
    type CSSProperties,
    type FocusEvent as ReactFocusEvent,
    type PointerEvent as ReactPointerEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";


export type Edge = "top" | "right" | "bottom" | "left";
export type SproutEnd = "curl" | "bloom" | "none";

export interface Sprout {
    edge: Edge;
    t: number;
    side: 1 | -1;
    length: number;
    end?: SproutEnd;
    branch?: boolean;
    blooms?: number[];
}

export interface GrowthPalette {
    stem: string;
    leaves: string[];
    rib: string;
    petal: string | string[];
    petals?: string[];
    petalStroke: string;
    pollen: string;
    flowerScale?: number;
}

export type GrowthTrigger = "hover" | "focus" | "hover-focus" | "manual";

export interface OrganicGrowthProps {
    children: ReactNode;
    active?: boolean;
    trigger?: GrowthTrigger;
    sprouts?: Sprout[];
    seed?: number;
    padding?: number;
    tuck?: number;
    speed?: number;
    stagger?: number;
    palette?: Partial<GrowthPalette>;
    onGrowChange?: (grown: boolean) => void;
    className?: string;
    style?: CSSProperties;
}

export const DEFAULT_SPROUTS: Sprout[] = [
    { edge: "top", t: 0.08, side: -1, length: 10, end: "curl", branch: true, blooms: [1] },
    { edge: "top", t: 0.32, side: 1, length: 30, end: "bloom", blooms: [0.45] },
    { edge: "top", t: 0.58, side: -1, length: 85, end: "curl" },
    { edge: "top", t: 0.85, side: 1, length: 80, end: "bloom", blooms: [0.55], branch: true },

    { edge: "right", t: 0.15, side: -1, length: 45, end: "bloom", blooms: [0.5] },
    { edge: "right", t: 0.50, side: 1, length: 90, end: "curl" },
    { edge: "right", t: 0.82, side: -1, length: 55, end: "bloom", branch: true },

    { edge: "bottom", t: 0.12, side: -1, length: 60, end: "curl", branch: true },
    { edge: "bottom", t: 0.38, side: 1, length: 95, end: "bloom", blooms: [0.5] },
    { edge: "bottom", t: 0.65, side: -1, length: 30, end: "curl" },
    { edge: "bottom", t: 0.88, side: 1, length: 50, end: "bloom", blooms: [0.4, 0.75], branch: true },

    { edge: "left", t: 0.18, side: 1, length: 90, end: "curl" },
    { edge: "left", t: 0.48, side: -1, length: 40, end: "bloom", blooms: [0.45], branch: true },
    { edge: "left", t: 0.80, side: 1, length: 20, end: "bloom" },
];

export const DEFAULT_PALETTE: GrowthPalette = {
    stem: "var(--og-stem, #3F5B33)",
    leaves: [
        "var(--og-leaf-1, #6E8F4A)",
        "var(--og-leaf-2, #9DB874)",
        "var(--og-leaf-3, #3F5B33)",
    ],
    rib: "var(--og-rib, #3F5B33)",
    petal: [
        "var(--og-petal-1, #F4ECD3)",
        "var(--og-petal-2, #FFB7C5)",
        "var(--og-petal-3, #D4BBFF)",
        "var(--og-petal-4, #FFD9A0)",
        "var(--og-petal-5, #B5EAEA)",
    ],
    petalStroke: "var(--og-petal-stroke, #6E8F4A)",
    pollen: "var(--og-pollen, #C99A3A)",
    flowerScale: 1.2,
};
const EASE_GROW = "cubic-bezier(.25,.6,.35,1)";
const EASE_RETRACT = "cubic-bezier(.55,0,.8,.35)";
const EASE_POP = "cubic-bezier(.34,1.56,.64,1)";
const LEAF_PATH = "M0 0C5 -6.5 15 -7.5 23 0C15 7.5 5 6.5 0 0Z";

type Vec = { x: number; y: number };

const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: Vec, k: number): Vec => ({ x: a.x * k, y: a.y * k });
const rotate = (v: Vec, deg: number): Vec => {
    const r = (deg * Math.PI) / 180;
    const c = Math.cos(r);
    const s = Math.sin(r);
    return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
};
const r1 = (n: number) => Math.round(n * 10) / 10;

const cubic = (p0: Vec, p1: Vec, p2: Vec, p3: Vec, t: number): Vec => {
    const u = 1 - t;
    return {
        x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
        y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
    };
};

function createRandom(seed: number) {
    let s = Math.max(1, Math.floor(Math.abs(seed)) % 2147483647);
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

interface Polyline {
    pts: Vec[];
    cum: number[];
    total: number;
}

function measure(pts: Vec[]): Polyline {
    const cum = [0];
    for (let i = 1; i < pts.length; i++) {
        cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    }
    return { pts, cum, total: cum[cum.length - 1] };
}

function pointAt(poly: Polyline, dist: number): { p: Vec; angle: number } {
    const d = Math.min(Math.max(dist, 0), poly.total);
    let i = 1;
    while (i < poly.cum.length - 1 && poly.cum[i] < d) i++;
    const a = poly.pts[i - 1];
    const b = poly.pts[i];
    const seg = poly.cum[i] - poly.cum[i - 1] || 1;
    const k = (d - poly.cum[i - 1]) / seg;
    return {
        p: { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k },
        angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
    };
}

function edgeFrame(edge: Edge, t: number, w: number, h: number, pad: number) {
    switch (edge) {
        case "top":
            return { p: { x: pad + t * w, y: pad }, n: { x: 0, y: -1 }, tan: { x: 1, y: 0 } };
        case "right":
            return { p: { x: pad + w, y: pad + t * h }, n: { x: 1, y: 0 }, tan: { x: 0, y: 1 } };
        case "bottom":
            return { p: { x: pad + t * w, y: pad + h }, n: { x: 0, y: 1 }, tan: { x: 1, y: 0 } };
        case "left":
            return { p: { x: pad, y: pad + t * h }, n: { x: -1, y: 0 }, tan: { x: 0, y: 1 } };
    }
}

export interface StemShape {
    d: string;
    length: number;
    delay: number;
    duration: number;
    retractDelay: number;
    thin: boolean;
}
export interface LeafShape {
    x: number;
    y: number;
    angle: number;
    scale: number;
    color: string;
    delay: number;
}
export interface BloomShape {
    x: number;
    y: number;
    delay: number;
    scale: number;
    color?: string;
}
export interface Garden {
    stems: StemShape[];
    leaves: LeafShape[];
    blooms: BloomShape[];
}

interface VineArgs {
    S: Vec;
    heading: Vec;
    bend: Vec;
    len: number;
    delay: number;
    depth: number;
    end: SproutEnd;
    branch: boolean;
    tuck: number;
    blooms?: number[];
}

function growVine(
    garden: Garden,
    rand: () => number,
    leafColors: string[],
    petalColors: string[],
    speed: number,
    a: VineArgs,
) {
    const { S, heading, bend, len, delay, depth, end, tuck } = a;
    const jitter = () => (rand() - 0.5) * len * 0.2;

    const start = add(S, mul(heading, -tuck));
    const E = add(add(S, mul(heading, len * 0.55)), mul(bend, len * 0.75));
    const c1 = add(S, { x: heading.x * len * 0.45 + jitter(), y: heading.y * len * 0.45 + jitter() });
    const c2 = add(E, {
        x: -bend.x * len * 0.35 + heading.x * len * 0.05 + jitter(),
        y: -bend.y * len * 0.35 + heading.y * len * 0.05 + jitter(),
    });

    const pts: Vec[] = [start];
    for (let i = 0; i <= 40; i++) pts.push(cubic(S, c1, c2, E, i / 40));
    const stemPoly = measure(pts.slice());

    let d = `M${r1(start.x)} ${r1(start.y)} L${r1(S.x)} ${r1(S.y)} C${r1(c1.x)} ${r1(c1.y)} ${r1(c2.x)} ${r1(c2.y)} ${r1(E.x)} ${r1(E.y)}`;

    if (end === "curl") {
        let th = Math.atan2(E.y - c2.y, E.x - c2.x);
        let p = { ...E };
        const dir = rand() < 0.5 ? 1 : -1;
        const N = 16;
        for (let k = 0; k < N; k++) {
            th += dir * (0.28 + k * 0.035);
            const step = 7 * (1 - k / N) + 1.4;
            p = add(p, { x: Math.cos(th) * step, y: Math.sin(th) * step });
            pts.push(p);
            d += ` L${r1(p.x)} ${r1(p.y)}`;
        }
    }

    const total = measure(pts).total;
    const duration = (0.45 + total / 320) / speed;
    garden.stems.push({
        d,
        length: total,
        delay,
        duration,
        retractDelay: depth ? 0.08 : 0.18,
        thin: depth > 0,
    });

    const stemLen = stemPoly.total;
    const from = tuck + 6;
    const count = Math.max(2, Math.round(stemLen / 24));
    let leafSide = rand() < 0.5 ? 1 : -1;
    for (let i = 0; i < count; i++) {
        const at = from + (stemLen - from) * (0.08 + i * (0.86 / count) + rand() * 0.04);
        const { p, angle } = pointAt(stemPoly, at);
        const frac = at / stemLen;
        garden.leaves.push({
            x: r1(p.x),
            y: r1(p.y),
            angle: r1(angle + leafSide * (45 + rand() * 25)),
            scale: Math.round((1.15 - frac * 0.5) * (depth ? 0.7 : 1) * (0.85 + rand() * 0.3) * 100) / 100,
            color: leafColors[Math.floor(rand() * leafColors.length)],
            delay: delay + duration * (at / total) * 0.85,
        });
        leafSide *= -1;
    }

    const vinePetalColor = petalColors[Math.floor(rand() * petalColors.length)];

    if (end === "bloom") {
        garden.blooms.push({
            x: r1(E.x),
            y: r1(E.y),
            delay: delay + duration * 0.9,
            scale: 1,
            color: vinePetalColor,
        });
    }

    for (const t of a.blooms ?? []) {
        const at = from + (stemLen - from) * Math.min(Math.max(t, 0), 1);
        const { p } = pointAt(stemPoly, at);
        garden.blooms.push({
            x: r1(p.x),
            y: r1(p.y),
            delay: delay + duration * (at / total) * 0.9,
            scale: 0.75,
            color: vinePetalColor,
        });
    }

    if (a.branch && depth === 0) {
        const at = stemLen * (0.42 + rand() * 0.12);
        const { p } = pointAt(stemPoly, at);
        const ahead = pointAt(stemPoly, at + 1).p;
        const tan = { x: ahead.x - p.x, y: ahead.y - p.y };
        const turn = rand() < 0.5 ? 1 : -1;
        growVine(garden, rand, leafColors, petalColors, speed, {
            S: p,
            heading: rotate(tan, turn * 55),
            bend: tan,
            len: len * 0.42,
            delay: delay + duration * (at / total) * 0.85,
            depth: 1,
            end: rand() < 0.5 ? "curl" : "bloom",
            branch: false,
            tuck: 0,
        });
    }
}

export function buildGarden(
    width: number,
    height: number,
    opts: {
        sprouts: Sprout[];
        seed: number;
        padding: number;
        tuck: number;
        speed: number;
        stagger: number;
        leafColors: string[];
        petalColors: string[];
    },
): Garden {
    const garden: Garden = { stems: [], leaves: [], blooms: [] };
    const rand = createRandom(opts.seed);
    const k = Math.min(1, Math.max(0.6, width / 420));

    opts.sprouts.forEach((s, i) => {
        const { p, n, tan } = edgeFrame(s.edge, s.t, width, height, opts.padding);
        const len = s.length * k;
        growVine(garden, rand, opts.leafColors, opts.petalColors, opts.speed, {
            S: p,
            heading: n,
            bend: mul(tan, s.side),
            len,
            delay: 0.04 + i * opts.stagger,
            depth: 0,
            end: s.end ?? "curl",
            branch: s.branch ?? len > 110,
            tuck: opts.tuck,
            blooms: s.blooms,
        });
    });
    return garden;
}

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduced(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);
    return reduced;
}

function useElementSize<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [size, setSize] = useState<{ w: number; h: number } | null>(null);
    useIsoLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const read = () => {
            const w = el.offsetWidth;
            const h = el.offsetHeight;
            setSize((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
        };
        read();
        const ro = new ResizeObserver(read);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    return [ref, size] as const;
}

export function OrganicGrowth({
    children,
    active,
    trigger = "hover-focus",
    sprouts = DEFAULT_SPROUTS,
    seed = 2,
    padding = 1,
    tuck = 18,
    speed = .8,
    stagger = 0.01,
    palette,
    onGrowChange,
    className,
    style,
}: OrganicGrowthProps) {
    const [contentRef, size] = useElementSize<HTMLDivElement>();
    const reduced = usePrefersReducedMotion();
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);

    const colors = { ...DEFAULT_PALETTE, ...palette };
    const listensHover = trigger === "hover" || trigger === "hover-focus";
    const listensFocus = trigger === "focus" || trigger === "hover-focus";
    const grown = active ?? ((listensHover && hovered) || (listensFocus && focused));

    useEffect(() => {
        onGrowChange?.(grown);
    }, [grown, onGrowChange]);

    useEffect(() => {
        if (!listensHover) return;
        const onDown = (e: PointerEvent) => {
            if (e.pointerType === "touch" && !contentRef.current?.contains(e.target as Node)) {
                setHovered(false);
            }
        };
        document.addEventListener("pointerdown", onDown);
        return () => document.removeEventListener("pointerdown", onDown);
    }, [listensHover, contentRef]);

    const sproutKey = JSON.stringify(sprouts);
    const leafKey = colors.leaves.join("|");
    const petalColors = useMemo(
        (): string[] =>
            colors.petals ?? (Array.isArray(colors.petal) ? (colors.petal as string[]) : [colors.petal]),
        [colors.petals, colors.petal],
    );
    const petalKey = petalColors.join("|");

    const garden = useMemo(
        () =>
            size
                ? buildGarden(size.w, size.h, {
                    sprouts,
                    seed,
                    padding,
                    tuck,
                    speed,
                    stagger,
                    leafColors: colors.leaves,
                    petalColors,
                })
                : null,
        [size, sproutKey, seed, padding, tuck, speed, stagger, leafKey, petalKey],
    );

    const onPointerEnter = useCallback(() => listensHover && setHovered(true), [listensHover]);
    const onPointerLeave = useCallback(
        (e: ReactPointerEvent) => {
            if (listensHover && e.pointerType !== "touch") setHovered(false);
        },
        [listensHover],
    );
    const onFocus = useCallback(() => listensFocus && setFocused(true), [listensFocus]);
    const onBlur = useCallback(
        (e: ReactFocusEvent) => {
            if (listensFocus && !e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
        },
        [listensFocus],
    );

    const stemStyle = (s: StemShape): CSSProperties => ({
        strokeDasharray: `${s.length} ${s.length + 4}`,
        strokeDashoffset: grown || reduced ? 0 : s.length + 2,
        transition: reduced
            ? "none"
            : grown
                ? `stroke-dashoffset ${s.duration}s ${EASE_GROW} ${s.delay}s`
                : `stroke-dashoffset ${0.5 / speed}s ${EASE_RETRACT} ${s.retractDelay}s`,
    });

    const popStyle = (delay: number, bounce = EASE_POP): CSSProperties => ({
        transform: grown || reduced ? "none" : "scale(0) rotate(-35deg)",
        transformOrigin: "0 0",
        transition: reduced
            ? "none"
            : grown
                ? `transform ${0.6 / speed}s ${bounce} ${delay}s`
                : `transform ${0.22 / speed}s ease-in 0s`,
    });

    return (
        <div className={className} style={{ position: "relative", ...style }}>
            {garden && size && (
                <svg
                    aria-hidden="true"
                    width={size.w + padding * 2}
                    height={size.h + padding * 2}
                    viewBox={`0 0 ${size.w + padding * 2} ${size.h + padding * 2}`}
                    style={{
                        position: "absolute",
                        left: -padding,
                        top: -padding,
                        overflow: "visible",
                        pointerEvents: "none",
                        zIndex: 0,
                        opacity: reduced ? (grown ? 1 : 0) : 1,
                        transition: reduced ? "opacity .4s ease" : undefined,
                    }}
                >
                    {garden.stems.map((s, i) => (
                        <path
                            key={`s${i}`}
                            d={s.d}
                            fill="none"
                            stroke={colors.stem}
                            strokeWidth={s.thin ? 1.4 : 2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={stemStyle(s)}
                        />
                    ))}
                    {garden.leaves.map((l, i) => (
                        <g key={`l${i}`} transform={`translate(${l.x} ${l.y}) rotate(${l.angle}) scale(${l.scale})`}>
                            <g style={popStyle(l.delay)}>
                                <path d={LEAF_PATH} fill={l.color} />
                                <path d="M1.5 0L19 0" stroke={colors.rib} strokeWidth={0.8} opacity={0.45} fill="none" />
                            </g>
                        </g>
                    ))}
                    {garden.blooms.map((b, i) => (
                        <g key={`b${i}`} transform={`translate(${b.x} ${b.y}) scale(${b.scale * (colors.flowerScale ?? 1)})`}>
                            <g style={popStyle(b.delay, "cubic-bezier(.34,1.7,.64,1)")}>
                                {[0, 72, 144, 216, 288].map((deg) => (
                                    <ellipse
                                        key={deg}
                                        cx={0}
                                        cy={-5.5}
                                        rx={3.6}
                                        ry={5.4}
                                        transform={`rotate(${deg})`}
                                        fill={b.color || (Array.isArray(colors.petal) ? colors.petal[i % colors.petal.length] : colors.petal)}
                                        stroke={colors.petalStroke}
                                        strokeWidth={0.6}
                                    />
                                ))}
                                <circle r={2.6} fill={colors.pollen} />
                            </g>
                        </g>
                    ))}
                </svg>
            )}

            <div
                ref={contentRef}
                style={{ position: "relative", zIndex: 1 }}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                onFocus={onFocus}
                onBlur={onBlur}
            >
                {children}
            </div>
        </div>
    );
}

export default OrganicGrowth;
