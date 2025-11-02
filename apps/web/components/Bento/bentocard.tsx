"use client"

import type React from "react"

interface BentoCardProps {
  card: {
    id: number
    title: string
    description: string
    span: number
    accent: string
    content: React.ReactNode
  }
}

export function BentoCard({ card }: BentoCardProps) {
  return (
    <div className="relative h-full rounded-xl overflow-hidden group">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        style={{
          animation: "borderRotate 3s linear infinite",
        }}
      />

      <div className="relative h-full bg-card rounded-xl p-6 flex flex-col justify-between overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${card.accent} rounded-xl`}
          style={{
            padding: "1px",
            mask: "linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
            animation: "borderRotate 4s linear infinite",
            opacity: 0.6,
          }}
        />

        {/* Content wrapper */}
        <div className="relative z-10">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-foreground mb-2">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </div>

          <div className="flex-1">{card.content}</div>
        </div>

        {/* Hover glow effect */}
        <div
          className={`absolute -bottom-1/2 -right-1/2 w-1/2 h-1/2 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-r ${card.accent}`}
          style={{
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  )
}
