import type { Metadata } from 'next'
import { Providers } from '@/lib/providers'
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import './globals.css'
import '../../node_modules/react-grid-layout/css/styles.css'
import '../../node_modules/react-resizable/css/styles.css'
import { ThemeProvider } from "@/app/theme-provider"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'Virtual Pit Wall',
  description: 'The Virtual Pit Wall platform, displays all relevant iRacing event data on a web-based dashboard.',
}

export default function RootLayout({
  children
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
            {children}
          </ThemeProvider>
        </body>
      </html>
    </Providers>
  )
}
