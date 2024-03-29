import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="px-6 py-6 md:py-0">
      <div className="flex flex-col items-center md:h-12 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          The source code is available on{" "}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
