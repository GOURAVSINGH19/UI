import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen } from "lucide-react"
import { mdxComponents } from "@/mdx-component"

import { source } from "@/lib/source"
import { getComponents } from "@/lib/components-index"
import { absoluteUrl } from "@workspace/ui/lib/utils"
import { OnThisPage } from "@/components/browser/OnThisPage"
import { Breadcrumbs } from "@/components/browser/Breadcrumbs"
import { ComponentBadge } from "@/components/browser/ComponentBadge"
import { GridSection } from "@/components/grid/Grid"

// Prev/next follow the same A–Z order as the /components list.
function findNeighbours(currentUrl: string) {
  const pages = getComponents()
  const index = pages.findIndex((p) => p.href === currentUrl)
  if (index === -1) return { previous: null, next: null }
  return {
    previous: pages[index - 1] ?? null,
    next: pages[index + 1] ?? null,
  }
}

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) {
    notFound()
  }

  const doc = page.data

  if (!params.slug || params.slug.length === 0) {
    return { title: doc.title, description: doc.description }
  }

  if (!doc.title || !doc.description) {
    notFound()
  }

  const ogImage = `/og?title=${encodeURIComponent(doc.title)}&description=${encodeURIComponent(doc.description)}`

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
      url: absoluteUrl(page.url),
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [{ url: ogImage }],
      creator: "@Gourav",
    },
  }
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) {
    notFound()
  }

  const doc = page.data
  const MDX = doc.body
  const neighbours = findNeighbours(page.url)

  const sections = [
    ...doc.toc
      .filter((item) => item.depth <= 2)
      .map((item) => ({ id: item.url.replace(/^#/, ""), title: item.title })),
  ]

  const pagerLink =
    "inline-flex h-8 items-center gap-1.5 rounded-md border border-ui-border px-3 text-xs text-ui-secondary transition-colors hover:bg-ui-muted hover:text-ui-heading"

  return (
    <>
      <main data-slot="docs" className="min-w-0">
        <header id="overview" className="scroll-mt-20 px-gutter pt-10 pb-12 md:px-10 md:pt-14">
          <div className="flex items-center justify-between gap-4">
            <Breadcrumbs
              items={[
                { label: "Components", href: "/components" },
                ...(doc.category ? [{ label: doc.category }] : []),
                { label: doc.title },
              ]}
            />
            <div className="flex items-center gap-1">
              {neighbours.previous && (
                <Link href={neighbours.previous.href} aria-label={`Previous: ${neighbours.previous.title}`} className={pagerLink}>
                  <ArrowLeft className="size-3" />
                </Link>
              )}
              {neighbours.next && (
                <Link href={neighbours.next.href} aria-label={`Next: ${neighbours.next.title}`} className={pagerLink}>
                  <ArrowRight className="size-3" />
                </Link>
              )}
            </div>
          </div>
          <h1 className="mt-6 flex flex-wrap items-center gap-3 font-serif text-4xl leading-tight text-ui-heading">
            {doc.title}
            <ComponentBadge label={doc.badge} className="font-sans text-xs" />
          </h1>
          {doc.description && (
            <p className="mt-heading-text max-w-2xl text-base leading-relaxed tracking-tight text-ui-caption">{doc.description}</p>
          )}
          {doc.blog && (
            <a
              href={doc.blog}
              target="_blank"
              rel="noreferrer"
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-ui-border py-1.5 pr-3 pl-2.5 text-sm text-ui-strong transition-colors hover:bg-ui-muted"
            >
              <BookOpen className="size-3.5 text-ui-caption" />
              Read how it&apos;s built
              <ArrowUpRight className="size-3.5 text-ui-caption transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}
        </header>

        {/* Each "##" in the MDX opens a new grid row (see the h2 in mdx-component). */}
        <div className="px-gutter pb-12 text-[15px] text-ui-body md:px-10">
          <MDX components={mdxComponents} />
        </div>

        {(neighbours.previous || neighbours.next) && (
          <GridSection as="nav" top className="flex items-center justify-between gap-4 px-gutter py-5 md:px-10">
            {neighbours.previous ? (
              <Link href={neighbours.previous.href} className={pagerLink}>
                <ArrowLeft className="size-3" /> {neighbours.previous.title}
              </Link>
            ) : <span />}
            {neighbours.next && (
              <Link href={neighbours.next.href} className={pagerLink}>
                {neighbours.next.title} <ArrowRight className="size-3" />
              </Link>
            )}
          </GridSection>
        )}
      </main>

      <OnThisPage title={doc.title} sections={sections} />
    </>
  )
}
