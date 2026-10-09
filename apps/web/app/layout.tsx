import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "@workspace/ui/global.css"
import { RootProvider } from 'fumadocs-ui/provider/next';
import Navbar from "@/components/Navbar";
import { getComponents } from "@/lib/components-index";
import { LenisProvider } from "./leisprovider/lenisProvider";
import { SoundProvider } from "@/components/SoundProvider";
import type { Metadata, Viewport } from "next";
import { absoluteUrl, site, siteUrl, socials } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: site.keywords,
  authors: [{ name: site.author, url: socials[0].href }],
  creator: site.author,
  publisher: site.author,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    creator: site.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  category: "technology",
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: site.author,
  email: `mailto:${site.email}`,
  sameAs: socials.map((s) => s.href),
}

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: site.name,
  url: siteUrl,
  description: site.description,
  inLanguage: "en",
  publisher: { "@id": `${siteUrl}/#person` },
}

const libraryLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "@id": `${siteUrl}/#library`,
  name: site.name,
  description: site.description,
  url: absoluteUrl("/components"),
  codeRepository: site.repo,
  license: site.license,
  programmingLanguage: ["TypeScript", "React"],
  runtimePlatform: "React",
  keywords: site.keywords.join(", "),
  author: { "@id": `${siteUrl}/#person` },
  isAccessibleForFree: true,
}

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode

}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}
    >
      <body className="antialiased">
        <JsonLd data={[personLd, websiteLd, libraryLd]} />
        <RootProvider
          search={{
            enabled: false,
          }}
          theme={{
            attribute: "class",
            defaultTheme: "system",
            enableSystem: true,
            disableTransitionOnChange: true,
          }}
        >
          <LenisProvider />
          <SoundProvider />
          <Navbar components={getComponents()} />
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
          </div>
        </RootProvider>
      </body>
    </html>
  )
}
