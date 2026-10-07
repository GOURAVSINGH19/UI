import { type CSSProperties, type ReactNode } from "react";

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
export const EASE_GROW = "cubic-bezier(.25,.6,.35,1)";
export const EASE_RETRACT = "cubic-bezier(.55,0,.8,.35)";
export const EASE_POP = "cubic-bezier(.34,1.56,.64,1)";
export const LEAF_PATH = "M0 0C5 -6.5 15 -7.5 23 0C15 7.5 5 6.5 0 0Z";
