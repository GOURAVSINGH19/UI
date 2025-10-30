import type { ReactNode } from "react";
import { DocsLayout as FumaDocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return <FumaDocsLayout tree={source.pageTree}>{children}</FumaDocsLayout>;
}
