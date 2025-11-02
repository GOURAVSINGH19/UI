"use client"

import { BentoCard } from "./bentocard"

const cards = [
  {
    id: 1,
    title: "Feature One",
    description: "This is the large featured card that spans 3 columns",
    span: 3,
    accent: "from-blue-500 to-cyan-500",
    content: (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            ✨
          </div>
          <p className="text-lg font-semibold text-foreground">Premium Feature</p>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Feature Two",
    description: "Secondary card spanning 2 columns",
    span: 2,
    accent: "from-purple-500 to-pink-500",
    content: (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">⚡</div>
          <p className="text-foreground font-medium">Lightning Fast</p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Feature Three",
    description: "Tertiary card spanning 2 columns",
    span: 2,
    accent: "from-emerald-500 to-teal-500",
    content: (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">🎨</div>
          <p className="text-foreground font-medium">Beautiful Design</p>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Feature Four",
    description: "Another card spanning 2 columns",
    span: 2,
    accent: "from-orange-500 to-red-500",
    content: (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">🚀</div>
          <p className="text-foreground font-medium">Ready to Launch</p>
        </div>
      </div>
    ),
  },
]

export function BentoGrid() {
  return (
    <div className="grid grid-cols-6 gap-6 auto-rows-[300px]">
      {cards.map((card) => (
        <div key={card.id} className={`col-span-${card.span}`}>
          <BentoCard card={card} />
        </div>
      ))}
    </div>
  )
}
