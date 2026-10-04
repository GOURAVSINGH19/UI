type CodeThemeName = "default" | "min" | "vitesse" | "slack" | "nord" | "dracula" | "one-dark-pro" | "catppuccin"

interface DocsConfig {
    codeTheme?: CodeThemeName
}

// Page listings (sidebar, /components, search) come from the MDX frontmatter —
// see lib/components-index.ts.
export const docsConfig: DocsConfig = {
    codeTheme: (process.env.CODE_THEME as CodeThemeName) || "nord",
}
