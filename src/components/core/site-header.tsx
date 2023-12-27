import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { MainNav } from "@/components/core/main-nav"
import { MobileNav } from "@/components/core/mobile-nav"
import { Icons } from "@/components/core/icons"
import { Button } from "./ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* <CommandMenu /> */}
          </div>
          <nav className="flex items-center">
          <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <Button className="w-9 px-0" variant={"ghost"}>
                <Icons.gitHub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button >
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
