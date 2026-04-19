"use client";

import { startTransition, useEffect, useState } from "react";
import { CalendarDays, Filter } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { ScheduleList } from "@/components/shared/schedule-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGamesQuery } from "@/hooks/use-games";
import { STATUS_FILTERS } from "@/lib/constants";
import { formatScheduleHeading } from "@/lib/formatters";
import type { GameStatus, GameWithTeams } from "@/lib/types";

export function SchedulePageClient({
  initialGames,
  initialStatus,
  initialTeam,
  initialDate,
}: {
  initialGames: GameWithTeams[];
  initialStatus: GameStatus | "all";
  initialTeam: string;
  initialDate: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const gamesQuery = useGamesQuery({}, initialGames);
  const [status, setStatus] = useState<GameStatus | "all">(initialStatus);
  const [team, setTeam] = useState(initialTeam);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  useEffect(() => {
    const search = new URLSearchParams();

    if (status !== "all") {
      search.set("status", status);
    }

    if (team.trim()) {
      search.set("team", team.trim());
    }

    if (selectedDate) {
      search.set("date", selectedDate);
    }

    const query = search.toString();

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }, [pathname, router, selectedDate, status, team]);

  const games = gamesQuery.data ?? [];
  const dates = Array.from(new Set(games.map((game) => game.dateKey))).sort();
  const filteredGames = games.filter((game) => {
    if (status !== "all" && game.status !== status) {
      return false;
    }

    if (selectedDate && game.dateKey !== selectedDate) {
      return false;
    }

    if (!team.trim()) {
      return true;
    }

    const normalizedTeam = team.trim().toLowerCase();
    const teamText =
      `${game.homeTeam.city} ${game.homeTeam.name} ${game.homeTeam.code} ${game.awayTeam.city} ${game.awayTeam.name} ${game.awayTeam.code}`.toLowerCase();

    return teamText.includes(normalizedTeam);
  });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Schedule center
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-heading text-5xl uppercase tracking-[0.08em] text-foreground sm:text-6xl">
              NBA by date
            </h1>
            <p className="mt-2 max-w-3xl text-base text-muted-foreground">
              Filter the slate by live status, date, or team and move straight into
              any legal stream-enabled game page.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            {selectedDate ? formatScheduleHeading(selectedDate) : "All available dates"}
          </div>
        </div>
      </section>

      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Filter className="h-4 w-4 text-primary" />
            Filters
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <Button
                key={filter.value}
                variant={status === filter.value ? "default" : "secondary"}
                size="sm"
                onClick={() => setStatus(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
            <Input
              value={team}
              onChange={(event) => setTeam(event.target.value)}
              placeholder="Filter by team, city, or abbreviation"
              aria-label="Filter schedule by team"
            />
            <select
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="h-11 rounded-full border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Filter schedule by date"
            >
              <option value="">All dates</option>
              {dates.map((date) => (
                <option key={date} value={date}>
                  {formatScheduleHeading(date)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {filteredGames.length > 0 ? (
        <ScheduleList games={filteredGames} />
      ) : (
        <EmptyState
          title="No games match"
          description="Try clearing a date or team filter to bring more NBA matchups back into view."
          actionLabel="Clear filters"
          onAction={() => {
            setStatus("all");
            setTeam("");
            setSelectedDate("");
          }}
        />
      )}
    </div>
  );
}
