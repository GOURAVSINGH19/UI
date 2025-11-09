"use client"

import { useState, useEffect } from "react"
import Search_bar from "./Search_bar/Search_bar"
import { Github, Menu, Search } from "lucide-react"
import Link from "next/link"

const Navbar = () => {
    const [Open, setOpen] = useState(false)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault()
                setOpen(true)
            }
            if (event.key === 'Escape' && Open) {
                setOpen(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [Open])

    return (
        <header className="w-full fixed top-[.5rem] left-0 z-50 text-sm">
            <nav className=" max-w-screen-xl mx-auto p-[.8rem] px-[2rem]  rounded-[1rem] gap-10 flex justify-between items-center">
                <div className="font-semibold w-fit md:block hidden">
                    <Link href="/">
                        <p>_Ghibli_</p>
                    </Link>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="md:hidden cursor-pointer"><Menu className="w-4 h-4" /></div>
                    <p className="w-full font-medium md:hidden">Menu</p>
                </div>
                <ul className="w-full md:flex gap-6 font-medium  hidden">
                    <Link href="/docs">
                        <li className="cursor-pointer">Docs</li>
                    </Link>
                    <Link href="/components">
                        <li className="cursor-pointer">Components</li>
                    </Link>
                    {/* <Link href="/charts">
                        <li className="cursor-pointer">Charts</li>
                    </Link> */}
                </ul>
                <div className="flex items-center gap-4">
                    <div onClick={() => setOpen(!Open)} className="flex  justify-between cursor-pointer relative items-center lg:w-fit h-[2em] bg-[var(--bg)] shadow-[var(--shadow-s)] rounded-lg  px-[1rem] py-[1rem] outline-0 text-sm" >
                        <p className="border-r-1 border-white mr-4 pr-4">
                            <Search className="w-4 h-4" />
                        </p>
                        <div className="right-[10px] flex items-center gap-2 text-[12px] text-neutral-500">
                            <div className="bg-[var(--bg-light)]  flex items-center justify-center rounded-sm px-[6px] py-[2px]">⌘</div>
                            <div className="bg-[var(--bg-light)]  flex items-center justify-center rounded-sm px-[8px] py-[2px] ">K</div>
                        </div>
                    </div>
                    <Link href='https://github.com/GOURAVSINGH19/UI' target="_blank">
                        <button className='rounded-sm py-2 px-2  button-3 bg-[var(--bg)] flex items-center gap-2 w-max shadow-[var(--shadow-m)] cursor-pointer hover:shadow-[var(--shadow-l)]'>
                            <Github className='w-3 h-3' />
                        </button>
                    </Link>
                </div>
            </nav>
            {
                Open &&
                <div className='fixed inset-0 h-screen z-[20000] backdrop-blur-[1px]'>
                    <Search_bar Open={setOpen} />
                </div>
            }
        </header>
    )
}
export default Navbar