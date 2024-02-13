import { MainNav } from "@/components/core/main-nav";
import { MobileNav } from "@/components/core/mobile-nav";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Button } from "./ui/button";
import { UserNav } from "./user-nav";

export function SiteHeader({ isPublic }: { isPublic: boolean }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center">
        <MainNav isPublic={isPublic} />
        <MobileNav isPublic={isPublic} />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* TODO: Find a way to not use this spacer */}
          </div>
        </div>
        {!isPublic && (
          <div className="mr-4">
            <nav className="flex gap-2">
              <Link
                href={siteConfig.links.client}
                target="_blank"
                rel="noreferrer"
              >
                <Button>
                  <span>Download Client</span>
                </Button>
              </Link>

              <div className="ml-auto flex items-center space-x-4">
                <UserNav />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
