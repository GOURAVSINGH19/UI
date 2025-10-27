'use client';
import { useState } from "react";
const colors = [
    "#ff4d4d",
    "#4d79ff",
    "#4dff88",
    "#ffb84d",
    "#b84dff",
    "#4de0ff",
];


export default function Sidenav() {
    const [activeTab, setActiveTab] = useState("Components");
    const [colors, setColors] = useState<string[]>([]);
    return (
        <aside className="w-full min-h-full">
            <div className="w-full mb-8 flex flex-col items-start justify-start gap-2">
                <p className={`text-md font-medium cursor-pointer  ${activeTab === "Components" ? "text-white" : "text-zinc-700"}`} onClick={() => setActiveTab("Components")}>Components</p>
                <p className={`text-md font-medium cursor-pointer ${activeTab === "Charts" ? "text-white" : "text-zinc-700"}`} onClick={() => setActiveTab("Charts")}>Charts</p>
                <p className={`text-md font-medium cursor-pointer ${activeTab === "Auth" ? "text-white" : "text-zinc-700"}`} onClick={() => setActiveTab("Auth")}>Auth</p>
            </div>
        </aside>
    )
}