"use client";

import Image from "next/image";
import { Trophy } from "lucide-react";

import { useBracketQuery } from "@/hooks/use-bracket";
import type { PlayoffSeries, PlayoffSeriesTeam } from "@/lib/nba/client";
import { cn } from "@/lib/utils";

function TeamRow({
  team,
  isWinner,
  row,
}: {
  team: PlayoffSeriesTeam | null;
  isWinner: boolean;
  row?: string;
}) {
  if (!team) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-white/5" />
          <span className="text-sm text-muted-foreground">TBD</span>
        </div>
        <span className="text-sm text-muted-foreground">–</span>
      </div>
    );
  }

  const logoUrl = `https://cdn.nba.com/logos/nba/${team.teamId}/primary/L/logo.svg`;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border px-3 py-2 transition",
        isWinner
          ? "border-primary/40 bg-primary/10"
          : "border-white/5 bg-white/[0.02]",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Image
          src={logoUrl}
          alt={`${team.teamTricode} logo`}
          width={28}
          height={28}
          className="object-contain"
          unoptimized
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {team.teamShortName || team.teamTricode}
          </p>
          {row ? (
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground truncate">
              {row}
            </p>
          ) : team.seed ? (
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              #{team.seed} seed
            </p>
          ) : null}
        </div>
      </div>
      <span
        className={cn(
          "text-lg font-black tabular-nums",
          isWinner ? "text-primary" : "text-foreground",
        )}
      >
        {team.seriesWin}
      </span>
    </div>
  );
}

function SeriesCard({ series }: { series: PlayoffSeries }) {
  return (
    <div className="space-y-2 rounded-[1.25rem] border border-white/5 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {series.seriesText ?? "Series"}
        </p>
        {series.summaryStatusText ? (
          <p className="text-[10px] uppercase tracking-[0.18em] text-primary">
            {series.summaryStatusText}
          </p>
        ) : null}
      </div>
      <TeamRow
        team={series.topTeam}
        isWinner={series.winner === "top"}
        row={series.topRow}
      />
      <TeamRow
        team={series.bottomTeam}
        isWinner={series.winner === "bottom"}
        row={series.bottomRow}
      />
    </div>
  );
}

function RoundColumn({
  title,
  series,
}: {
  title: string;
  series: PlayoffSeries[];
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      {series.length > 0 ? (
        series.map((s) => <SeriesCard key={s.seriesId} series={s} />)
      ) : (
        <div className="rounded-[1.25rem] border border-dashed border-white/10 bg-white/[0.02] p-4 text-xs text-muted-foreground">
          TBD
        </div>
      )}
    </div>
  );
}

function ConferenceBracket({
  conference,
  series,
}: {
  conference: "East" | "West";
  series: PlayoffSeries[];
}) {
  const rounds = [1, 2, 3].map((n) =>
    series.filter((s) => s.roundNumber === n),
  );

  const labels =
    conference === "East"
      ? ["East R1", "East Semis", "East Finals"]
      : ["West R1", "West Semis", "West Finals"];

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-2xl uppercase tracking-[0.1em] text-foreground">
        {conference === "East" ? "Eastern Conference" : "Western Conference"}
      </h3>
      <div className="grid gap-4 md:grid-cols-3">
        {rounds.map((roundSeries, idx) => (
          <RoundColumn
            key={labels[idx]}
            title={labels[idx]}
            series={roundSeries}
          />
        ))}
      </div>
    </div>
  );
}

export function Bracket() {
  const { data, isLoading, error } = useBracketQuery();
  const series = data ?? [];

  if (isLoading) {
    return (
      <div className="rounded-[1.5rem] border border-white/5 bg-white/[0.03] p-6 text-sm text-muted-foreground">
        Loading real-time playoff bracket…
      </div>
    );
  }

  if (error || series.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-white/5 bg-white/[0.03] p-6 text-sm text-muted-foreground">
        Playoff bracket is not available yet. Check back once the NBA publishes
        the current season&apos;s bracket.
      </div>
    );
  }

  const east = series.filter((s) => s.conference === "East");
  const west = series.filter((s) => s.conference === "West");
  const finals = series.filter((s) => s.conference === "Final");

  return (
    <div className="space-y-8">
      <ConferenceBracket conference="East" series={east} />

      <div className="space-y-3">
        <h3 className="flex items-center gap-2 font-heading text-2xl uppercase tracking-[0.1em] text-foreground">
          <Trophy className="h-5 w-5 text-primary" />
          NBA Finals
        </h3>
        <div className="grid gap-4 md:grid-cols-1 md:max-w-md">
          {finals.length > 0 ? (
            finals.map((s) => <SeriesCard key={s.seriesId} series={s} />)
          ) : (
            <div className="rounded-[1.25rem] border border-dashed border-white/10 bg-white/[0.02] p-4 text-xs text-muted-foreground">
              TBD
            </div>
          )}
        </div>
      </div>

      <ConferenceBracket conference="West" series={west} />
    </div>
  );
}
