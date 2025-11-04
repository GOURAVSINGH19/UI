import Link from "next/link"

const components = [
    { name: "Button", href: "/docs/components/button" },
    { name: "Notification Menu",href:"/docs/components/menu" },
    { name: "Input",href:"/docs/components/input" },
    { name: "Login",href:"/docs/components/login" },
]

const Allcomponents = () => {
    return (
        <div className="px-6 py-8 md:py-16 lg:py-24">
            <h1 className="text-2xl font-semibold mb-6">All Components</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {components.map((c) => (
                    <div key={c.name} className="rounded-md border border-neutral-800/60 bg-[var(--bg-dark,rgba(0,0,0,0.2))] p-4 hover:bg-[var(--bg,rgba(255,255,255,0.02))] transition-colors">
                        {c.href ? (
                            <Link href={c.href} className="text-base font-medium text-white hover:underline">
                                {c.name}
                            </Link>
                        ) : (
                            <span className="text-base font-medium text-white">{c.name}</span>
                        )}
                        <p className="mt-1 text-xs text-neutral-400">UI component</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Allcomponents