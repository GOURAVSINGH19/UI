import { Geist, Geist_Mono } from "next/font/google";
import "@workspace/ui/styles/globals.css"
import { Providers } from "@/components/providers"
import { RootProvider } from 'fumadocs-ui/provider/next';

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
        <RootProvider search={{
          enabled:false
        }}
        >
          <Providers>
            {children}
          </Providers>
        </RootProvider>
      </body>
    </html>
  )
}
