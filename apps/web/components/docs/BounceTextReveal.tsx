'use client'

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { SplitText } from "gsap/all"
import { cn } from "@workspace/ui/lib/utils"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(SplitText, ScrollTrigger)


export const BounceTextReveal = ({ text, className }: { text: string, className?: string }) => {
    const contaierRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useGSAP(() => {
        if (!contaierRef.current || !textRef.current) {
            return
        }
        gsap.set(textRef.current, { x: "100vw" });

        const splitText = SplitText.create(textRef.current, { type: "chars" });

        const totalWidth = textRef.current.scrollWidth;
        const viewWidth = window.innerWidth;

        const finalposition = - (totalWidth - viewWidth / 2);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: contaierRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                pin: contaierRef.current,
                pinSpacing: false,
                invalidateOnRefresh: true
            }
        })

        gsap.set(splitText.chars, {
            yPercent: "random(-250,250)",
            rotation: "random(-30,30)",
        })

        tl.to(textRef.current, { x: finalposition, duration: 1.4, ease: "none" })
        tl.to(splitText.chars, { yPercent: 0, rotation: 0, duration: 0.8, ease: "back.out(2)", stagger: { amount: 1 } }, 0)

    }, { scope: contaierRef })
    return (
        <section ref={contaierRef} className={cn("relative h-[300vh] ", className)}>
            <div className="relative  h-screen flex items-center justify-center overflow-hidden">
                <p ref={textRef} className="text-[14vw] lg:text-[9vw] text-bold text-neutral-500 whitespace-nowrap will-change-transform">{text}</p>
            </div>
        </section>
    )
}