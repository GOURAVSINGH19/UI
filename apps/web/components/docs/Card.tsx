"use client"
import { ChartBarBig, CloudUpload, GemIcon, HandMetalIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react'

const cn = (...classes: string[]) => classes.join(" ");

const Card = () => {
    const icons = [
        {
            circle: "circle-1",
            icons: <GemIcon className='size-4 text-pink-600 dark:text-white' />,
            title: "gemicon"
        },
        {
            circle: "circle-2",
            icons: <ChartBarBig className='size-4 text-pink-600 dark:text-white' />,
            title: "gemicon"
        },
        {
            circle: "circle-3",
            icons: <CloudUpload className='size-4 text-pink-600 dark:text-white' />,
            title: "gemicon"
        },
        {
            circle: "circle-4",
            icons: <HandMetalIcon className='size-4 text-pink-600 dark:text-white' />,
            title: "gemicon"
        },
    ]

    const { theme, setTheme } = useTheme();
    const handleChange = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }
    return (
        <div className='relative  h-full w-full flex items-center justify-center'>
            <div className='h-80 w-60 rounded-xl relative z-10 bg-neutral-200 dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden'>
                <div className='relative  mask-b-from-50%  mask-r-from-50% mask-l-from-50% mask-t-from-50%'>
                    <Pattern />
                    <div className='flex items-center gap-4 justify-center h-40 animate-marquee'>
                        {icons.map((items,_) => {
                            return (
                                <div key={items.circle} className={cn("rounded-full bg-neutral-400 flex items-center justify-center size-10")}>
                                    {items.icons}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='p-4'>
                    <h2 className='font-bold text-neutral-600 text-[12px]'>
                        These LLMs are getting out of hand
                    </h2>
                    <p className='text-neutral-400 text-[16px] mt-2'>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    </p>
                </div>
            </div>
            <Pattern />
            <button onClick={handleChange} className='px-4 py-2 rounded-full bg-neutral-100 text-[16px] cursor-pointer mt-4 absolute top-[2%] right-[5%] z-10'>
                switch
            </button>
        </div>
    )
}

const Pattern = () => {
    return (
        <div className={cn(
            "absolute inset-0 z-0 rounded-lg mx-auto",
            "bg-[image:repeating-linear-gradient(31deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_50%)] bg-[size:10px_10px] bg-fixed pointer-events-none")}>
        </div>
    )
}

export default Card