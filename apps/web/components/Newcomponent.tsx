"use client";

import { motion } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import { ThreedScrollAnimation } from "./3D/Lapes";

const LatestComponent = () => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full space-y-4 md:block mt-10 relative z-[10]"
        >
            <div
                className={cn(
                    "mx-auto overflow-hidden relative w-full max-w-3xl bg-neutral-50/80 border-[.5px] border-[#FDFDFD] ring-1 rounded-md"
                )}
            >
                <div className="relative flex flex-col">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground absolute left-4 top-6 rounded-[14px] border border-black/10 text-base md:left-6">
                        <Image src="./open.svg" alt="svg" width={14} height={14} />
                        <h4 className="text-black">New component</h4>
                    </div>
                    <div className="flex flex-col justify-start pb-2 pl-4 pt-14 md:items-start mt-4 ml-2"></div>
                </div>
                <div className="mx-auto w-[40vw]"> 
                    <ThreedScrollAnimation />
                </div>
            </div>
        </motion.section>
    );
};

export default LatestComponent;
