import { docsConfig } from "@/config/docs"
import Link from "next/link"

const Allcomponents = () => {

    return (
        <div className="px-6 py-8 md:py-16 lg:py-24">
            <h1 className="text-2xl font-semibold mb-6">All Components</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {docsConfig.sidebarNav.map((c) => (
                    <div key={c.title} className=" w-[30vw] h-[40vh] rounded-md border border-neutral-800/60 bg-[var(--bg-dark,rgba(0,0,0,0.2))] p-4 hover:bg-[var(--bg,rgba(29, 28, 28, 0.49))] transition-colors">
                        {c.href ? (
                                <Link href={c.href} className="text-base font-medium text-white hover:underline">
                                    {c.title}
                                </Link>
                        ) : (
                            <span className="text-base font-medium text-white">{c.title}</span>
                        )}
                        <p className="mt-1 text-xs text-neutral-400">{c.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Allcomponents