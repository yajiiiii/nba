"use client";

import { CircleAlert, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { EmptyState } from "@/components/shared/empty-state";
import { FeaturedGameCard } from "@/components/shared/featured-game-card";
import { GameCard } from "@/components/shared/game-card";
import { StandingsPanel } from "@/components/shared/standings-panel";
import { TeamChip } from "@/components/shared/team-chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamesQuery } from "@/hooks/use-games";
import { useStandingsQuery } from "@/hooks/use-standings";
import type { GameWithTeams, Team } from "@/lib/types";

function HomeSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Skeleton className="aspect-[16/9] w-full rounded-[2rem]" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-60 w-full rounded-[1.75rem]" />
          <Skeleton className="h-60 w-full rounded-[1.75rem]" />
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-72 w-full rounded-[1.75rem]" />
        <Skeleton className="h-72 w-full rounded-[1.75rem]" />
      </div>
    </div>
  );
}

export function HomePageClient({
  initialGames,
  initialStandings,
}: {
  initialGames: GameWithTeams[];
  initialStandings: Team[];
}) {
  const gamesQuery = useGamesQuery({}, initialGames);
  const standingsQuery = useStandingsQuery(initialStandings);

  if (gamesQuery.isLoading || standingsQuery.isLoading) {
    return <HomeSkeleton />;
  }

  if (gamesQuery.isError || standingsQuery.isError || !gamesQuery.data) {
    return (
      <EmptyState
        title="Dashboard offline"
        description="The NBA dashboard could not load right now. Try again in a moment."
        icon={CircleAlert}
        actionLabel="Retry"
        onAction={() => {
          void gamesQuery.refetch();
          void standingsQuery.refetch();
        }}
      />
    );
  }

  const games = gamesQuery.data;
  const standings = standingsQuery.data ?? [];
  const featuredGame =
    games.find((game) => game.featured) ??
    games.find((game) => game.status === "live") ??
    games[0];

  const liveGames = games.filter((game) => game.status === "live");
  const upcomingGames = games
    .filter((game) => game.status === "upcoming")
    .slice(0, 4);
  const recentResults = games
    .filter((game) => game.status === "finished")
    .slice(0, 4);
  const shortcutTeams = Array.from(
    new Map(
      games.flatMap((game) => [game.homeTeam, game.awayTeam]).map((team) => [
        team.slug,
        team,
      ]),
    ).values(),
  ).slice(0, 8);

  return (
    <div className="space-y-8">
      {featuredGame ? <FeaturedGameCard game={featuredGame} /> : null}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Live now
                </p>
                <h2 className="font-heading text-4xl uppercase tracking-[0.08em] text-foreground">
                  Scoreboard in motion
                </h2>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground sm:flex">
                <Sparkles className="h-4 w-4 text-primary" />
                Premium NBA only
              </div>
            </div>
            {liveGames.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {liveGames.map((game) => (
                  <GameCard key={game.id} game={game} compact />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No live games"
                description="When a legal stream is attached or a game tips off, the live rail will surface it here with a high-contrast glow."
              />
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="space-y-4"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Upcoming games
              </p>
              <h2 className="font-heading text-4xl uppercase tracking-[0.08em] text-foreground">
                On deck
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: 0.1 }}
            className="space-y-4"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Recent results
              </p>
              <h2 className="font-heading text-4xl uppercase tracking-[0.08em] text-foreground">
                Final buzz
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {recentResults.map((game) => (
                <GameCard key={game.id} game={game} compact />
              ))}
            </div>
          </motion.section>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Standings
              </p>
              <CardTitle>Conference Leaders</CardTitle>
            </CardHeader>
            <CardContent>
              <StandingsPanel teams={standings} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Teams
              </p>
              <CardTitle>Quick Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {shortcutTeams.map((team) => (
                <TeamChip key={team.slug} team={team} />
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
