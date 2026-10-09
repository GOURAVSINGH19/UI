import { getComponents, groupByCategory } from "@/lib/components-index"
import { absoluteUrl, faqs, resources, site, socials } from "@/lib/site"

/**
 * /llms.txt: a plain-Markdown map of the site for large language models (GEO).
 * Format: https://llmstxt.org. Built from the same data the pages use, so it never drifts.
 */
export function GET() {
  const categories = groupByCategory(getComponents())

  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} is an MIT licensed React component library by ${site.author}. Components are copied into your project rather than installed as a package. Source: ${site.repo}`,
    "",
    "## Pages",
    "",
    `- [Home](${absoluteUrl("/")}): overview, featured components, tools used and FAQ.`,
    `- [All components](${absoluteUrl("/components")}): every component, grouped by category.`,
    "",
    "## Components",
    "",
    ...categories.flatMap((category) => [
      `### ${category.name}`,
      "",
      ...category.items.map((c) => `- [${c.title}](${absoluteUrl(c.href)}): ${c.description}`),
      "",
    ]),
    "## Built with",
    "",
    ...resources.map((r) => `- ${r.name} (${r.href}): ${r.use}`),
    "",
    "## FAQ",
    "",
    ...faqs.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## Elsewhere",
    "",
    ...socials.map((s) => `- ${s.label}: ${s.href}`),
    `- Email: ${site.email}`,
    "",
  ]

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
