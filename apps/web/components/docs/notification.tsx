'use client'
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import { LogOut } from "lucide-react";

export interface NotificationMenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onSelect?: () => void;
}

export interface NotificationWorkspaceItem {
    id: string;
    label: string;
    avatar?: React.ReactNode;
}

export interface NotificationProps {
    avatarSrc: string;
    avatarAlt?: string;
    userLabel: string;
    userSubLabel?: string;
    menuItems: NotificationMenuItem[];
    workspaces?: NotificationWorkspaceItem[];
    onCreateWorkspace?: () => void;
    onLogout?: () => void;
    className?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function NotificationMenu(props: NotificationProps) {
    const {
        avatarSrc,
        avatarAlt = "User",
        userLabel,
        userSubLabel,
        menuItems,
        workspaces = [],
        onCreateWorkspace,
        onLogout,
        className,
        open,
        onOpenChange,
    } = props;

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : uncontrolledOpen;
    const setOpen = (next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
    };

    return (
        <motion.div className={cn("w-full h-fit flex justify-center items-center", className)}>
            <div className="relative w-full">
                <div className="w-full mb-2 flex justify-end px-2 flex-shrink-0 pointer-events-none">
                    <button
                        type="button"
                        onClick={() => setOpen(!isOpen)}
                        className="w-10 h-10 rounded-sm  ring-1 ring-white/20 cursor-pointer duration-600 ease-in-out hover:scale-[.98] pointer-events-auto overflow-hidden"
                        aria-expanded={isOpen}
                        aria-haspopup="menu"
                    >
                        <Image
                            src={avatarSrc}
                            alt={avatarAlt}
                            className="w-full h-full object-cover rounded-sm"
                            width={100}
                            height={100}
                        />
                    </button>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            key="popup"
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.97 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className={cn("absolute top-12 right-2 w-[60vw] sm:w-[26vw]  min-h-[56vh] bg-[var(--bg-dark)] ring-[.5px] ring-white/50 rounded-sm overflow-hidden", className)}
                            role="menu"
                        >
                            <div className="upper_col relative">
                                <div
                                    className={cn(
                                        "w-full p-2 flex gap-2 items-center",
                                        "bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.2)_0.2px,rgba(255,255,255,0.2)_1px,transparent_.5px,transparent_20px),repeating-linear-gradient(to_bottom,rgba(255,255,255,0.2)_0px,rgba(255,255,255,0.2)_1px,transparent_1px,transparent_20px)] [mask-image:linear-gradient(to_bottom_right,black,transparent)]"
                                    )}
                                >
                                    <div className="w-8 h-8 rounded-sm overflow-hidden ring-1 ring-white/20">
                                        <motion.img
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.1 }}
                                            transition={{ duration: 1, ease: "easeInOut" }}
                                            src={avatarSrc}
                                            alt={avatarAlt}
                                            className="rounded-sm object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="flex flex-col items-start justify-center">
                                        <h1 className="font-medium text-[16px] text-white">{userLabel}</h1>
                                        {userSubLabel ? (
                                            <p className="text-[12px] text-neutral-300">{userSubLabel}</p>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="w-full h-[1px] bg-neutral-800" />

                                {(workspaces.length > 0 || onCreateWorkspace) && (
                                    <div className="p-1 w-full max-h-[20vh] overflow-y-auto">
                                        <div className="p-2 bg-[var(--bg)] backdrop-filter-xs w-full rounded-sm h-full">
                                            <p className="text-[12px] text-neutral-500 mb-2">Switch Workspaces</p>
                                            {workspaces.map((ws) => (
                                                <div key={ws.id} className="mb-2 flex items-center justify-between gap-4">
                                                    <div className="flex items-center justify-start gap-2">
                                                        {ws.avatar ?? (
                                                            <div className="w-4 h-4 bg-purple-400 rounded-sm flex justify-center items-center" />
                                                        )}
                                                        <p className="text-[12px] text-neutral-300">{ws.label}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {onCreateWorkspace && (
                                                <button
                                                    type="button"
                                                    onClick={onCreateWorkspace}
                                                    className="mb-2 flex items-center justify-start gap-2"
                                                >
                                                    <div className="w-4 h-4 cursor-pointer bg-[var(--bg-light)] rounded-sm flex justify-center items-center">
                                                        +
                                                    </div>
                                                    <p className="text-[12px] cursor-pointer text-neutral-300">Create new</p>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="w-full h-[1px] bg-neutral-800" />

                                <div className="px-2 py-1 w-full">
                                    {menuItems.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => item.onSelect?.()}
                                            className="rounded-sm p-1 w-full text-[14px] hover:bg-[var(--bg)] hover:shadow-[inset_-1px_0px_1px_#ffffff30,0_1px_2px_2px_#00000030,0_2px_2px_#00000015] text-white cursor-pointer flex items-center gap-2"
                                            role="menuitem"
                                        >
                                            {item.icon ? (
                                                <span className="text-gray-400 flex-shrink-0 rounded-full">{item.icon}</span>
                                            ) : null}
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="w-full h-[1px] bg-neutral-800" />
                                <div className="w-full px-2.5 py-1">
                                    {onLogout && (
                                        <button
                                            type="button"
                                            onClick={onLogout}
                                            className={cn(
                                                "w-full flex items-center gap-2",
                                                "rounded-sm px-1 py-1 text-[14px] hover:bg-[var(--bg)] hover:shadow-[inset_-1px_0px_1px_#ffffff30,0_1px_2px_2px_#00000030,0_2px_2px_#00000015] text-white cursor-pointer"
                                            )}
                                        >
                                            <LogOut className="w-3 h-3 text-neutral-400"/>
                                            <span>logout</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default NotificationMenu;


