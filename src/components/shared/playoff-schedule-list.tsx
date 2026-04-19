import Image from "next/image";

import type { ScheduleGame } from "@/lib/nba/client";

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTimeLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function groupByDate(games: ScheduleGame[]): Record<string, ScheduleGame[]> {
  const out: Record<string, ScheduleGame[]> = {};
  for (const g of games) {
    const key = g.gameDateTimeUTC.slice(0, 10);
    (out[key] ||= []).push(g);
  }
  return out;
}

function TeamLine({
  team,
}: {
  team: ScheduleGame["homeTeam"];
}) {
  const logo = `https://cdn.nba.com/logos/nba/${team.teamId}/primary/L/logo.svg`;
  return (
    <div className="flex items-center gap-3">
      <Image
        src={logo}
        alt={`${team.teamTricode} logo`}
        width={28}
        height={28}
        className="object-contain"
        unoptimized
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {team.teamCity} {team.teamName}
        </p>
        {team.seed ? (
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            #{team.seed} seed
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function PlayoffScheduleList({ games }: { games: ScheduleGame[] }) {
  const grouped = groupByDate(games);
  const dates = Object.keys(grouped).sort();

  return (
    <div className="space-y-8">
      {dates.map((dateKey) => (
        <section key={dateKey} className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {dateKey}
            </p>
            <h3 className="font-heading text-3xl uppercase tracking-[0.08em] text-foreground">
              {formatDateLabel(dateKey)}
            </h3>
          </div>
          <div className="space-y-3">
            {grouped[dateKey].map((game) => (
              <div
                key={game.gameId}
                className="grid gap-4 rounded-[1.5rem] border border-border bg-surface/90 p-4 md:grid-cols-[170px_minmax(0,1fr)_auto] md:items-center"
              >
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {game.gameLabel}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatTimeLabel(game.gameDateTimeUTC)}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-primary">
                    {game.gameSubLabel || "Playoffs"}
                    {game.ifNecessary === "true" ? " • If necessary" : ""}
                  </p>
                </div>

                <div className="space-y-2">
                  <TeamLine team={game.awayTeam} />
                  <TeamLine team={game.homeTeam} />
                </div>

                <div className="space-y-1 text-left text-sm text-muted-foreground md:text-right">
                  {game.arenaName ? <p>{game.arenaName}</p> : null}
                  <p>{game.seriesText || "Series pending"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
