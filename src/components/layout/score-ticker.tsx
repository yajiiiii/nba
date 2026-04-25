"use client";

import Link from "next/link";

import { LiveBadge } from "@/components/shared/live-badge";
import { TeamLogo } from "@/components/shared/team-logo";
import { formatGameTime } from "@/lib/formatters";
import type { GameWithTeams } from "@/lib/types";

export function ScoreTicker({ games }: { games: GameWithTeams[] }) {
  const live = games
    .filter((game) => game.status === "live")
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
  const upcoming = games
    .filter((game) => game.status === "upcoming")
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
  const finished = games
    .filter((game) => game.status === "finished")
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    )
    .slice(0, 6);

  const tickerGames = [...live, ...upcoming, ...finished].slice(0, 14);
  const marqueeItems = [...tickerGames, ...tickerGames];

  return (
    <div className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/90 backdrop-blur-xl">
      <div className="group flex h-10 items-center overflow-hidden">
        <div className="animate-ticker group-hover:[animation-play-state:paused] flex w-max items-center gap-3 px-4">
          {marqueeItems.map((game, index) => (
            <Link
              key={`${game.slug}-${index}`}
              href={`/game/${game.slug}`}
              className="flex min-w-max items-center gap-3 rounded-full border border-transparent bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <TeamLogo slug={game.awayTeam.slug} code={game.awayTeam.code} size={16} />
              <span className="font-semibold text-foreground">
                {game.awayTeam.code}
              </span>
              <span className="text-muted-foreground">at</span>
              <span className="font-semibold text-foreground">
                {game.homeTeam.code}
              </span>
              <TeamLogo slug={game.homeTeam.slug} code={game.homeTeam.code} size={16} />
              {game.status === "live" ? (
                <>
                  <span className="text-foreground">
                    {game.score.away} - {game.score.home}
                  </span>
                  <LiveBadge className="py-0.5" />
                </>
              ) : null}
              {game.status === "upcoming" ? (
                <span className="text-muted-foreground">
                  {formatGameTime(game.startTime)}
                </span>
              ) : null}
              {game.status === "finished" ? (
                <>
                  <span className="text-foreground">
                    {game.score.away} - {game.score.home}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Final
                  </span>
                </>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
