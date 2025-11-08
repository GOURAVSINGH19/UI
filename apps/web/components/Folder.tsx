"use client"

import { useState } from "react"

export default function Folder() {
    return (
        <div className="flex items-center justify-center bg-gradient-to-br from-black-50 to-white-100">
            <SpreadsheetIcon />
        </div>
    )
}

function SpreadsheetIcon() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)

    const cards = [
        { id: 1, rotate: 0, side: "center" },
    ]

    return (
        <div className="flex items-center justify-center gap-6">
            {cards.map((card) => (
                <div
                    key={card.id}
                    className="relative transition-transform duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredCard(card.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                        transform: `${hoveredCard === card.id
                            ? card.side === "center"
                                ? "scale(1.1)"
                                : `rotate(${card.rotate > 0 ? 12 : -12}deg)`
                            : `rotate(${card.rotate}deg)`
                            }`,
                    }}
                >
                    <svg
                        width="128"
                        height="96"
                        viewBox="0 0 128 96"
                        className="w-32 h-24 transition-all duration-300"
                        style={{
                            filter:
                                hoveredCard === card.id
                                    ? "drop-shadow(0 20px 25px rgb(0 0 0 / 0.15))"
                                    : "drop-shadow(0 10px 15px rgb(0 0 0 / 0.08))",
                        }}
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g opacity={card.side === "left" ? "0.4" : "0.3"}>
                            <rect x="12" y="18" width="48" height="60" rx="6" fill="white" stroke="#e5e7eb" strokeWidth="1" />
                            <rect x="16" y="22" width="32" height="3" rx="1.5" fill="#d1d5db" />
                            <rect x="16" y="30" width="28" height="2" rx="1" fill="#e5e7eb" />
                            <rect x="16" y="34" width="28" height="2" rx="1" fill="#e5e7eb" />
                            <rect x="16" y="38" width="24" height="2" rx="1" fill="#e5e7eb" />
                            <rect x="16" y="46" width="12" height="2" rx="1" fill="#d1d5db" />
                            <rect x="30" y="46" width="12" height="2" rx="1" fill="#d1d5db" />
                            <rect x="16" y="51" width="12" height="2" rx="1" fill="#d1d5db" />
                            <rect x="30" y="51" width="12" height="2" rx="1" fill="#d1d5db" />
                        </g>

                        <g opacity={card.side === "right" ? "0.4" : "0.3"}>
                            <rect x="68" y="18" width="48" height="60" rx="6" fill="white" stroke="#e5e7eb" strokeWidth="1" />
                            <rect x="72" y="22" width="32" height="3" rx="1.5" fill="#d1d5db" />
                            <rect x="72" y="30" width="28" height="2" rx="1" fill="#e5e7eb" />
                            <rect x="72" y="34" width="28" height="2" rx="1" fill="#e5e7eb" />
                            <rect x="72" y="46" width="12" height="2" rx="1" fill="#d1d5db" />
                            <rect x="86" y="46" width="12" height="2" rx="1" fill="#d1d5db" />
                            <rect x="72" y="51" width="12" height="2" rx="1" fill="#d1d5db" />
                            <rect x="86" y="51" width="12" height="2" rx="1" fill="#d1d5db" />
                        </g>

                        <g>
                            <rect
                                x="40"
                                y="22"
                                width="56"
                                height="64"
                                rx="8"
                                fill="#000"
                                opacity={hoveredCard === card.id ? "0.15" : "0.08"}
                                className="transition-opacity duration-300"
                            />

                            <rect
                                x="40"
                                y="20"
                                width="56"
                                height="64"
                                rx="8"
                                fill={hoveredCard === card.id ? "#f0f9ff" : "white"}
                                stroke={hoveredCard === card.id ? "#93c5fd" : "#e5e7eb"}
                                strokeWidth="1"
                                className="transition-all duration-300"
                            />

                            <line x1="40" y1="34" x2="96" y2="34" stroke="#e5e7eb" strokeWidth="1" />
                            <rect x="43" y="24" width="24" height="2" rx="1" fill="#d1d5db" />
                            <rect x="43" y="29" width="16" height="1.5" rx="0.75" fill="#e5e7eb" />

                            <defs>
                                <linearGradient id="excelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#60a5fa" />
                                    <stop offset="100%" stopColor="#2563eb" />
                                </linearGradient>
                            </defs>
                            <rect x="48" y="40" width="14" height="14" rx="3" fill="url(#excelGrad)" />
                            <text
                                x="55"
                                y="48"
                                fontSize="6"
                                fontWeight="bold"
                                fill="white"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                X
                            </text>
                            <rect x="65" y="40" width="6" height="6" rx="1" fill="#dbeafe" stroke="#bfdbfe" strokeWidth="0.5" />
                            <rect x="72" y="40" width="6" height="6" rx="1" fill="#f0f9ff" stroke="#bfdbfe" strokeWidth="0.5" />
                            <rect x="79" y="40" width="6" height="6" rx="1" fill="#dbeafe" stroke="#bfdbfe" strokeWidth="0.5" />
                            <rect x="65" y="47" width="6" height="6" rx="1" fill="#f0f9ff" stroke="#bfdbfe" strokeWidth="0.5" />
                            <rect x="72" y="47" width="6" height="6" rx="1" fill="#dbeafe" stroke="#bfdbfe" strokeWidth="0.5" />
                            <rect x="79" y="47" width="6" height="6" rx="1" fill="#f0f9ff" stroke="#bfdbfe" strokeWidth="0.5" />
                        </g>
                    </svg>
                </div>
            ))}
        </div>
    )
}
