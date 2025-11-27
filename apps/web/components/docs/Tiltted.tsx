"use client";

import { cn } from "@workspace/ui/lib/utils";
import React from "react";

export interface TiltedCard {
  id: string;
  content?: React.ReactNode;
  backgroundImage?: string;
  backgroundGradient?: string;
  className?: string;
  text?: string;
  textClassName?: string;
}

export interface TiltedCardsProps {
  cards: TiltedCard[];
  containerClassName?: string;
  cardWidth?: number;
  cardHeight?: number;
  tiltAngle?: number;
  spacing?: number;
  perspective?: number;
}

export const TiltedCards = ({
  cards,
  containerClassName,
  cardWidth = 400,
  cardHeight = 200,
  tiltAngle = 55,
  spacing = 200,
  perspective = 2000,
}: TiltedCardsProps) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full bg-white overflow-hidden",
        containerClassName
      )}
    >
      <div className="flex flex-1 items-center justify-center py-20">
        <div
          className="relative flex items-center justify-center"
          style={{
            perspective: `${perspective}px`,
            height: `${cardHeight}px`,
          }}
        >
          <div className="relative flex items-center">
            {cards.map((card, index) => {
              const zIndex = cards.length - index;
              const translateX = index * spacing;
              const translateY = index;

              return (
                <div
                  key={card.id}
                  className={cn(
                    "absolute",
                    card.className
                  )}
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    transform: `translateX(${translateX}px) translateY(${-translateY}px) rotateY(${tiltAngle}deg) translateZ(${zIndex * 10}px)`,
                    zIndex: zIndex,
                    backgroundImage: card.backgroundImage
                      ? `url(${card.backgroundImage})`
                      : undefined,
                    background: card.backgroundGradient || undefined,
                    backgroundSize: card.backgroundImage ? "cover" : undefined,
                    backgroundPosition: card.backgroundImage
                      ? "center"
                      : undefined,
                    backgroundRepeat: card.backgroundImage
                      ? "no-repeat"
                      : undefined,
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-2xl">
                    <div className="absolute inset-0" />
                    {card.content && (
                      <div className="relative z-10 h-full w-full p-6">
                        {card.content}
                      </div>
                    )}
                    {card.text && (
                      <div
                        className={cn(
                          "relative z-10 flex h-full w-full items-center justify-center p-6 text-white",
                          card.textClassName
                        )}
                      >
                        {card.text}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Tiltted = () => {
  const exampleCards: TiltedCard[] = [
    {
      id: "1",
      backgroundGradient:
        "purple",
      className: "bg-gradient-to-b from-green-500 via-yellow-400 to-white",
    },
    {
      id: "2",
      text: "drone",
      textClassName: "text-6xl font-bold opacity-90",
      className: "bg-gradient-to-b from-neutral-800 to-white",
    },
    {
      id: "3",
      backgroundImage:
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=900&q=80",
      className: "bg-gradient-to-b from-blue-400 to-white",
      content: (
        <div className="absolute left-4 top-4 flex items-center gap-2 text-white">
          <div className="h-4 w-4 bg-black"></div>
          <span className="text-sm">Click to start music.</span>
        </div>
      ),
    },
    {
      id: "4",
      backgroundImage:
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=900&q=80",
      className: "bg-gradient-to-b from-blue-400 to-white",
      content: (
        <div className="absolute left-4 top-4 flex items-center gap-2 text-white">
          <div className="h-4 w-4 bg-black"></div>
          <span className="text-sm">Click to start music.</span>
        </div>
      ),
    },
    {
      id: "5",
      backgroundImage:
        "orange",
      className: "bg-gradient-to-b from-blue-400 to-white",
    },
  ];

  return (
    <div className="prespective-distinct transform-3d">
      <TiltedCards
        cards={exampleCards}
      />
    </div>
  );
};

