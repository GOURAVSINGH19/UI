import { cn } from "@workspace/ui/lib/utils";
import { FileUpload } from "./docs/Uploading";
import Link from "next/link";
const LatestComponent = () => {
    return (
        <section className="w-full space-y-4 md:block mt-10 relative z-[10]">
            <div className={cn("mx-auto overflow-hidden realtive  w-full max-w-3xl bg-neutral-50/80 border-[.5px] border-[#FDFDFD] ring-1 rounded-md")}>
                <div className="relative flex flex-col">
                    <div className="inline-flex items-center px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground absolute left-4 top-6 rounded-[14px] border border-black/10 text-base md:left-6">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="lucide lucide-sparkles mr-1 fill-[#EEBDE0] stroke-1 text-neutral-800" aria-hidden="true">
                            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                            <path d="M20 2v4"></path>
                            <path d="M22 4h-4"></path>
                            <circle cx="4" cy="20" r="2"></circle>
                        </svg>
                        <h4 className="text-black">Latest component</h4>
                    </div>
                    <div className="flex flex-col justify-start pb-2 pl-4 pt-14 md:items-start mt-4 ml-2"></div>
                    <FileUpload />
                </div>
            </div>
        </section>
    )
}

export default LatestComponent;