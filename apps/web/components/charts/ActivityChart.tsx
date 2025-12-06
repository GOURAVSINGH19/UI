"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";

interface ChartData {
    day: string;
    examPassed: number;
    lessonTaken: number;
}

const defaultData: ChartData[] = [
    { day: "Sunday", examPassed: 20, lessonTaken: 30 },
    { day: "Monday", examPassed: 45, lessonTaken: 30 },
    { day: "Tuesday", examPassed: 25, lessonTaken: 15 },
    { day: "Wednesday", examPassed: 25, lessonTaken: 40 },
    { day: "Thursday", examPassed: 30, lessonTaken: 45 },
    { day: "Friday", examPassed: 25, lessonTaken: 15 },
    { day: "Saturday", examPassed: 10, lessonTaken: 12 },
];

export default function ActivityChart({ data = defaultData, firstName = "Exam Passed", secondName = "Lesson Taken" }: { data?: ChartData[], firstName: string, secondName: string }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [activePeriod, setActivePeriod] = useState<number>(0);
    const [displayData, setDisplayData] = useState<ChartData[]>(data);

    React.useEffect(() => {
        if (activePeriod === 0) {
            setDisplayData(data);
        } else {
            const newData = data.map(item => ({
                ...item,
                examPassed: Math.floor(Math.random() * 50) + 10,
                lessonTaken: Math.floor(Math.random() * 50) + 10,
            }));
            setDisplayData(newData);
        }
    }, [activePeriod, data]);

    const maxValue = Math.max(
        ...displayData.map((d) => Math.max(d.examPassed, d.lessonTaken))
    );

    const getHeight = (value: number) => {
        return (value / (maxValue * 1.2)) * 100;
    };

    return (
        <div className="w-full bg-white text-black p-6 rounded-md ring-2 ring-white/30 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Activity Statistic</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Track your progress in active courses
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex gap-2 bg-gray-200 rounded-lg p-1 ring-1 ring-black/15">
                        {["7D", "1M", "6M", "1Y"].map((period, i) => (
                            <button
                                key={period}
                                className={cn(
                                    "px-3 py-1 ring-1 ring-white/50 cursor-pointer text-xs font-medium rounded-md transition-all",
                                    i === activePeriod
                                        ? "bg-white text-black shadow-sm"
                                        : "text-gray-500 hover:text-gray-600"
                                )}
                                onClick={() => setActivePeriod(i)}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Report
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-[#8b5cf6] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:4px_4px]" />
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{firstName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-[#60a5fa] bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:4px_4px]" />
                    <span className="text-xs text-gray-400 font-medium">{secondName}</span>
                </div>
            </div>

            <div className="relative h-[240px] w-full flex items-end justify-between pl-8 pb-6">
                <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-500 font-medium z-10 pointer-events-none">
                    <span>100</span>
                    <span>0</span>
                </div>

                <div className="absolute inset-0 w-full h-[85%] border-t border-b border-dashed border-gray-100 pointer-events-none" style={{ top: '7.5%' }} />

                <div className="flex justify-between items-end w-full h-full px-2 sm:px-4">
                    {displayData.map((item, index) => (
                        <div
                            key={index}
                            className="relative flex flex-col justify-end items-center group h-full w-full"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="flex items-end gap-1 sm:gap-2 h-full">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${getHeight(item.examPassed)}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
                                    className="w-6 sm:w-8 rounded-t-md bg-[#8b5cf6] relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:4px_4px]" />
                                </motion.div>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${getHeight(item.lessonTaken)}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 + 0.1 }}
                                    className="w-6 sm:w-8 rounded-t-md bg-[#60a5fa] cursor-pointer hover:opacity-90 transition-opacity"
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:4px_4px]" />
                                </motion.div>
                            </div>

                            <span className="absolute -bottom-6 text-[10px] text-gray-500 font-medium tracking-wide">
                                {item.day}
                            </span>

                            <AnimatePresence>
                                {hoveredIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-[80%] left-1/2 -translate-x-1/2 z-20 mb-2"
                                    >
                                        <div
                                            className="bg-[#23252A] ring-1 ring-white/20 text-white text-[10px] p-2.5 rounded-lg w-32 flex flex-col gap-1.5 relative overflow-hidden"
                                        >
                                            <p className="text-gray-400 border-b border-gray-800 pb-1 mb-1 font-medium">{item.day}</p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-[2px] bg-[#8b5cf6] relative overflow-hidden">
                                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:2px_2px]" />
                                                    </div>
                                                    <span>{firstName}</span>
                                                </div>
                                                <span className="font-bold">{item.examPassed}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-[2px] bg-[#60a5fa]" />
                                                    <span>{secondName}</span>
                                                </div>
                                                <span className="font-bold">{item.lessonTaken}</span>
                                            </div>
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
