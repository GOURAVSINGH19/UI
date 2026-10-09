"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { cue } from "@/lib/sound"

const HEART_PATH =
    "M12 21s-7.5-4.6-9.6-9.3C.9 8.4 2.7 4.5 6.4 4c2.1-.3 4 .7 5.6 2.6C13.6 4.7 15.5 3.7 17.6 4c3.7.5 5.5 4.4 4 7.7C19.5 16.4 12 21 12 21Z"
const HEART_COLORS = ["#f21e29", "#ff4d6d", "#ff8fa3", "#e11d48", "#fb7185"]

type FloatingHeart = { id: number; x: number; y: number; rotate: number; scale: number; duration: number; delay: number; color: string }
type LikeResponse = { count: number | null; liked: boolean }

// Site-wide like count, shared by every visitor. One like per person: the server
// enforces it (see app/api/likes + lib/likes.ts); here we just skip repeat requests.
function useLikes() {
    const [count, setCount] = useState<number | null>(null)
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        let alive = true
        fetch("/api/likes")
            .then((res) => {
                if (!res.ok) throw new Error(`likes: ${res.status}`)
                return res.json() as Promise<LikeResponse>
            })
            .then((data) => {
                if (!alive) return
                setCount(data.count)
                setLiked(data.liked)
            })
            .catch(() => { })
        return () => {
            alive = false
        }
    }, [])

    const like = () => {
        if (liked) return // already counted; the heart burst still plays for fun
        setLiked(true)
        setCount((c) => (c === null ? c : c + 1)) // optimistic
        fetch("/api/likes", { method: "POST" })
            .then((res) => {
                if (!res.ok) throw new Error(`likes: ${res.status}`)
                return res.json() as Promise<LikeResponse>
            })
            .then((data) => data.count !== null && setCount(data.count))
            .catch(() => { })
    }

    return { count, liked, like }
}

/** Click the heart: it pops and a little cloud of hearts rises, drifts and evaporates. */
export function LikeButton() {
    const { count, liked, like } = useLikes()
    const [hearts, setHearts] = useState<FloatingHeart[]>([])

    const burst = () => {
        if (!liked) cue("success", { emphasis: "subtle" })
        like()
        const now = Date.now()
        const next = Array.from({ length: 9 }, (_, i) => ({
            id: now + i,
            x: (Math.random() - 0.5) * 70,
            y: -(45 + Math.random() * 55),
            rotate: (Math.random() - 0.5) * 70,
            scale: 0.45 + Math.random() * 0.6,
            duration: 0.9 + Math.random() * 0.7,
            delay: i * 0.035,
            color: HEART_COLORS[i % HEART_COLORS.length]!,
        }))
        setHearts((current) => [...current, ...next])
    }

    return (
        <motion.button
            type="button"
            data-sound="off"
            aria-label={liked ? "You liked Kinetik, thank you!" : "Like Kinetik"}
            aria-pressed={liked}
            onClick={burst}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="group btn btn-secondary relative h-8 gap-2 pr-3 pl-2.5 text-sm text-ui-strong"
        >
            <span className="relative grid place-items-center">
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className={`size-3.5 origin-[50%_60%] transition-colors duration-150 group-hover:text-[#f21e29] ${liked ? "text-[#f21e29]" : "text-ui-caption"}`}
                >
                    <path fill="currentColor" d={HEART_PATH} />
                </svg>
                <span aria-hidden className="pointer-events-none absolute inset-0">
                    {hearts.map((h) => (
                        <motion.svg
                            key={h.id}
                            viewBox="0 0 24 24"
                            className="absolute top-0 left-0 size-3.5"
                            style={{ color: h.color }}
                            initial={{ opacity: 1, x: 0, y: 0, scale: 0.3, rotate: 0, filter: "blur(0px)" }}
                            animate={{ opacity: 0, x: h.x, y: h.y, scale: h.scale, rotate: h.rotate, filter: "blur(1.5px)" }}
                            transition={{ duration: h.duration, delay: h.delay, ease: [0.2, 0.7, 0.3, 1] }}
                            onAnimationComplete={() => setHearts((current) => current.filter((c) => c.id !== h.id))}
                        >
                            <path fill="currentColor" d={HEART_PATH} />
                        </motion.svg>
                    ))}
                </span>
            </span>
            <span className="tabular-nums" aria-live="polite">
                {count === null ? (
                    <span className="opacity-50">–</span>
                ) : (
                    // Re-keyed on change so each new like ticks the number in.
                    <motion.span
                        key={count}
                        className="inline-block"
                        initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {count.toLocaleString("en-US")}
                    </motion.span>
                )}{" "}
                {count === 1 ? "like" : "likes"}
            </span>
        </motion.button>
    )
}
