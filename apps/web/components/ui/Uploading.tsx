"use client"

import type React from "react"
import { useState } from "react"
import { X, HelpCircle, Folder } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface UploadedFile {
    id: string
    name: string
    size: string
    progress: number
}

export function UploadedFile() {
    const [files, setFiles] = useState<UploadedFile[]>([
        {
            id: "1",
            name: "profile-page-ui.png",
            size: "2.3MB",
            progress: 85,
        },
    ])

    const handleRemoveFile = (id: string) => {
        setFiles(files.filter((f) => f.id !== id))
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files
        if (selectedFiles) {
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-800 p-4">
            <div className="w-full max-w-sm bg-[var(--bg)] rounded-sm shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
                    <h2 className="text-sm font-regular text-zinc-300 capitalize">Upload File</h2>
                    <button className="w-6 h-6 rounded-full bg-[var(--bg-light)] text-center flex items-center justify-center shadow-[var(--shadow-m)]">
                        <X className="w-3 h-3 cursor-pointer" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <label className="block">
                        <div className="rounded-xs border-1 border-dashed border-neutral-700 bg-[repeating-linear-gradient(31deg,rgba(255,255,255,0.2)_0.9px,rgba(255,255,255,0.2)_1px,transparent_.5px,transparent_10px),repeating-linear-gradient(-31deg,rgba(255,255,255,0.2)_0.9px,rgba(255,255,255,0.2)_1px,transparent_1px,transparent_10px)] stopOpacity-image:linear-gradient(to_bottom_right,black,transparent)]  px-8 py-14 text-center cursor-pointer transition-all shadow-[var(--shadow-s)]">
                            <Pattern />
                            <div className="flex justify-center mb-6">
                                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-3">
                                    svg
                                </div>
                            </div>
                            <p className="text-neutral-500 font-medium text-xs">
                                Drag and drop or <span className="text-neutral-300">choose file</span> to upload.
                            </p>
                            <p className="text-sm text-neutral-500 mt-1 text-xs">Image format: <span className="underline text-neutral-400">JPG</span>, <span className="underline text-neutral-400">PNG</span> & <span className="underline text-neutral-400">SVG</span>. <span className="text-neutral-300">Max 5.0MB</span></p>
                        </div>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/svg+xml"
                            onChange={handleFileInputChange}
                            className="hidden"
                        />
                    </label>

                    {files.length > 0 && (
                        <div className="space-y-3">
                            {files.map((file) => (
                                <div key={file.id} className="flex items-center gap-3 bg-neutral-300 rounded-lg p-3 border border-purple-200">
                                    <div className="flex-shrink-0 bg-gradient-to-br from-white-300 to-orange-400 rounded-md p-2">
                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                                        </svg>
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-1 mb-1">
                                            <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                            <span className="text-xs text-gray-500 flex-shrink-0">({file.size})</span>
                                        </div>
                                        <div className="w-full bg-neutral-400 rounded-full h-3 flex justify-start items-center">
                                            <div
                                                className="bg-[var(--bg-light)] m-[.2em]  to-blue-600 h-[.4em] rounded-full transition-all"
                                                style={{ width: `${file.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-xs font-semibold text-gray-600 w-6 text-right">{file.progress}%</span>
                                        <button
                                            onClick={() => handleRemoveFile(file.id)}
                                            className="shadow-[var(--shadow-s)] bg-[var(--bg)] rounded-full cursor-pointer p-1 flex items-center justify-center"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-zinc-800 px-6 py-4">
                    <button className="text-gray-500 hover:text-gray-600 transition-colors p-2">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                    <div className="flex gap-2">
                        <button className="bg-[var(--bg-light)] shadow-[var(--shadow-s)] text-sm px-3 py-1 rounded-md border-purple-300 text-neutral-200 cursor-pointer ">
                            Cancel
                        </button>
                        <button className="bg-purple-800 shadow-[var(--shadow-s)] text-sm px-3 py-1 rounded-md border-purple-300 text-neutral-200 cursor-pointer ">
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Pattern = () => {
    return (
        <div className={cn(
            "absolute inset-0 z-0 rounded-lg mx-auto",
            "[--pattern-fg:var(--color-neutral-900)/2] bg-[image:repeating-linear-gradient(31deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_50%)] bg-[size:10px_10px] bg-fixed pointer-events-none")}>
        </div>
    )
}