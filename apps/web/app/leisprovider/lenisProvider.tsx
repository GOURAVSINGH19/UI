'use client'
import { useEffect, useRef } from 'react'
import ReactLenis, { useLenis } from "lenis/react"
import type { LenisRef } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

export const LenisProvider = () => {
    const lenisRef = useRef<LenisRef | null>(null)

    // GSAP's ticker is the only clock driving Lenis (autoRaf is off), so the
    // scroll advances exactly once per frame and stays in sync with ScrollTrigger.
    useEffect(() => {
        function update(time: number) {
            lenisRef.current?.lenis?.raf(time * 1000)
        }
        gsap.ticker.add(update)
        gsap.ticker.lagSmoothing(0)
        return () => {
            gsap.ticker.remove(update)
        }
    }, [])

    // Keep ScrollTrigger positions in step with the smoothed scroll.
    useLenis(ScrollTrigger.update)

    return (
        <ReactLenis
            root
            ref={lenisRef}
            options={{
                autoRaf: false,
                lerp: 0.1,
                smoothWheel: true,
                syncTouch: false,
                allowNestedScroll: true,
                // Smooth-scroll in-page "#section" links, clearing the fixed navbar.
                anchors: { offset: -80 },
            }}
        />
    )
}
