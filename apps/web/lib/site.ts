// Site-wide content: links, socials, credits and FAQ. Edit here, not in the components.

export const site = {
  name: "Uiin",
  author: "Gourav Singh",
  repo: "https://github.com/GOURAVSINGH19/UI",
  email: "gouravsingh4495@outlook.com",
}

export const socials = [
  { key: "x", label: "X", handle: "@GouravSing85027", href: "https://x.com/GouravSing85027" },
  { key: "linkedin", label: "LinkedIn", handle: "in/gourav-singh", href: "https://www.linkedin.com/in/gourav-singh-814293258" },
  { key: "github", label: "GitHub", handle: "@GOURAVSINGH19", href: "https://github.com/GOURAVSINGH19" },
] as const

/** Tools this project is actually built with. */
export const resources = [
  { name: "Next.js", use: "App framework", href: "https://nextjs.org" },
  { name: "Tailwind CSS", use: "Styling and design tokens", href: "https://tailwindcss.com" },
  { name: "Motion", use: "Component animation", href: "https://motion.dev" },
  { name: "Fumadocs", use: "MDX docs pipeline", href: "https://fumadocs.dev" },
  { name: "Shiki", use: "Code highlighting", href: "https://shiki.style" },
  { name: "Lenis", use: "Smooth scrolling", href: "https://lenis.darkroom.engineering" },
  { name: "GSAP", use: "Scroll-driven templates", href: "https://gsap.com" },
  { name: "Lucide", use: "Icons", href: "https://lucide.dev" },
]

export const faqs = [
  {
    q: "Is Uiin free to use?",
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
