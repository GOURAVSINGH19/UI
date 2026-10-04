import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "@workspace/ui/global.css"
import { RootProvider } from 'fumadocs-ui/provider/next';
import Navbar from "@/components/Navbar";
import { getComponents } from "@/lib/components-index";
import { LenisProvider } from "./leisprovider/lenisProvider";

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
    // Font variables live on <html> so the --ui-font-* tokens on :root can resolve them.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}
    >
      <body className="antialiased">
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
          <Navbar components={getComponents()} />
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
          </div>
        </RootProvider>
      </body>
    </html>
  )
}
