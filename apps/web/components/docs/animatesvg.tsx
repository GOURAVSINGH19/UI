'use client'
import { motion } from "framer-motion"
export const Svg = () => {
    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 480"
            className="absolute bottom-0 -z-11 inset-0 w-full h-1/2 points-events-none"
            preserveAspectRatio="none"
        >
            <defs>
                <filter id="curveGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <linearGradient id="gradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0,212,255,0.0)" />
                    <stop offset="50%" stopColor="rgba(0,212,255,0.9)" />
                    <stop offset="100%" stopColor="rgba(0,212,255,0.0)" />
                </linearGradient>
                <linearGradient id="gradMagenta" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,0,153,0.0)" />
                    <stop offset="50%" stopColor="rgba(255,0,153,0.85)" />
                    <stop offset="100%" stopColor="rgba(255,0,153,0.0)" />
                </linearGradient>
                <linearGradient id="gradPurple" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(167,139,250,0.0)" />
                    <stop offset="50%" stopColor="rgba(167,139,250,0.9)" />
                    <stop offset="100%" stopColor="rgba(167,139,250,0.0)" />
                </linearGradient>
                <linearGradient id="gradGold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,200,87,0.0)" />
                    <stop offset="50%" stopColor="rgba(255,200,87,0.85)" />
                    <stop offset="100%" stopColor="rgba(255,200,87,0.0)" />
                </linearGradient>
            </defs>

            <motion.path
                d="M0,280 C240,200 480,360 720,280 C960,200 1200,360 1440,280"
                fill="none"
                stroke="url(#gradCyan)"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeDasharray="240 960"
                filter="url(#curveGlow)"
                animate={{ strokeDashoffset: [0, -1200] }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            />

            <motion.path
                d="M0,220 C240,140 480,300 720,220 C960,140 1200,300 1440,220"
                fill="none"
                stroke="url(#gradMagenta)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeDasharray="160 800"
                filter="url(#curveGlow)"
                animate={{ strokeDashoffset: [0, -960] }}
                transition={{ duration: 10, ease: "linear", repeat: Infinity, delay: 0.5 }}
            />

            <motion.path
                d="M0,340 C240,260 480,420 720,340 C960,260 1200,420 1440,340"
                fill="none"
                stroke="url(#gradPurple)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeDasharray="200 880"
                filter="url(#curveGlow)"
                animate={{ strokeDashoffset: [0, -1080] }}
                transition={{ duration: 9, ease: "linear", repeat: Infinity, delay: 1 }}
            />

            <motion.path
                d="M0,260 C180,190 540,320 720,260 C900,200 1260,330 1440,260"
                fill="none"
                stroke="url(#gradGold)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeDasharray="120 720"
                filter="url(#curveGlow)"
                animate={{ strokeDashoffset: [0, -840] }}
                transition={{ duration: 11, ease: "linear", repeat: Infinity, delay: 1.5 }}
            />
        </motion.svg>
    )
}