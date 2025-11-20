import { MenuPreview } from "@/components/docs/MenuPreview";
const LatestComponent = () => {
    return (
        <section className="w-full h-[70vh] space-y-4 md:block mt-10 relative z-[10]">
            <div className="mx-auto h-full flex justify-center items-center w-full max-w-3xl 
            bg-[var(--bg)] grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr]
             bg-white [--pattern-fg:var(--color-zinc-50)]/5
             dark:bg-[var(--bg-light)] dark:[--pattern-fg:var(--bg-light)]/10
             rounded-md"
            >
                <MenuPreview />
            </div>
        </section>
    )
}

export default LatestComponent;