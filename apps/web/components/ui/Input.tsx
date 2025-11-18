'use client'
import React from "react"
import { cn } from "@workspace/ui/lib/utils";


const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ placeholder, type = "text", value, className, ...props }, ref) => {
    return (
        <div className='relative'>
            <input
                type={type}
                placeholder={`${placeholder}`}
                className={cn(className, "w-full py-1.5 px-[.6rem] rounded-sm bg-[var(--bg)] shadow-[var(--shadow-s)] outline-none border-none text-[var(--foreground)] text-xs")}
                ref={ref}
                value={value}
                {...props}
            />
        </div>
    )
})
Input.displayName = "Input"

export default Input;