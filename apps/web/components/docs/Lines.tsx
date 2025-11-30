'use client'
import { useScroll, useTransform, motion, useMotionTemplate } from "motion/react";
import { useRef } from "react";
const Lines = () => {
    const container = useRef<null>(null);
    return (
        <div ref={container} className='w-full h-[40px]'>
            <Topright />
            <Bottomleft />
        </div>
    )
}

const paths = [
    { d: "M26 0V400C26 510.457 115.543 600 226 600H321", stroke: "#121212", width: 52, dash: 809.204 },
    { d: "M76 0V400C76 482.843 143.157 550 226 550H321", stroke: "#121212", width: 52, dash: 653 },
    { d: "M126 0V400C126 455.228 170.772 500 226 500H321", stroke: "#121212", width: 52, dash: 652.102 },
    { d: "M176 0V400C176 427.614 198.386 450 226 450H321", stroke: "#121212", width: 52, dash: 573.551 },
    { d: "M26 0V400C26 510.457 115.543 600 226 600H321", stroke: "#F489A3", width: 48, dash: 809.204 },
    { d: "M76 0V400C76 482.843 143.157 550 226 550H321", stroke: "#F0BB0D", width: 48, dash: 730.653 },
    { d: "M126 0V400C126 455.228 170.772 500 226 500H321", stroke: "#F3A20F", width: 48, dash: 652.102 },
    { d: "M176 0V400C176 427.614 198.386 450 226 450H321", stroke: "#F97028", width: 48, dash: 573.551 }
];

const Topright = () => {
    const { scrollYProgress } = useScroll();
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            viewBox="0 0 321 626"
            fill="none"
            className="rainbow-sides__right"
        >
            {paths.map((path, i) => {
                const dash1 = useTransform(scrollYProgress, [0, 1], [path.dash, 0]);
                const dash2 = useTransform(scrollYProgress, [0, 1], [0.1, 99999]);
                const strokeDasharray = useMotionTemplate`${dash1}px, ${dash2}px`;

                return (
                    <motion.path
                        key={i}
                        d={path.d}
                        stroke={path.stroke}
                        strokeWidth={path.width}
                        style={{
                            strokeDasharray,
                            strokeDashoffset: 0
                        }}
                    />
                );
            })}
        </svg>
    );
}


const bottomLeftPaths = [
    { d: "M26 0V400C26 510.457 115.543 600 226 600H321", stroke: "#121212", width: 20, length: 809.204 },
    { d: "M76 0V400C76 482.843 143.157 550 226 550H321", stroke: "#121212", width: 52, length: 730.653 },
    { d: "M126 0V400C126 455.228 170.772 500 226 500H321", stroke: "#121212", width: 52, length: 652.102 },
    { d: "M176 0V400C176 427.614 198.386 450 226 450H321", stroke: "#121212", width: 52, length: 573.551 },
    { d: "M26 0V400C26 510.457 115.543 600 226 600H321", stroke: "#F489A3", width: 48, length: 809.204 },
    { d: "M76 0V400C76 482.843 143.157 550 226 550H321", stroke: "#F0BB0D", width: 48, length: 730.653 },
    { d: "M126 0V400C126 455.228 170.772 500 226 500H321", stroke: "#F3A20F", width: 48, length: 652.102 },
    { d: "M176 0V400C176 427.614 198.386 450 226 450H321", stroke: "#F97028", width: 48, length: 573.551 }
];

export const Bottomleft = () => {
    const { scrollYProgress } = useScroll();

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            viewBox="0 0 321 626"
            fill="none"
            className="rainbow-sides__left"
        >
            {bottomLeftPaths.map((path, index) => {
                const strokeDasharray = `${path.length}px, 99999px`;
                const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [0, -path.length]);
                return (
                    <motion.path
                        key={index}
                        d={path.d}
                        stroke={path.stroke}
                        strokeWidth={path.width}
                        style={{
                            strokeDasharray,
                            strokeDashoffset
                        }}
                    />
                );
            })}
        </svg>
    );
};


export default Lines