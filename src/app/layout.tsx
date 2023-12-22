import type { Metadata } from 'next'
import { Providers } from '@/lib/providers'
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import './globals.css'
import '../../node_modules/react-grid-layout/css/styles.css'
import '../../node_modules/react-resizable/css/styles.css'
import { ThemeProvider } from "@/app/theme-provider"
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'


export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <html lang="en">

        <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark">
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </Providers>
  )
}
