import Link from "next/link"
import { notFound } from "next/navigation"
import { mdxComponents } from "@/mdx-conponent"
import {
  ArrowLeft,
  ArrowRight,
  ArrowBigUp,
} from "lucide-react"

import { source } from "@/lib/source"
import { absoluteUrl } from "@workspace/ui/lib/utils"
import { Badge } from "@workspace/ui/components/ui/badge"
import { DocsCopyPage } from "@/components/doc-copy-page"
import { DocsTableOfContents } from "@/components/doc-toc"
import { findNeighbour } from 'fumadocs-core/page-tree';
import { docsConfig } from "@/config/docs"

function flattenNav(items: any[]): Array<{ url: string; name: string }> {
  const result: Array<{ url: string; name: string }> = []
  for (const item of items) {
    if (item.href) {
      result.push({ url: item.href, name: item.title })
    }
    if (item.items && item.items.length > 0) {
      result.push(...flattenNav(item.items))
    }
  }
  return result
}

function findNeighboursFromConfig(currentUrl: string) {
  const pages = docsConfig.sidebarNav.flatMap(section => flattenNav(section.items))
  const currentIndex = pages.findIndex(p => p.url === currentUrl)
  
  if (currentIndex === -1) return { previous: null, next: null }
  
  return {
    previous: currentIndex > 0 ? pages[currentIndex - 1] : null,
    next: currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null,
  }
}

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

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

  if (!doc.title || !doc.description) {
    notFound()
  }

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
      url: absoluteUrl(page.url),
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            doc.title
          )}&description=${encodeURIComponent(doc.description)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            doc.title
          )}&description=${encodeURIComponent(doc.description)}`,
        },
      ],
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

  const neighbours = findNeighboursFromConfig(page.url)
  const links = doc.links as { doc?: string; api?: string } | undefined

  return (
    <div
      data-slot="docs"
      className="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="mx-auto flex w-full max-w-4xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                  {doc.title}
                </h1>
                <div className="docs-nav bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
                  <DocsCopyPage
                    // @ts-expect-error - revisit fumadocs types.
                    page={doc.content || ""}
                    url={absoluteUrl(page.url)}
                  />
                  {neighbours.previous &&
                    <Link href={neighbours.previous.url}>
                      <button className='rounded-full py-2 px-2 button-3 bg-[var(--bg)] flex items-center gap-2 w-max shadow-[var(--shadow-m)] cursor-pointer hover:shadow-[var(--shadow-l)]'>
                        <ArrowLeft className="w-3 h-3 text-neutral-400" />
                      </button>
                    </Link>
                  }
                  {neighbours.next &&
                    <Link href={neighbours.next.url}>
                      <button className='rounded-full py-2 px-2  button-3 bg-[var(--bg)] flex items-center gap-2 w-max shadow-[var(--shadow-m)] cursor-pointer hover:shadow-[var(--shadow-l)]'>
                        <ArrowRight className="w-3 h-3 text-neutral-400" />
                      </button>
                    </Link>}
                </div>
              </div>
              {doc.description && (
                <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
                  {doc.description}
                </p>
              )}
            </div>
            {links ? (
              <div className="flex items-center space-x-2 pt-4">
                {links?.doc && (
                  <Badge variant="secondary">
                    <Link href={links.doc} target="_blank" rel="noreferrer">
                      Docs <ArrowBigUp />
                    </Link>
                  </Badge>
                )}
                {links?.api && (
                  <Badge variant="secondary">
                    <Link href={links.api} target="_blank" rel="noreferrer">
                      API Reference <ArrowBigUp />
                    </Link>
                  </Badge>
                )}
              </div>
            ) : null}
          </div>
          <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
            <MDX components={mdxComponents} />
          </div>
        </div>
        <div className="mx-auto hidden h-16 w-full max-w-xl items-center gap-2 px-4 sm:flex md:px-0">
          {neighbours.previous &&
            <Link href={neighbours.previous.url}>
              <button className='rounded-full py-2 px-6 button-3 bg-[var(--bg)] flex items-center gap-2 w-max shadow-[var(--shadow-m)] cursor-pointer hover:shadow-[var(--shadow-l)]'>
                <ArrowLeft className="w-4 h-4 text-neutral-400" />
                <span className='text-sm text-[#ffffff68]'>{neighbours.previous.name}</span>
              </button>
            </Link>
          }
          {neighbours.next &&
            <Link href={neighbours.next.url}>
              <button className='rounded-full py-2 px-8  button-3 bg-[var(--bg)] flex items-center gap-2 w-max shadow-[var(--shadow-m)] cursor-pointer hover:shadow-[var(--shadow-l)]'>
                <span className='text-sm text-[#ffffff68]'>{neighbours.next?.name}</span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </button>
            </Link>}
        </div>
      </div>
      <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[calc(100svh-var(--footer-height)+2rem)] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
        <div className="h-(--top-spacing) shrink-0" />
        {doc.toc?.length ? (
          <div className="no-scrollbar overflow-y-auto px-8">
            <DocsTableOfContents toc={doc.toc} />
            <div className="h-12" />
          </div>
        ) : null}
        {/* for pro card */}
      </div>
    </div >
  )
}