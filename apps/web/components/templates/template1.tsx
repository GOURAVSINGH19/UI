'use client'
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const projectDetails = [
    { title: "Minimal Table", src: "/img1.png" },
    { title: "Nordic Table", src: "/img2.png" },
    { title: "Wooden Shelf", src: "/img3.png" },
    { title: "Modern Lamp", src: "/img4.png" },
    { title: "Oak Cabinet", src: "/img5.png" },
]
gsap.registerPlugin(ScrollTrigger)
const Tempalte = () => {
    const [activeIndex, setactiveIndex] = useState(0);
    const containerRef = useRef<(HTMLDivElement | null)[]>([]);


    useEffect(() => {
        const handleScroll = () => {
            const viewportCenter = window.innerHeight / 2;
            let closestIndex = 0;
            let minDistance = Infinity;

            containerRef.current.forEach((ref, index) => {
                if (ref) {
                    const rect = ref.getBoundingClientRect();
                    const elementCenter = rect.top + rect.height / 2;
                    const distance = Math.abs(viewportCenter - elementCenter);

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestIndex = index;
                    }
                }
            });
            setactiveIndex(closestIndex);
        }
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useGSAP(() => {
        gsap.utils.toArray<HTMLElement>(".list-container").forEach((container) => {
            const scaleTl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: .5
                }
            })
            scaleTl.fromTo(container, {
                scale: .5
            }, {
                scale: 2,
                ease: "none"
            }).to(container, {
                scale: .5,
                ease: "none"
            })
        })
    }, [])
    
    return (
        <div className="my-[36.25svh] w-full flex flex-col gap-[18vh] items-center text-white relative">
            {
                projectDetails.map((project, index) => (
                    <div key={index} ref={(el) => { containerRef.current[index] = el }} className=" flex h-fit w-[45vw] lg:w-[12.5vw] items-center overflow-hidden list-container">
                        <div className="relative h-[27.5svh] w-full">
                            <Image fill src={project.src} alt={project.title} className="object-cover" sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw" />
                        </div>
                    </div>
                ))
            }
            <div className="fixed bottom-30 left-60 px-5 flex w-full justify-between">
                <div className="flex gap-5">
                    <span>({String(activeIndex + 1).padStart(2,"0")})</span>
                    <span>{projectDetails[activeIndex].title}</span>
                </div>
            </div>
        </div >
    )
}

export default Tempalte