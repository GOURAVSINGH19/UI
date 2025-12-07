"use client";

import { cn } from "@workspace/ui/lib/utils";
import { motion, type PanInfo } from "motion/react";
import { useRef, useState } from "react";
import NumberFlow from "@number-flow/react";

export const SliderScore = ({
    className,
    initial = 0
}: {
    className?: string,
    initial?: number
}) => {
    const [value, setValue] = useState(initial);
    const barContainerRef = useRef<HTMLDivElement>(null);

    const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (!barContainerRef.current) return;

        const rect = barContainerRef.current.getBoundingClientRect();
        const x = info.point.x - rect.left;
        const percentage = Math.min(Math.max(x / rect.width, 0), 1);

        const newValue = Math.round(percentage * 100);
        setValue(newValue);
    };

    return (
        <div
            ref={barContainerRef}
            className={cn(
                "relative mt-10 bg-[var(--bg)] w-[14rem] py-[4px] px-1 rounded-md flex items-center shadow-[inset_0.5px_.5px_.2px_#fffff9,0_1px_1px_1px_#00000030,0_2px_2px_#00000015] overflow-hidden",
                className
            )}
        >
            <motion.div
                animate={{ width: `${value}%` }}
                transition={{ type: "spring", stiffness: 600, damping: 30 }}
                className="relative z-[3] py-3 rounded-sm p-1 bg-[#274acd] overflow-hidden flex justify-end items-center"
            >
                <span className="bg-neutral-400 rounded-sm h-4 w-1 h-full rounded-sm"></span>
                <motion.div
                    drag="x"
                    dragElastic={0}
                    dragConstraints={barContainerRef}
                    onDrag={handleDrag}
                    className="absolute top-1/2 -translate-y-1/2 z-[3] h-4 flex justify-end items-center w-full cursor-grab active:cursor-grabbing" />
            </motion.div>
            <div className="absolute top-1/2 -translate-y-1/2 flex justify-around items-center w-full h-full">
                <div className="w-1 h-1 bg-neutral-600 rounded-full"></div>
                <div className="w-1 h-1 bg-neutral-600 rounded-full"></div>
                <div className="w-1 h-1 bg-neutral-900 rounded-full"></div>
            </div>
            <span className="absolute z-[10] right-4 text-xs pointer-events-none">
                <NumberFlow value={value} transformTiming={{ duration: 600, easing: "ease-out" }} />
            </span>
        </div>
    );
};
