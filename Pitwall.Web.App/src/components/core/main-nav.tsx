"use client";

import { Icons } from "@/components/core/icons";
import { siteConfig } from "@/config/site";
import { selectUser, useSelector } from "@/lib/redux";
import { User } from "@/lib/redux/slices/authSlice/models";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainNav({ isPublic }: { isPublic: boolean }) {
  const pathname = usePathname();

  const user = useSelector<User>(selectUser);

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logoPNG className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {!isPublic && (
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {/* <Link
            href={dashboardHref}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/pitwall/dashboard")
                ? "text-foreground"
                : "text-foreground/60",
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/docs/components"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/docs/components")
                ? "text-foreground"
                : "text-foreground/60",
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
                : "text-foreground/60",
            )}
          >
            Settings
          </Link> */}
        </nav>
      )}
    </div>
  );
}
