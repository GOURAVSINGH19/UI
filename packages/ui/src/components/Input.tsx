'use client'
import React from "react"
import { cn } from "@workspace/ui/lib/utils";


const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ placeholder, type, className, ...props }, ref) => {
    return (
        <div className='relative'>
            <input
                type={type}
                placeholder={`${placeholder}`}
                className={cn(className, "w-full py-2.5 px-3 rounded-sm bg-[var(--bg)] shadow-[var(--shadow-m)] outline-none border-none text-[var(--foreground)]")}
                ref={ref}
            />
        </div>
    )
})
Input.displayName = "Input"

export default Input;