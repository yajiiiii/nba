import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { ScoreTicker } from "@/components/layout/score-ticker";
import type { GameWithTeams, Team } from "@/lib/types";

export function SiteChrome({
  children,
  games,
  teams,
}: {
  children: ReactNode;
  games: GameWithTeams[];
  teams: Team[];
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <ScoreTicker games={games} />
      <SiteNavbar games={games} teams={teams} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
