"use client";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState, useMemo } from 'react'
import { ArrowRight, X, CornerUpLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { docsConfig } from '@/config/docs';
import { SidebarNavItem } from '@/types/nav';

const Search_bar = ({ Open }: { Open: Dispatch<SetStateAction<boolean>> }) => {
    const [Search, setSearch] = useState('');
    const Inputref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (Inputref.current) {
            Inputref.current.focus();
        }
    }, [])

    const handlenavigate = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
        if (e.key === 'Escape' && Open) {
            Open(false)
        }
    }

    const handleclick = () => {
        if (Open) {
            Open(false);
        }
    }

    const allItems = useMemo(() => {
        const items: Array<{ title: string; href: string; category: string }> = [];
        
        docsConfig.sidebarNav.forEach((section) => {
            const flattenItems = (navItems: SidebarNavItem[], category: string) => {
                navItems.forEach((item) => {
                    if (item.href) {
                        items.push({
                            title: item.title,
                            href: item.href,
                            category: category
                        });
                    }
                    if (item.items && item.items.length > 0) {
                        flattenItems(item.items, category);
                    }
                });
            };
            
            flattenItems(section.items, section.title);
        });
        
        return items;
    }, []);

    const filteredItems = useMemo(() => {
        if (!Search.trim()) {
            return [];
        }
        
        const searchLower = Search.toLowerCase().trim();
        return allItems.filter(item => 
            item.title.toLowerCase().includes(searchLower) ||
            item.category.toLowerCase().includes(searchLower)
        );
    }, [Search, allItems]);

    const groupedResults = useMemo(() => {
        const groups: Record<string, Array<{ title: string; href: string }>> = {};
        
        filteredItems.forEach(item => {
            if (!groups[item.category]) {
                groups[item.category] = [];
            }
            groups[item.category].push({ title: item.title, href: item.href });
        });
        
        return groups;
    }, [filteredItems]);

    const handleItemClick = () => {
        if (Open) {
            Open(false);
        }
    }
    return (
        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 4, animationDuration: 800 }} className='w-[90%] md:w-[80%] lg:w-[50%] mx-auto absolute bottom-0 left-[50%] -translate-x-[50%]  bg-neutral-800 px-4 pt-[1rem] rounded-t-2xl'>
            <div className='w-full'>
                <p onClick={handleclick} onKeyDown={handlenavigate} tabIndex={0} className='rounded-full  px-6 py-3 bg-[var(--bg)] flex items-start gap-2 w-max shadow-[var(--shadow-m)] cursor-pointer hover:shadow-[var(--shadow-l)]'>
                    <CornerUpLeft className='w-4 h-4' />
                    <span className='text-sm text-[#ffffff68]'>Esc</span>
                </p>
            </div>
            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 4, animationDuration: 100 }} className='p-[1rem] rounded-t-md bg-[var(--bg)] mt-2 shadow-[var(--shadow-m)]'>
                <div className='relative'>
                    <input ref={Inputref} type="text" value={Search} onChange={(e) => setSearch(e.target.value)} placeholder='Search...' className='w-full py-2 px-2 rounded-lg bg-[var(--bg)] shadow-[var(--shadow-m)] outline-none border-none text-[var(--foreground)]' />
                    <X onClick={() => setSearch("")} className='hover:scale-[.9] cursor-pointer absolute right-[1rem] top-[50%] -translate-y-[50%] w-4' />
                </div>
                <div className="min-h-full h-60 scrollbar-hide overflow-y-auto  flex flex-col items-start justify-start text-[12px] text-[#ffffff54] mt-4" style={{ scrollbarWidth: "none" }}>
                    {Search.trim() ? (
                        filteredItems.length > 0 ? (
                            <>
                                <h1 className='text-md mb-2'>Search Results</h1>
                                {Object.entries(groupedResults).map(([category, items]) => (
                                    <div key={category} className='w-full mb-4'>
                                        <h2 className='text-xs text-[#ffffff68] mb-2 uppercase tracking-wider'>{category}</h2>
                                        {items.map((item) => (
                                            <Link 
                                                key={item.href} 
                                                href={item.href}
                                                onClick={handleItemClick}
                                            >
                                                <div className='rounded-sm p-2 text-[14px] hover:bg-[var(--bg)] hover:shadow-[var(--shadow)] text-white cursor-pointer flex items-center gap-2'>
                                                    <span className='text-zinc-500'><ArrowRight className='w-[16px]' /></span>
                                                    {item.title}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className='w-full flex items-center justify-center h-full'>
                                <p className='text-[14px] text-[#ffffff68]'>No results found</p>
                            </div>
                        )
                    ) : (
                        <>
                            <h1 className='text-md mb-2'>Pages</h1>
                            {docsConfig.sidebarNav.map((section) => (
                                <div key={section.title} className='w-full mb-2'>
                                    <h2 className='text-xs text-[#ffffff68] mb-2 uppercase tracking-wider'>{section.title}</h2>
                                    {section.items.filter(item => item.href).map((item) => (
                                        <Link 
                                            key={item.href} 
                                            href={item.href!}
                                            onClick={handleItemClick}
                                        >
                                            <div className='rounded-sm p-2 text-[14px] hover:bg-[var(--bg)] hover:shadow-[var(--shadow)] text-white cursor-pointer flex items-center gap-2'>
                                                <span className='text-zinc-500'><ArrowRight className='w-[16px]' /></span>
                                                {item.title}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Search_bar