"use client"

import { useState } from "react"
import Search_bar from "./Search_bar/Search_bar"
import { Menu } from "lucide-react"

const Navbar = () => {
    const [Open, setOpen] = useState(false)

    return (
        <header className="w-full fixed top-[.5rem] left-0 z-50 text-sm">
            <nav className=" max-w-screen-xl mx-auto p-[.8rem] px-[2rem]  rounded-[1rem] gap-10 flex justify-between items-center">
                <div className="font-semibold w-fit md:block hidden">_Ghibli_</div>
                <div className="flex gap-2 items-center">
                    <div className="md:hidden cursor-pointer"><Menu className="w-4 h-4"/></div>
                    <p className="w-full font-medium md:hidden">Menu</p>
                </div>
                <ul className="w-full md:flex gap-6 font-medium  hidden">
                    <li className="cursor-pointer">Docs</li>
                    <li className="cursor-pointer">Components</li>
                    <li className="cursor-pointer">Charts</li>
                </ul>
                <div className="flex">
                    <div onClick={() => setOpen(!Open)} className="w-[35vw]  md:w-[30vw] flex  justify-between cursor-default relative items-center lg:w-[20vw] h-[2em] bg-[var(--bg-light)] shadow-[var(--shadow-s)] rounded-lg  px-[1rem] py-[1rem] outline-0 text-sm" >
                        <p className="text-[1vw]">Search Components...</p>
                        <div className="right-[10px] flex items-center gap-2 text-[12px] text-[#ffffff54]">
                            <div className="bg-[var(--bg)]  flex items-center justify-center rounded-md px-[8px] py-[2.5px]">Ctrl</div>
                            <div className="bg-[var(--bg)]  flex items-center justify-center rounded-md px-[8px] py-[2.5px] ">K</div>
                        </div>
                    </div>
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