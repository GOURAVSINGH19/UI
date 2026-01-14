"use client";

import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";

export const SliderScore = ({
    className,
    initial = 10
}: {
    className?: string,
    initial?: number
}) => {
    const [value, setValue] = useState<number>(initial);
    const barContainerRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const Minwidth = 10;

    const updateValueFromEvent = (clientX: number) => {
        if (!barContainerRef.current) return;

        const rect = barContainerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.min(Math.max(x / rect.width, 0), 1);
        const eased = Math.pow(percentage, 1.5);
        setValue(Math.floor(eased * 100));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        draggingRef.current = true;
        updateValueFromEvent(e.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!draggingRef.current) return;
        updateValueFromEvent(e.clientX);
    };

    const handleMouseUp = () => {
        draggingRef.current = false;
    };

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);


    return (
        <div
            ref={barContainerRef}
            className={cn(
                "relative mt-10 w-[18rem] bg-[#121212] py-4 px-2 rounded-md flex items-center overflow-hidden ring-[.4px] ring-[#fff]/20",
                className
            )}
            onMouseDown={handleMouseDown}
        >
            <div className="p-1 w-full">
                <div
                    className="absolute left-0 top-0 bottom-0 right-0  bg-[#274acd] rounded-sm z-[2] shadow-[var(--shadow-m)] flex justify-end items-center"
                    style={{
                        width: value === 0
                            ? `${Minwidth}px`
                            : `max(${Minwidth}px, ${value}%)`
                    }}
                >
                    <div
                        className="relative cursor-grab hover:cursor-grabbing px-1 w-full h-full"
                        onMouseDown={handleMouseDown}
                    >
                        <div style={{ left: `calc(${value}% + .2rem)` }} className="w-[.1rem] h-4 bg-neutral-900 rounded-xs z-[10] sticky right-0 top-1/2 -translate-y-1/2" />
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 flex justify-around items-center z-[1] pointer-events-none">
                <div className="w-1 h-1 bg-neutral-600 rounded-full" />
                <div className="w-1 h-1 bg-neutral-600 rounded-full" />
                <div className="w-1 h-1 bg-neutral-600 rounded-full" />
            </div>

            <span className="absolute z-[10] right-4 text-xs pointer-events-none">
                <NumberFlow value={value} transformTiming={{ duration: 600, easing: "ease-in-out" }} className="pointer-events-none" />
            </span>
        </div>

    );
};
