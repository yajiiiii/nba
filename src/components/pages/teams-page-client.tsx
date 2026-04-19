"use client";

import { Trophy } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { TeamChip } from "@/components/shared/team-chip";
import { TeamLogo } from "@/components/shared/team-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTeamsQuery } from "@/hooks/use-teams";
import type { Team } from "@/lib/types";

export function TeamsPageClient({ initialTeams }: { initialTeams: Team[] }) {
  const teamsQuery = useTeamsQuery(initialTeams);
  const [conference, setConference] = useState<"all" | "East" | "West">("all");
  const [search, setSearch] = useState("");
  const teams = teamsQuery.data ?? [];

  const filteredTeams = teams.filter((team) => {
    if (conference !== "all" && team.conference !== conference) {
      return false;
    }

    if (!search.trim()) {
      return true;
    }

    return `${team.city} ${team.name} ${team.code}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
  });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Team directory
        </p>
        <h1 className="font-heading text-5xl uppercase tracking-[0.08em] text-foreground sm:text-6xl">
          All 30 NBA teams
        </h1>
        <p className="max-w-3xl text-base text-muted-foreground">
          Browse every club, jump into team-filtered schedule views, and keep the
          experience focused on NBA-only coverage.
        </p>
      </section>

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search teams by city, name, or abbreviation"
              aria-label="Search NBA teams"
            />
            <div className="flex flex-wrap gap-2">
              {(["all", "East", "West"] as const).map((value) => (
                <Button
                  key={value}
                  variant={conference === value ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setConference(value)}
                >
                  {value === "all" ? "All teams" : value}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredTeams.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTeams.map((team) => (
            <Card key={team.slug} className="overflow-hidden">
              <div
                className="h-2 w-full"
                style={{
                  background: `linear-gradient(90deg, ${team.primaryColor}, ${team.secondaryColor})`,
                }}
              />
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {team.conference} #{team.conferenceRank}
                    </p>
                    <h2 className="font-heading text-4xl uppercase tracking-[0.08em] text-foreground">
                      {team.city}
                    </h2>
                    <p className="text-lg font-semibold text-foreground">
                      {team.name}
                    </p>
                  </div>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.04] p-2">
                    <TeamLogo slug={team.slug} code={team.code} size={44} />
                  </div>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {team.description}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[1.25rem] border border-white/5 bg-white/[0.03] p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Record
                    </p>
                    <p className="text-xl font-black text-foreground">
                      {team.wins}-{team.losses}
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/5 bg-white/[0.03] p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Last 10
                    </p>
                    <p className="text-xl font-black text-foreground">
                      {team.last10}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="h-4 w-4 text-primary" />
                  {team.championships} championships
                </div>
                <TeamChip team={team} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No teams found"
          description="Adjust the conference view or search term to bring teams back into the grid."
        />
      )}
    </div>
  );
}
