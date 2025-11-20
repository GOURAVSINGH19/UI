import { Geist, Geist_Mono } from "next/font/google";
import "@workspace/ui/global.css"
import { Providers } from "@/app/providers"
import { RootProvider } from 'fumadocs-ui/provider/next';
import Navbar from "@/components/Navbar";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased`}
      >
        <Navbar />
        <RootProvider search={{
          enabled: false
        }}
        >
          <Providers>
            <div className="relative z-10 flex min-h-screen flex-col ">
              {children}
            </div>
          </Providers>
        </RootProvider>
      </body>
    </html>
  )
}
