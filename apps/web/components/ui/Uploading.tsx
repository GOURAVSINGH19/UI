"use client"

import type React from "react"
import { useRef, useState } from "react"
import { X } from "lucide-react"
import { z } from "zod"
import { cn } from "@workspace/ui/lib/utils"

export const uploadedFileSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "Name is required"),
    path: z.string().min(1, "Path is required"),
    size: z.number().int().positive("Size must be a positive integer"),
    type: z.string().min(1, "Type is required"),
    fileUrl: z.string().url("File URL must be a valid URL"),
    thumbnail: z.string().url("Thumbnail URL must be a valid URL").optional().nullable(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
})

export type UploadedFile = z.infer<typeof uploadedFileSchema>

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

interface FileUploadFormProps {
    userId: string;
    onUploadSuccess?: () => void;
}


export function UploadedFile({ userId, onUploadSuccess }: FileUploadFormProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // if (!userId) {
    //     return (
    //         <div className="text-center p-4">
    //             <p className="text-danger">Authentication error. Please try refreshing the page.</p>
    //         </div>
    //     );
    // }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            const oversized = filesArray.find(f => f.size > 5 * 1024 * 1024);
            if (oversized) {
                setError(`File "${oversized.name}" exceeds 5MB limit`);
                return;
            }
            setFiles(filesArray);
            setError(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const filesArray = Array.from(e.dataTransfer.files);
            const oversized = filesArray.find(f => f.size > 5 * 1024 * 1024);
            if (oversized) {
                setError(`File "${oversized.name}" exceeds 5MB limit`);
                return;
            }
            setFiles(filesArray);
            setError(null);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const clearFile = () => {
        setFiles([]);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUpload = async () => {
        if (!files.length) return;
        if (!userId) {
            setError("Authentication error. Please try refreshing the page.");
            return;
        }

        const formData = new FormData();
        files.forEach(f => {
            formData.append("files", f, f.webkitRelativePath || f.name);
        });
        formData.append("userId", userId);

        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            // const token = await getToken();
            // await axios.post("/api/files/upload", formData, {
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //         Accept: 'application/json',
            //         Authorization: `Bearer ${token}`,
            //     },
            //     onUploadProgress: (progressEvent) => {
            //         if (progressEvent.total) {
            //             const percentCompleted = Math.round(
            //                 (progressEvent.loaded * 100) / progressEvent.total
            //             );
            //             setProgress(percentCompleted);
            //         }
            //     },
            // });

            // toast.success(`Files have been uploaded successfully.`);
            clearFile();

            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (error) {
            console.log("Failed to upload files. Please try again.", error);
            // toast.error("Failed to Upload Files");
        } finally {
            setUploading(false);
        }
    };

    const handleCancle = () => {}
    const handleRemoveFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
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
                    {/* <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${error
                            ? "border-danger/30 bg-danger/5"
                            : files.length
                                ? "border-primary/30 bg-primary/5"
                                : "border-default-300 hover:border-primary/5"
                            }`}
                    > */}
                        <label className="block">
                            <div className="rounded-xs border-1 border-dashed border-neutral-700 bg-[repeating-linear-gradient(31deg,rgba(255,255,255,0.2)_0.9px,rgba(255,255,255,0.2)_1px,transparent_.5px,transparent_10px),repeating-linear-gradient(-31deg,rgba(255,255,255,0.2)_0.9px,rgba(255,255,255,0.2)_1px,transparent_1px,transparent_10px)] stopOpacity-image:linear-gradient(to_bottom_right,black,transparent)]  px-8 py-14 text-center cursor-pointer transition-all shadow-[var(--shadow-s)]">
                                <Pattern />
                                <div className="flex justify-center mb-6">
                                    <svg width="100" height="100" viewBox="0 0 226 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.1205 169.004C1.1205 158.504 0.500051 38.0039 0.5 31.5039C0.499949 25.0039 0.5 14.0039 11.1201 14.0039C21.7402 14.0039 126.121 13.0039 132.62 13.0039C139.12 13.0039 139.62 0.503906 148.62 0.503906H215.62C220.848 0.503906 225.12 8.00391 225.12 13.5039C225.12 19.0039 225.5 158.004 225.5 169.004C225.5 180.004 216.5 179.504 216.5 179.504H12.1205C12.1205 179.504 1.1205 179.504 1.1205 169.004Z" fill="#383838" />
                                        <path d="M1 31.5039C0.666667 31.5039 0.333334 31.5039 2.08616e-07 31.5039C0.0434388 44.4261 0.113825 57.5037 0.174411 70.5299C0.326154 102.841 0.499362 135.15 0.618181 167.469C0.618638 167.659 0.619438 168.028 0.619843 168.293C0.620277 168.568 0.620499 168.806 0.620499 169.004C0.088961 175.231 6.27361 180.107 12.1205 180.004C80.247 180.004 148.374 180.004 216.5 180.004L216.472 180.003C219.246 180.03 222.03 178.891 223.759 176.682C225.496 174.479 225.999 171.649 226 169.004C225.899 117.251 225.738 65.2262 225.62 13.5039C225.315 7.7145 222.278 0.738022 215.62 0.00390625C193.325 0.00390625 170.916 0.00390625 148.62 0.00390625C139.816 -0.245966 139.331 11.6632 132.62 12.5039C97.3963 12.7621 62.0288 13.1241 26.7155 13.4038C21.5527 13.4426 16.1914 13.4906 11.1201 13.5039C7.07852 13.2789 2.81901 15.8642 1.50089 19.7762C0.0157528 23.5661 0.00680286 27.6208 2.08616e-07 31.5039C0.333334 31.5039 0.666667 31.5039 1 31.5039C1.00067 27.6353 1.03956 23.6761 2.42801 20.151C3.6984 16.5378 7.30566 14.345 11.1201 14.5039C16.203 14.4906 21.5589 14.4425 26.7234 14.4038C62.0354 14.124 97.4145 13.762 132.62 13.5039C136.959 13.3387 138.555 9.05285 140.536 6.37689C142.415 3.46802 145.134 0.87785 148.62 1.00391C170.916 1.00391 193.325 1.00391 215.62 1.00391C221.171 1.47213 224.428 8.16079 224.62 13.5039C224.738 65.2308 224.899 117.255 225 169.004C225.37 174.1 221.725 179.268 216.528 179.005L216.5 179.004C148.374 179.004 80.247 179.004 12.1205 179.004C6.64574 179.016 1.17601 174.777 1.6205 169.004C1.6205 168.805 1.62028 168.567 1.61984 168.291C1.61944 168.027 1.61864 167.656 1.61818 167.466C1.49934 135.144 1.32614 102.837 1.1744 70.5251C1.11382 57.5003 1.04342 44.4169 1 31.5039ZM2.08616e-07 31.5039L1 31.5039L2.08616e-07 31.5039Z" fill="#A1A0A0" fill-opacity="0.5" />
                                        <g filter="url(#filter0_i_3825_226)">
                                            <rect x="148.5" y="6.50391" width="30" height="4" rx="2" fill="#7A7A7A" fill-opacity="0.99" />
                                        </g>
                                        <g filter="url(#filter1_i_3825_226)">
                                            <rect x="187.5" y="6.50391" width="15" height="4" rx="2" fill="#808080" />
                                        </g>
                                        <rect x="5.5" y="21.8431" width="197" height="152" rx="8" transform="rotate(-3.88259 5.5 21.8431)" fill="#B1AEAE" />
                                        <path d="M64.7449 30.5039L10.5223 30.5039C0.5 30.504 0.5 37.2767 0.5 37.2767V168.243C0.5 168.655 0.528475 169.07 0.607402 169.474C2.38761 178.578 11.0234 179.504 11.0234 179.504H214.476C225.5 179.504 225.5 171.28 225.5 171.28V61.3383C225.5 58.9943 224.481 56.7022 222.643 55.2474C218.165 51.703 214.779 49.6667 212.963 48.6778C211.991 48.1487 210.897 47.9195 209.791 47.9195H95.6333C94.0507 47.9195 92.5037 47.4501 91.188 46.5708L69.1662 31.8527C67.8504 30.9733 66.3275 30.5039 64.7449 30.5039Z" fill="#2E2E2E" fill-opacity="0.43" stroke="#818181" stroke-opacity="0.5" />
                                        <path d="M64.7449 30.5039L10.5223 30.5039C0.5 30.504 0.5 37.2767 0.5 37.2767V168.243C0.5 168.655 0.528475 169.07 0.607402 169.474C2.38761 178.578 11.0234 179.504 11.0234 179.504H214.476C225.5 179.504 225.5 171.28 225.5 171.28V61.3383C225.5 58.9943 224.481 56.7022 222.643 55.2474C218.165 51.703 214.779 49.6667 212.963 48.6778C211.991 48.1487 210.897 47.9195 209.791 47.9195H95.6333C94.0507 47.9195 92.5037 47.4501 91.188 46.5708L69.1662 31.8527C67.8504 30.9733 66.3275 30.5039 64.7449 30.5039Z" fill="#2E2E2E" fill-opacity="0.43" stroke="#818181" stroke-opacity="0.5" />
                                        <path d="M13.0511 150.504L14.983 138.868H22.1989L21.9489 140.379H16.4886L15.8977 143.924H20.8409L20.5909 145.43H15.6477L14.8068 150.504H13.0511ZM21.8098 150.504L23.2643 141.777H24.9632L23.5086 150.504H21.8098ZM24.4689 140.413C24.1734 140.413 23.9234 140.315 23.7189 140.118C23.5181 139.917 23.4253 139.678 23.4405 139.402C23.4556 139.121 23.573 138.883 23.7927 138.686C24.0124 138.485 24.2681 138.385 24.5598 138.385C24.8552 138.385 25.1033 138.485 25.3041 138.686C25.5048 138.883 25.5995 139.121 25.5882 139.402C25.573 139.678 25.4556 139.917 25.2359 140.118C25.02 140.315 24.7643 140.413 24.4689 140.413ZM28.9448 138.868L27.013 150.504H25.3141L27.246 138.868H28.9448ZM32.5572 150.68C31.7011 150.68 30.9928 150.496 30.4322 150.129C29.8753 149.758 29.4852 149.237 29.2617 148.566C29.0382 147.892 29.0022 147.102 29.1538 146.197C29.3015 145.303 29.5988 144.515 30.0458 143.833C30.4928 143.152 31.0496 142.619 31.7163 142.237C32.3867 141.854 33.1272 141.663 33.9378 141.663C34.4303 141.663 34.8943 141.744 35.3299 141.907C35.7693 142.07 36.1424 142.326 36.4492 142.674C36.756 143.023 36.9681 143.475 37.0856 144.032C37.2068 144.585 37.203 145.258 37.0742 146.049L36.9776 146.652H30.0344L30.2333 145.379H35.506C35.5856 144.932 35.5647 144.536 35.4435 144.191C35.3223 143.843 35.114 143.568 34.8185 143.368C34.5269 143.167 34.1594 143.066 33.7163 143.066C33.2617 143.066 32.8375 143.186 32.4435 143.424C32.0496 143.663 31.72 143.968 31.4549 144.339C31.1935 144.707 31.0288 145.085 30.9606 145.475L30.7617 146.64C30.6632 147.277 30.6803 147.788 30.8128 148.174C30.9492 148.561 31.1878 148.841 31.5288 149.015C31.8697 149.19 32.2958 149.277 32.8072 149.277C33.1367 149.277 33.4416 149.231 33.7219 149.14C34.006 149.046 34.2579 148.907 34.4776 148.725C34.6973 148.54 34.881 148.309 35.0288 148.032L36.5856 148.322C36.3772 148.796 36.078 149.21 35.6878 149.566C35.2977 149.919 34.8375 150.193 34.3072 150.39C33.7806 150.583 33.1973 150.68 32.5572 150.68ZM45.4024 143.907L43.8172 144.18C43.7831 143.979 43.713 143.79 43.607 143.612C43.5047 143.434 43.3475 143.29 43.1354 143.18C42.9233 143.066 42.6411 143.01 42.2888 143.01C41.8002 143.01 41.3721 143.121 41.0047 143.345C40.6411 143.568 40.4327 143.852 40.3797 144.197C40.3305 144.477 40.3968 144.705 40.5786 144.879C40.7604 145.049 41.0805 145.191 41.5388 145.305L42.8797 145.623C43.6524 145.809 44.2055 146.099 44.5388 146.493C44.8759 146.883 44.9934 147.39 44.8911 148.015C44.804 148.534 44.5767 148.994 44.2093 149.396C43.8456 149.797 43.3797 150.112 42.8115 150.339C42.2434 150.566 41.6108 150.68 40.9138 150.68C39.9214 150.68 39.1487 150.47 38.5956 150.049C38.0426 149.629 37.7585 149.034 37.7434 148.265L39.4252 148.015C39.4555 148.443 39.6089 148.767 39.8854 148.987C40.1657 149.203 40.554 149.311 41.0502 149.311C41.6184 149.315 42.0937 149.195 42.4763 148.953C42.8589 148.71 43.0767 148.417 43.1297 148.072C43.1752 147.803 43.1146 147.58 42.9479 147.402C42.785 147.224 42.4971 147.087 42.0843 146.993L40.6752 146.669C39.8873 146.483 39.3305 146.184 39.0047 145.771C38.679 145.358 38.5691 144.839 38.6752 144.214C38.7585 143.703 38.9744 143.258 39.3229 142.879C39.6752 142.496 40.1202 142.199 40.6581 141.987C41.196 141.771 41.7907 141.663 42.4422 141.663C43.393 141.663 44.107 141.868 44.5843 142.277C45.0615 142.682 45.3343 143.225 45.4024 143.907Z" fill="#D3D3D3" />
                                        <defs>
                                            <filter id="filter0_i_3825_226" x="148.5" y="6.50391" width="30" height="8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                <feOffset dy="4" />
                                                <feGaussianBlur stdDeviation="2" />
                                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3825_226" />
                                            </filter>
                                            <filter id="filter1_i_3825_226" x="187.5" y="6.50391" width="15" height="8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                <feOffset dy="4" />
                                                <feGaussianBlur stdDeviation="2" />
                                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3825_226" />
                                            </filter>
                                            <clipPath id="bgblur_0_3825_226_clip_path" transform="translate(11.6 -18.4039)"><path d="M64.7449 30.5039L10.5223 30.5039C0.5 30.504 0.5 37.2767 0.5 37.2767V168.243C0.5 168.655 0.528475 169.07 0.607402 169.474C2.38761 178.578 11.0234 179.504 11.0234 179.504H214.476C225.5 179.504 225.5 171.28 225.5 171.28V61.3383C225.5 58.9943 224.481 56.7022 222.643 55.2474C218.165 51.703 214.779 49.6667 212.963 48.6778C211.991 48.1487 210.897 47.9195 209.791 47.9195H95.6333C94.0507 47.9195 92.5037 47.4501 91.188 46.5708L69.1662 31.8527C67.8504 30.9733 66.3275 30.5039 64.7449 30.5039Z" />
                                            </clipPath></defs>
                                    </svg>
                                </div>
                                <p className="text-neutral-500 font-medium text-xs">
                                    Drag and drop or <span className="text-neutral-300">choose file</span> to upload.
                                </p>
                                <p className="text-sm text-neutral-500 mt-1 text-xs">Image format: <span className="underline text-neutral-400">JPG</span>, <span className="underline text-neutral-400">PNG</span> & <span className="underline text-neutral-400">SVG</span>. <span className="text-neutral-300">Max 5.0MB</span></p>
                            </div>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/svg+xml"
                                onChange={handleFileChange}
                                className="hidden"
                                multiple
                            />
                        </label>
                        {files.length > 0 && (
                            <div className="space-y-3">
                                {files.map((file, index) => (
                                    <div key={`${file.name}-${index}`} className="flex items-center gap-3 bg-neutral-300 rounded-lg p-3 border border-purple-200">
                                        <div className="flex-shrink-0 bg-gradient-to-br from-white-300 to-orange-400 rounded-md p-2">
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                                            </svg>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-center gap-1 mb-1">
                                                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                                <span className="text-xs text-gray-500 flex-shrink-0">({formatFileSize(file.size)})</span>
                                            </div>
                                            <div className="w-full bg-neutral-400 rounded-full h-3 flex justify-start items-center">
                                                <div
                                                    className="bg-[var(--bg-light)] m-[.2em]  to-blue-600 h-[.4em] rounded-full transition-all"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-xs font-semibold text-gray-600 w-6 text-right">{progress}%</span>
                                            <button
                                                onClick={() => handleRemoveFile(index)}
                                                className="shadow-[var(--shadow-s)] bg-[var(--bg)] rounded-full cursor-pointer p-1 flex items-center justify-center"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    {/* </div> */}
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-zinc-800 px-6 py-4">
                    <button className="text-gray-500 hover:text-gray-600 transition-colors p-2"></button>
                    <div className="flex gap-2">
                        <button onClick={handleCancle} className="bg-[var(--bg-light)] shadow-[var(--shadow-s)] text-sm px-3 py-1 rounded-md border-purple-300 text-neutral-200 cursor-pointer ">
                            Cancel
                        </button>
                        <button onClick={handleUpload} className="bg-purple-800 shadow-[var(--shadow-s)] text-sm px-3 py-1 rounded-md border-purple-300 text-neutral-200 cursor-pointer ">
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
