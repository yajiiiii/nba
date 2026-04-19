import Link from "next/link";

import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#060606]/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="space-y-2">
          <p className="font-heading text-2xl uppercase tracking-[0.14em] text-foreground">
            {SITE_NAME}
          </p>
          <p>
            NBA-only scores and legal streaming surfaces. No popups, no trackers,
            no scraped feeds.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
