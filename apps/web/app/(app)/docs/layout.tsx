import { BrowserShell } from "@/components/browser/BrowserShell"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <BrowserShell>{children}</BrowserShell>
}
