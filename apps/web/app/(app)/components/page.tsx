import type { Metadata } from "next"
import { getComponents, groupByCategory } from "@/lib/components-index"
import { categoryId } from "@/lib/component-groups"
import { BrowserShell } from "@/components/browser/BrowserShell"
import { ComponentIndex } from "@/components/browser/ComponentIndex"
import { OnThisPage } from "@/components/browser/OnThisPage"
import { Breadcrumbs } from "@/components/browser/Breadcrumbs"
import { GridSection } from "@/components/grid/Grid"

export const metadata: Metadata = {
    title: "All components — Uiin",
    description: "Browse every free, open source React component in Uiin.",
}

const AllComponents = () => {
    const components = getComponents()
    const categories = groupByCategory(components)

    return (
        <BrowserShell>
            <main className="min-w-0">
                <header id="overview" className="scroll-mt-20 px-gutter pt-10 pb-12 md:px-10 md:pt-14">
                    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Components" }]} />
                    <h1 className="mt-6 flex items-baseline gap-3 font-serif text-4xl leading-tight text-ui-heading">
                        Components
                        <span className="font-sans text-sm text-ui-hint tabular-nums">{components.length}</span>
                    </h1>
                    <p className="mt-heading-text max-w-xl text-base leading-relaxed tracking-tight text-ui-caption">
                        Every piece of Uiin in one place, sorted into {categories.length}{" "}
                        {categories.length === 1 ? "category" : "categories"}. Open one to see it
                        live, tweak its variants, and grab the source.
                    </p>
                </header>

                <GridSection id="components" top className="scroll-mt-20 px-gutter py-10 md:px-10">
                    <ComponentIndex components={components} />
                </GridSection>
            </main>

            <OnThisPage
                title="Components"
                sections={categories.map((category) => ({ id: categoryId(category.name), title: category.name }))}
            />
        </BrowserShell>
    )
}

export default AllComponents
