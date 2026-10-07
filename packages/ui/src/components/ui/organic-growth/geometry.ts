import { type Edge, type SproutEnd } from "./types";

export type Vec = { x: number; y: number };

export const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
export const mul = (a: Vec, k: number): Vec => ({ x: a.x * k, y: a.y * k });
export const rotate = (v: Vec, deg: number): Vec => {
    const r = (deg * Math.PI) / 180;
    const c = Math.cos(r);
    const s = Math.sin(r);
    return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
};
export const r1 = (n: number) => Math.round(n * 10) / 10;

export const cubic = (p0: Vec, p1: Vec, p2: Vec, p3: Vec, t: number): Vec => {
    const u = 1 - t;
    return {
        x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
        y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
    };
};

export function createRandom(seed: number) {
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

export function measure(pts: Vec[]): Polyline {
    const cum = [0];
    for (let i = 1; i < pts.length; i++) {
        cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    }
    return { pts, cum, total: cum[cum.length - 1] };
}

export function pointAt(poly: Polyline, dist: number): { p: Vec; angle: number } {
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

export function edgeFrame(edge: Edge, t: number, w: number, h: number, pad: number) {
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

export interface VineArgs {
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
