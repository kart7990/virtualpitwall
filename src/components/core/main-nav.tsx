"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/core/icons"

export function MainNav({ isPublic }: { isPublic: boolean }) {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logoPNG className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {!isPublic &&
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/docs"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/docs" ? "text-foreground" : "text-foreground/60"
            )}
          >
            Dashboards
          </Link>
          <Link
            href="/docs/components"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/docs/components")
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            Teams
          </Link>
          <Link
            href="/themes"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/themes")
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            Settings
          </Link>
        </nav>
      }
    </div>
  )
}
