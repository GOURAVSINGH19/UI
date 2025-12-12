import { codeToHtml } from "shiki"

export type CodeTheme = {
  light: string
  dark: string
}

export const codeThemes: Record<string, CodeTheme> = {
  nord: {
    light: "nord",
    dark: "nord",
  }
}

export async function highlightCode(
  code: string,
  language: string = "tsx",
  theme: keyof typeof codeThemes = "default"
) {
  const selectedTheme = codeThemes[theme] || codeThemes.default

  const html = await codeToHtml(code, {
    lang: language,
    themes: {
      light: selectedTheme.light,
      dark: selectedTheme.dark,
    },
    transformers: [
      {
        pre(node) {
          node.properties["class"] =
            "no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0 !bg-transparent"
        },
        code(node) {
          node.properties["data-line-numbers"] = ""
        },
        line(node) {
          node.properties["data-line"] = ""
        },
      },
    ],
  })

  return html
}