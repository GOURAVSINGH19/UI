'use client'
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";

interface MenuItem {
    id: string
    label: string
    icon: React.ReactNode
}

const menuItems: MenuItem[] = [
    {
        id: "personal-info",
        label: "Personal info",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" strokeWidth="1.5" />
                <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" strokeWidth="1.5" />
            </svg>
        ),
    },
    {
        id: "account-security",
        label: "Account Security",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="19" cy="12" r="1" fill="currentColor" />
                <circle cx="5" cy="12" r="1" fill="currentColor" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeWidth="1.5" />
            </svg>
        ),
    },
    {
        id: "templates",
        label: "Templates",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" strokeWidth="1.5" />
                <rect x="14" y="3" width="7" height="7" strokeWidth="1.5" />
                <rect x="3" y="14" width="7" height="7" strokeWidth="1.5" />
                <rect x="14" y="14" width="7" height="7" strokeWidth="1.5" />
            </svg>
        ),
    },
    {
        id: "manage-users",
        label: "Manage users",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="9" cy="8" r="3" strokeWidth="1.5" />
                <path d="M3 14c0-2 2-3 6-3s6 1 6 3" strokeWidth="1.5" />
                <circle cx="17" cy="10" r="2" strokeWidth="1.5" />
                <path d="M14 16c0-1.5 1.5-2.5 4-2.5s4 1 4 2.5" strokeWidth="1.5" />
            </svg>
        ),
    },
    {
        id: "settings",
        label: "Settings",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                <path
                    d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6m-17.78 7.78l4.24-4.24m5.08-5.08l4.24-4.24"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            </svg>
        ),
    }
]

export default function PopupExample() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <motion.div className="w-full h-fit flex justify-center items-center">
            <div className="relative w-full">
                <div className="w-full mb-2 flex justify-end px-2 overflow-hidden flex-shrink-0 pointer-events-none">
                    <div
                        onClick={toggleOpen}
                        className="w-10 h-10 rounded-sm cursor-pointer duration-600 ease-in-out hover:scale-[.98] pointer-events-auto"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1760625525684-3564699070a5?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600"
                            alt="User"
                            className="w-full h-full object-cover rounded-sm"
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            key="popup"
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.97 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute top-12 right-0 w-[60vw] sm:w-[40vw]  min-h-[60vh] 
                bg-[var(--bg-dark)] shadow-[var(--shadow-m)] rounded-md overflow-hidden 
                "
                        >
                            <div className="upper_col relative">
                                <div
                                    className={cn(
                                        "w-full p-4 flex gap-2 items-center",
                                        "bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.2)_0.3px,rgba(255,255,255,0.2)_1px,transparent_.5px,transparent_20px),repeating-linear-gradient(to_bottom,rgba(255,255,255,0.2)_0px,rgba(255,255,255,0.2)_1px,transparent_1px,transparent_20px)] [mask-image:linear-gradient(to_bottom_right,black,transparent)]"
                                    )}
                                >
                                    <div className="w-8 h-8 rounded-sm">
                                        <motion.img
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.1 }}
                                            transition={{ duration: 1, ease: "easeInOut" }}
                                            src="https://images.unsplash.com/photo-1760625525684-3564699070a5?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600"
                                            alt="client_photo"
                                            className="rounded-sm object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <h1 className="font-medium text-[16px] text-white">@email</h1>
                                        <p className="text-[12px] text-gray-200">Personal</p>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="w-full h-[1px] bg-neutral-800"></div>
                                <div className="p-2 w-full max-h-[20vh] overflow-y-auto">
                                    <div className="p-2 bg-[var(--bg)] backdrop-filter-xs w-full rounded-sm h-full">
                                        <p className="text-[12px] text-gray-500 mb-2">
                                            Switch Workspaces
                                        </p>
                                        <div className="mb-2 flex items-center justify-between gap-4">
                                            <div className="flex items-center justify-start gap-2">
                                                <div className="w-6 h-6 bg-purple-400 rounded-sm flex justify-center items-center">
                                                    A
                                                </div>
                                                <p className="text-[12px] text-neutral-300">
                                                    Aman Workspaces
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mb-2 flex items-center justify-between gap-4">
                                            <div className="flex items-center justify-start gap-2">
                                                <div className="w-6 h-6 cursor-pointer bg-[var(--bg-light)] rounded-sm flex justify-center items-center">
                                                    +
                                                </div>
                                                <p className="text-[12px] cursor-pointer text-neutral-300">Create new</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-[1px] bg-neutral-800"></div>

                                <div className="space-y-1 p-2 w-full">
                                    {menuItems.map((item) => (
                                        <button
                                            key={item.id}
                                            className='rounded-sm p-1 w-full text-[14px] hover:bg-[var(--bg)] hover:shadow-[var(--shadow)] text-white cursor-pointer flex items-center gap-2'
                                        >
                                            <span className="text-gray-400 flex-shrink-0 rounded-full">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="w-full h-[1px] bg-neutral-800"></div>
                                <div className="w-full p-2">
                                    <button className={cn("w-full flex items-center gap-2",
                                        "rounded-sm px-0 py-1 text-[14px] hover:bg-[var(--bg)] hover:shadow-[var(--shadow)] text-white cursor-pointer flex items-center gap-2"
                                    )}>
                                        <p className="rounded-full p-1 text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </p>
                                        <p>logout</p>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
