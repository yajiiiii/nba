import Link from "next/link";

import { SearchBar } from "@/components/layout/search-bar";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import type { GameWithTeams, Team } from "@/lib/types";

export function SiteNavbar({
  games,
  teams,
}: {
  games: GameWithTeams[];
  teams: Team[];
}) {
  return (
    <header className="sticky top-[var(--ticker-height)] z-40 border-b border-white/5 bg-[#080808]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div>
                <p className="font-heading text-3xl uppercase tracking-[0.18em] text-foreground">
                  NBA Snippets <span className="text-primary">- Yaji</span>
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  NBA streaming and scores
                </p>
              </div>
            </Link>
          </div>

          <SearchBar games={games} teams={teams} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {NAV_LINKS.map((link) => (
            <Button key={link.href} asChild variant="ghost" size="sm">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
}
