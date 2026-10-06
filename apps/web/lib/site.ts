// Site-wide content: links, socials, credits and FAQ. Edit here, not in the components.

export const site = {
  name: "Kinetik",
  author: "Gourav Singh",
  repo: "https://github.com/GOURAVSINGH19/UI",
  license: "https://github.com/GOURAVSINGH19/UI/blob/main/LICENSE",
  email: "gouravsingh4495@outlook.com",
}

export const socials = [
  { key: "x", label: "X", handle: "@GouravSing85027", href: "https://x.com/GouravSing85027" },
  { key: "linkedin", label: "LinkedIn", handle: "in/gourav-singh", href: "https://www.linkedin.com/in/gourav-singh-814293258" },
  { key: "github", label: "GitHub", handle: "@GOURAVSINGH19", href: "https://github.com/GOURAVSINGH19" },
] as const

/** Tools this project is actually built with. `core` ones get a large card on the home page. */
export const resources = [
  { name: "Next.js", use: "App Router, server components and static docs pages.", category: "Framework", href: "https://nextjs.org", core: true },
  { name: "Tailwind CSS", use: "Every style, driven by the --ui-* design tokens.", category: "Styling", href: "https://tailwindcss.com", core: true },
  { name: "Motion", use: "Springs, layout and gesture animation in components.", category: "Animation", href: "https://motion.dev", core: true },
  { name: "Fumadocs", use: "MDX docs pipeline", category: "Docs", href: "https://fumadocs.dev" },
  { name: "Shiki", use: "Code highlighting", category: "Docs", href: "https://shiki.style" },
  { name: "GSAP", use: "Scroll-driven templates", category: "Animation", href: "https://gsap.com" },
  { name: "Lenis", use: "Smooth scrolling", category: "Animation", href: "https://lenis.darkroom.engineering" },
  { name: "Lucide", use: "Icons", category: "Assets", href: "https://lucide.dev" },
  { name: "Turborepo", use: "Monorepo builds", category: "Tooling", href: "https://turbo.build" },
]

export const faqs = [
  {
    q: "Is Kinetik free to use?",
    a: "Yes. Every component is MIT licensed, so you can use it in personal and commercial projects without paying or asking. Attribution is appreciated but not required.",
  },
  {
    q: "How do I add a component to my project?",
    a: "Open the component, switch the preview to Code, and copy the file into your React or Next.js app. Fix the import paths and it is yours — there is no package to install or keep updated.",
  },
  {
    q: "What do the components depend on?",
    a: "React and Tailwind CSS, plus Motion for the animated ones and Lucide for icons. Each docs page lists anything extra a component needs.",
  },
  {
    q: "Does it work in dark mode?",
    a: "Yes. Components use the design tokens (--ui-*) for colour, so they follow your light or dark theme automatically. Try the toggle in the top bar.",
  },
  {
    q: "Can I change the styles?",
    a: "The code lives in your repo after you copy it, so change anything. For site-wide changes, edit the tokens — colours, spacing and type scale all come from one CSS file.",
  },
  {
    q: "Can I request or contribute a component?",
    a: "Please do. Open an issue with the idea or a pull request with the component and its MDX page on GitHub — new components show up in the catalog automatically.",
  },
]
