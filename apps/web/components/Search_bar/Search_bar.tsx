"use client";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { ArrowRight, X, CornerUpLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const Search_bar = ({ Open }: { Open: Dispatch<SetStateAction<boolean>> }) => {
    const router = useRouter();
    const [Search, setSearch] = useState('');
    const Inputref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (Inputref.current) {
            Inputref.current.focus();
        }
    }, [])

    const handlenavigate = () => {
        router.push('/');
        Open(false)
    }
    return (
        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 4, animationDuration: 800 }} className='w-[90%] md:w-[80%] lg:w-[50%] mx-auto absolute bottom-0 left-[50%] -translate-x-[50%]  bg-neutral-800 px-4 pt-[1rem] rounded-t-2xl'>
            <p onClick={handlenavigate} className='rounded-full  p-3 bg-[var(--bg)] flex items-start gap-2 w-max shadow-[var(--shadow-m)] cursor-pointer hover:shadow-[var(--shadow-l)]'>
                <CornerUpLeft className='w-4 h-4' />
                <span className='text-sm text-[#ffffff68]'>Go to Page</span>
            </p>
            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 4, animationDuration: 100 }} className='p-[1rem] rounded-t-md bg-[var(--bg)] mt-2 shadow-[var(--shadow-m)]'>
                <div className='relative'>
                    <input ref={Inputref} type="text" value={Search} onChange={(e) => setSearch(e.target.value)} placeholder='Search...' className='w-full py-2 px-2 rounded-lg bg-[var(--bg)] shadow-[var(--shadow-m)] outline-none border-none text-[var(--foreground)]' />
                    <X onClick={()=>setSearch("")} className='hover:scale-[.9] cursor-pointer absolute right-[1rem] top-[50%] -translate-y-[50%] w-4' />
                </div>
                <div className="min-h-full h-60 scrollbar-hide overflow-y-auto  flex flex-col items-start justify-start text-[12px] text-[#ffffff54] mt-4" style={{ scrollbarWidth: "none" }}>
                    <h1 className='text-md'>Pages</h1>
                    <div className='w-full '>
                        <div className='rounded-sm p-2 text-[14px] hover:bg-[var(--bg)] hover:shadow-[var(--shadow)] text-white cursor-pointer flex items-center gap-2'>
                            <span className='text-zinc-500'><ArrowRight className='w-[16px]' /></span> Docs
                        </div>
                    </div>
                    <div className='w-full '>
                        <div className='rounded-sm p-2 text-[14px] hover:bg-[var(--bg)] hover:shadow-[var(--shadow)] text-white cursor-pointer flex items-center gap-2'>
                            <span className='text-zinc-500'><ArrowRight className='w-[16px]' /></span> Components
                        </div>
                    </div>
                    <div className='w-full '>
                        <div className='rounded-sm p-2 text-[14px] hover:bg-[var(--bg)] hover:shadow-[var(--shadow)] text-white cursor-pointer flex items-center gap-2'>
                            <span className='text-zinc-500'><ArrowRight className='w-[16px]' /></span> Charts
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Search_bar