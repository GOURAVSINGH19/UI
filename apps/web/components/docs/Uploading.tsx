"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@workspace/ui/lib/utils"
import { Progress } from "./progress"
import Folder from "../Folder"

export interface FileUploadProps {
    onFilesSelected?: (files: File[]) => void
    onUpload?: (files: File[]) => Promise<void>
    maxFileSize?: number
    acceptedFormats?: string[] | string
    multiple?: boolean
    userId?: string
    onUploadSuccess?: () => void
    className?: string
    showProgress?: boolean
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

const Pattern = () => {
    return (
        <div
            className={cn(
                "absolute inset-0 z-0 rounded-lg mx-auto",
                "[--pattern-fg:var(--color-neutral-900)/2] bg-[image:repeating-linear-gradient(31deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_50%)] bg-[size:10px_10px] bg-fixed pointer-events-none",
            )}
        />
    )
}

export function FileUpload({
    onFilesSelected,
    onUpload,
    maxFileSize = 5 * 1024 * 1024,
    acceptedFormats = "image/jpeg,image/png,image/svg+xml",
    multiple = true,
    onUploadSuccess,
    className,
    showProgress = true,
}: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files)
            const oversized = filesArray.find((f) => f.size > maxFileSize)
            if (oversized) {
                setError(`File "${oversized.name}" exceeds ${formatFileSize(maxFileSize)} limit`)
                return
            }
            setFiles(filesArray)
            setError(null)
            onFilesSelected?.(filesArray)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const dropped = Array.from(e.dataTransfer.files)
        const oversized = dropped.find((f) => f.size > maxFileSize)
        if (oversized) {
            setError(`"${oversized.name}" exceeds ${formatFileSize(maxFileSize)} limit.`)
            return
        }
        setFiles(dropped)
        setError(null)
        onFilesSelected?.(dropped)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const clearFiles = () => {
        setFiles([])
        setError(null)
        setProgress(0)
    }

    const handleUpload = async () => {
        if (!files.length) return

        setUploading(true)
        setProgress(0)
        setError(null)

        try {
            if (onUpload) {
                await onUpload(files)
            }
            clearFiles()
            onUploadSuccess?.()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload files")
        } finally {
            setUploading(false)
        }
    }

    const handleCancel = () => {
        clearFiles()
        setUploading(false)
    }

    const handleRemoveFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    }

    const acceptFormats = typeof acceptedFormats === "string" ? acceptedFormats : acceptedFormats.join(",")
    const formatList = acceptFormats
        .split(",")
        .map((f) => f.split("/")[1]?.toUpperCase())
        .filter(Boolean)
        .join(", ");
    return (
        <div className={cn("flex items-center justify-center p-4", className)}>
            <div className="w-full max-w-sm bg-[var(--bg)] rounded-sm shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-end border-b border-zinc-800 px-6 py-2">
                    <button className="w-4 h-4 rounded-full bg-[var(--bg-light)] text-center flex items-center justify-center shadow-[var(--shadow-s)]">
                        <X className="w-3 h-3 cursor-pointer" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div onDrop={handleDrop} onDragOver={handleDragOver}>
                        <input
                            type="file"
                            accept={acceptFormats}
                            onChange={handleFileChange}
                            className="hidden"
                            multiple={multiple}
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="block">
                            <div className="rounded-xs border-1 border-dashed border-neutral-700 bg-[repeating-linear-gradient(31deg,rgba(255,255,255,0.2)_0.9px,rgba(255,255,255,0.2)_1px,transparent_.5px,transparent_10px),repeating-linear-gradient(-31deg,rgba(255,255,255,0.2)_0.9px,rgba(255,255,255,0.2)_1px,transparent_1px,transparent_10px)] stopOpacity-image:linear-gradient(to_bottom_right,black,transparent)]  px-8 py-14 text-center cursor-pointer transition-all shadow-[var(--shadow-s)]">
                                <Pattern />
                                <div className="flex justify-center mb-6 text-gray-400">
                                    <Folder />
                                </div>
                                <p className="text-neutral-500 font-medium text-xs">
                                    Drag and drop or <span className="text-neutral-300">choose file</span> to upload.
                                </p>
                                <p className="text-sm text-neutral-500 mt-1 text-xs">Image format:
                                    <span className="underline text-neutral-400">{formatList}</span>,
                                    <span className="text-neutral-300">Max 5MB</span>
                                </p>
                            </div>
                        </label>
                        {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
                    </div>
                    {files.length > 0 && (
                        <>
                            {files.length === 1 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ ease: "easeInOut", duration: 0.4 }}
                                    className="space-y-3"
                                >
                                    {files.map((file, index) => (
                                        <div
                                            key={`${file.name}-${index}`}
                                            className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                                        >
                                            <div className="flex-shrink-0 bg-gradient-to-br from-white-400 to-orange-600 rounded-md p-2">
                                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                                                </svg>
                                            </div>

                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                                    <span className="text-xs text-gray-500 flex-shrink-0">({formatFileSize(file.size)})</span>
                                                </div>
                                                {showProgress && <Progress value={progress} />}
                                            </div>

                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {showProgress && (
                                                    <span className="text-xs font-semibold text-gray-600 w-8 text-right">{progress}%</span>
                                                )}
                                                <button
                                                    onClick={() => handleRemoveFile(index)}
                                                    disabled={uploading}
                                                    className="shadow-[var(--shadow-s)] bg-[var(--bg)] rounded-full cursor-pointer p-1 flex items-center justify-center"
                                                >
                                                    <X className="w-3 h-3 text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ ease: "easeInOut", duration: 0.4 }}
                                    className="flex flex-wrap gap-2 justify-start mt-3"
                                >
                                    {files.map((file, index) => (
                                        <div
                                            key={`${file.name}-${index}`}
                                            className="relative group w-16 h-16 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-colors shadow-sm"
                                            title={file.name}
                                        >
                                            <div className="bg-gradient-to-br from-orange-400 to-white-600 rounded-md p-2">
                                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                                                </svg>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFile(index)}
                                                disabled={uploading}
                                                className="absolute -top-2 -right-2 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity  disabled:opacity-50 shadow-[var(--shadow-s)] bg-[var(--bg)] rounded-full cursor-pointer"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
                {
                    files.length > 0 &&
                    <div className="flex items-center justify-between gap-3 border-t border-zinc-800 px-6 py-4">
                        <button className="text-gray-500 hover:text-gray-600 transition-colors p-2"></button>
                        <div className="flex gap-2">
                            <button onClick={handleCancel} className="bg-[var(--bg-light)] shadow-[var(--shadow-s)] text-sm px-3 py-1 rounded-md border-purple-300 text-neutral-200 cursor-pointer ">
                                Cancel
                            </button>
                            <button onClick={handleUpload} className="bg-neutral-900 shadow-[var(--shadow-s)] text-sm px-3 py-1 rounded-md border-purple-300 text-neutral-200 cursor-pointer ">
                                Continue
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
