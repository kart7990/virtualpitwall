"use client";

import { Icons } from "@/components/core/icons";
import { Button } from "@/components/core/ui/button";
import { ScrollArea } from "@/components/core/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/core/ui/sheet";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ViewVerticalIcon } from "@radix-ui/react-icons";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

export function MobileNav({ isPublic }: { isPublic: boolean }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <ViewVerticalIcon className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={setOpen}
        >
          <Icons.logoPNG className="mr-2 h-4 w-4" />
          <span className="font-bold">{siteConfig.name}</span>
        </MobileLink>
        {!isPublic && (
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              {/* <MobileLink href="/Dashboard" onOpenChange={setOpen}>
                Dashboards
              </MobileLink>
              <MobileLink href="/Dashboard" onOpenChange={setOpen}>
                Teams
              </MobileLink>
              <MobileLink href="/Dashboard" onOpenChange={setOpen}>
                Settings
              </MobileLink> */}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}
