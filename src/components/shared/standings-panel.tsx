"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRecord } from "@/lib/formatters";
import type { Team } from "@/lib/types";

function StandingsColumn({ teams }: { teams: Team[] }) {
  return (
    <div className="space-y-3">
      {teams.map((team) => (
        <div
          key={team.slug}
          className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 rounded-[1.25rem] border border-white/5 bg-white/[0.03] px-3 py-3"
        >
          <span className="text-center text-sm font-black text-primary">
            {team.conferenceRank}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {team.city} {team.name}
            </p>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {team.last10} • {team.streak}
            </p>
          </div>
          <span className="text-sm font-semibold text-foreground">
            {formatRecord(team)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function StandingsPanel({ teams }: { teams: Team[] }) {
  const eastTeams = teams
    .filter((team) => team.conference === "East")
    .slice(0, 5);
  const westTeams = teams
    .filter((team) => team.conference === "West")
    .slice(0, 5);

  return (
    <Tabs defaultValue="east" className="space-y-5">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Conference snapshot
        </p>
        <TabsList>
          <TabsTrigger value="east">East</TabsTrigger>
          <TabsTrigger value="west">West</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="east">
        <StandingsColumn teams={eastTeams} />
      </TabsContent>
      <TabsContent value="west">
        <StandingsColumn teams={westTeams} />
      </TabsContent>
    </Tabs>
  );
}
