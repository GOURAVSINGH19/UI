import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function usePrefersReducedMotion() {
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

export function useElementSize<T extends HTMLElement>() {
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
