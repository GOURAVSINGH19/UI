# Kinetik

Free, open source React components with smooth micro-interactions, built with Tailwind CSS and Motion.
Copy the code into your project and make it yours.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black)
![React 19](https://img.shields.io/badge/React-19-61dafb)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)

Kinetik is not an npm package. Every component is source code you copy into your app, so there is
nothing to install or keep updated, and you can change anything. Each one has a docs page with a live
preview, the full source, a setup guide and its props.

---

## Contents

- [Components](#components)
- [Using a component](#using-a-component)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Running it locally](#running-it-locally)
- [Contributing](#contributing)
- [Adding a new component](#adding-a-new-component)
- [Guidelines](#guidelines)
- [Credits](#credits)
- [License](#license)

---

## Components

| Component | Category | What it does |
| --- | --- | --- |
| Button | Buttons | Button variants with an optional flickering grid that follows the pointer |
| Folder | Animations | A folder whose papers rise and fan out as the front flap tilts open |
| Organic Growth | Effects | Vines, leaves and flowers grow out of any element on hover or focus |
| File Attachment | Inputs | Upload previews with a progress ring, a check when done, cancel, retry and remove |
| Gooey Search | Inputs | A command search whose results melt out of the input |
| Model Selector | Inputs | A model picker for AI apps with badges and an extended-thinking switch |
| Prompt Input | Inputs | An AI prompt box that grows open on focus, with gooey menus, attachments, voice input and run / stop |
| Simple Search | Inputs | A ⌘K search dialog with filters and keyboard navigation |
| Tape Deck | Media | A 3D shelf of cassette tapes: hover lifts one, click pulls it out and plays a beat |

Every component supports light and dark mode, works with the keyboard, and respects
`prefers-reduced-motion`.

---

## Using a component

1. Open the component's page in the docs and switch the preview to **Code**.
2. Install the packages listed under **Setup** (for example `npm install framer-motion lucide-react`).
3. Copy `lib/utils.ts` (the `cn()` helper) if you don't have it, and `styles/tokens.css` if the component uses design tokens.
4. Copy the component into your project:
   - **Small components** are one file, e.g. `components/ui/button.tsx`.
   - **Larger components** are a folder, e.g. `components/ui/prompt-input/`. Copy every file into it; the folder's `index.tsx` lets you import it by the folder name.
5. Import and use it:

```tsx
import { PromptInput } from "@/components/ui/prompt-input"

export function Chat() {
  return <PromptInput onSubmit={(value) => console.log(value)} />
}
```

Requirements in your app: **React 18+** (19 recommended) and **Tailwind CSS v4**.

---

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, React Server Components, Cache Components) |
| UI | [React 19](https://react.dev), [TypeScript](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com), design tokens in `tokens.css`, [class-variance-authority](https://cva.style), [tailwind-merge](https://github.com/dcastil/tailwind-merge) |
| Animation | [Motion / Framer Motion](https://motion.dev), [GSAP](https://gsap.com), [Lenis](https://lenis.darkroom.engineering) for smooth scrolling |
| Primitives | [Radix UI](https://www.radix-ui.com) (accordion, dropdown, popover, tabs, …) |
| Icons | [Lucide](https://lucide.dev) |
| Effects | [Beam](https://libraries.dev/beam) (`border-beam`) for the Prompt Input glow |
| Docs | [Fumadocs](https://fumadocs.dev) (MDX), [Shiki](https://shiki.style) for code highlighting |
| Monorepo | [Turborepo](https://turbo.build), [pnpm](https://pnpm.io) workspaces |
| Analytics | [PostHog](https://posthog.com), [Vercel Analytics](https://vercel.com/analytics) |
| Hosting / CI | [Vercel](https://vercel.com), GitHub Actions (`.github/workflows/deploy.yml`) |

---

## Project structure

```text
.
├── apps/
│   └── web/                         # The docs site (Next.js)
│       ├── app/                     # Routes: home, /components, /docs/[...slug]
│       ├── components/
│       │   ├── browser/             # Docs layout: sidebar, breadcrumbs, "on this page"
│       │   ├── docs/                # Live demos (<Name>Demo.tsx) and docs helpers
│       │   └── home/                # Home page sections
│       ├── content/docs/components/ # One MDX page per component
│       ├── lib/                     # Site config (site.ts), component index and ordering
│       └── public/previews/         # Card images for the home page
├── packages/
│   ├── ui/                          # The components themselves
│   │   └── src/
│   │       ├── components/ui/       # One file or one folder per component
│   │       ├── lib/utils.ts         # cn() helper
│   │       └── styles/              # global.css and tokens.css (design tokens)
│   ├── eslint-config/               # Shared ESLint config
│   └── typescript-config/           # Shared tsconfig
├── turbo.json
└── pnpm-workspace.yaml
```

The docs app imports components from the `ui` package as `@workspace/ui/components/ui/<name>`.
A component page appears in the sidebar, the `/components` catalog and search automatically
as soon as its MDX file exists.

---

## Running it locally

**You need:** Node.js 20 or newer and pnpm 10 (`corepack enable` sets it up).

```bash
git clone https://github.com/GOURAVSINGH19/UI.git
cd UI
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | What it does |
| --- | --- |
| `pnpm dev` | Starts the docs site with hot reload |
| `pnpm build` | Builds every app and package (CI runs this on every pull request) |
| `pnpm lint` | Lints every package |
| `pnpm format` | Formats the code with Prettier |
| `pnpm --filter web typecheck` | Type-checks the docs app and the components it uses |

### Environment variables (optional)

The site runs without any. Put these in `apps/web/.env.local` if you need them:

| Variable | Used for |
| --- | --- |
| `APP_URL` | The site's public URL, used for absolute links and metadata |
| `POSTHOG_KEY` | PostHog project key (analytics are off without it) |
| `POSTHOG_HOST` | PostHog host |
| `CODE_THEME` | Shiki theme for code blocks |

---

## Contributing

Contributions of all sizes are welcome: bug fixes, docs, accessibility improvements and new components.

1. **Open an issue first** for anything bigger than a small fix, so we can agree on the idea before you build it.
2. **Fork** the repo and create a branch from `main`:
   ```bash
   git checkout -b feat/component-name
   ```
3. **Make your change** and check it in the browser, in both light and dark mode and at phone width.
4. **Run the checks** before pushing:
   ```bash
   pnpm --filter web typecheck
   pnpm build
   ```
5. **Commit** with a short, clear message, e.g. `Add model selector component` or `Fix focus ring in simple search`.
6. **Open a pull request** against `main`. Describe what changed and why, and add a screenshot or short video for anything visual.

Found a bug or have an idea? [Open an issue](https://github.com/GOURAVSINGH19/UI/issues).

---

## Adding a new component

Say you are adding a component called **Glow Card**.

### 1. Write the component

Create it in `packages/ui/src/components/ui/`.

- **Up to 200 lines:** a single file, `glow-card.tsx`.
- **Over 200 lines:** a folder, split by job, with no file over 200 lines:

  ```text
  glow-card/
  ├── glow-card.tsx   # The main component
  ├── parts.tsx       # Smaller pieces it renders
  ├── hooks.ts        # State and effects
  ├── types.ts        # Props and shared types
  └── index.tsx       # Public exports
  ```

Use `cn()` from `@workspace/ui/lib/utils` and the design tokens (`bg-ui-bg`, `text-ui-heading`,
`border-ui-border`, …) instead of hard-coded colours, so it works in both themes.

### 2. Add a demo

Create `apps/web/components/docs/GlowCardDemo.tsx`: a small client component that shows it off.

```tsx
"use client"

import { GlowCard } from "@workspace/ui/components/ui/glow-card/index"

export function GlowCardDemo() {
  return <GlowCard>Hello</GlowCard>
}
```

(For a single-file component the import path has no `/index`.)

### 3. Add the docs page

Create `apps/web/content/docs/components/glow-card.mdx`:

```mdx
---
title: Glow Card
description: One sentence on what it is and what makes it nice.
category: Effects
badge: New
---

import { GlowCardDemo } from "../../../components/docs/GlowCardDemo"
import { DocsTable } from "../../../components/docs/DocsSurface"

## Preview

<ComponentPreviewTabs
  component={<GlowCardDemo />}
  source={<ComponentCode path="components/ui/glow-card" src="../../packages/ui/src/components/ui/glow-card" tokens />}
/>

## Setup

<ComponentSetup
  path="components/ui/glow-card"
  dependencies="framer-motion"
  tokens
  example={"import { GlowCard } from \"@/components/ui/glow-card\"\n\n<GlowCard>Hello</GlowCard>"}
/>

## Usage

## Props

## Accessibility
```

| Frontmatter | Meaning |
| --- | --- |
| `title` | Name shown everywhere |
| `description` | One line for cards, search and SEO |
| `category` | Sidebar group, e.g. `Buttons`, `Inputs`, `Effects`, `Animations` |
| `badge` | Optional pill such as `New` |
| `blog` | Optional link to a write-up about how it was built |

For `ComponentCode` and `ComponentSetup`, `path` is where the reader puts the code and `src`
is where it lives in this repo. Point both at the folder for a multi-file component, or at
the `.tsx` file for a single file. Add `tokens` if it uses the design tokens, and
`utils={false}` if it doesn't use `cn()`.

That's it: the page shows up in the sidebar, the catalog and search on its own.

**Optional:** to feature it on the home page, add its slug to `FEATURED` in
`apps/web/components/ComponentList.tsx` and add `glow-card-light.png` and `glow-card-dark.png`
(16:10) to `apps/web/public/previews/`. To change the sidebar's category order, edit
`apps/web/lib/component-groups.ts`.

---

## Guidelines

- **Accessible:** real buttons and inputs, labels on icon buttons, full keyboard support, visible focus.
- **Motion with care:** follow `prefers-reduced-motion`; animations should help, not get in the way.
- **Both themes:** use the design tokens and check light and dark mode.
- **Small files:** no file over 200 lines; split by responsibility and keep related files in one folder.
- **Few dependencies:** add a package only when it clearly earns its place, and list it under Setup.
- **Readable code:** clear names, a short comment where something isn't obvious, and code that matches its neighbours.
- **Typed:** no `any`; export the props type with the component.

---

## Credits

- [Beam](https://libraries.dev/beam) by [Libraries.dev](https://github.com/Jakubantalik/Libraries.dev), the glow on Prompt Input
- [Fumadocs](https://fumadocs.dev), the docs framework
- [Radix UI](https://www.radix-ui.com) and [shadcn/ui](https://ui.shadcn.com), for primitives and the copy-the-code idea
- [Lucide](https://lucide.dev), the icons

---

## License

[MIT](./LICENSE) © 2026 [Gourav Singh](https://github.com/GOURAVSINGH19).
Use it in personal and commercial projects. Credit is appreciated but not required.

Made by Gourav Singh · [X](https://x.com/GouravSing85027) · [LinkedIn](https://www.linkedin.com/in/gourav-singh-814293258) · [GitHub](https://github.com/GOURAVSINGH19)
