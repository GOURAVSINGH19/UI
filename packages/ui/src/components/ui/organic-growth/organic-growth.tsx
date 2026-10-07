"use client"

import { type CSSProperties, type FocusEvent as ReactFocusEvent, type PointerEvent as ReactPointerEvent, useCallback, useEffect, useMemo, useState } from "react";
import { buildGarden } from "./garden";
import { type StemShape, rotate } from "./geometry";
import { useElementSize, usePrefersReducedMotion } from "./hooks";
import { DEFAULT_PALETTE, DEFAULT_SPROUTS, EASE_GROW, EASE_POP, EASE_RETRACT, LEAF_PATH, type OrganicGrowthProps } from "./types";

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
