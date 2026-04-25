"use client";

import { BarChart3, MessageSquareText, ShieldCheck, Users } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { GameCard } from "@/components/shared/game-card";
import { StatusPill } from "@/components/shared/status-pill";
import { StreamSourceSwitcher } from "@/components/shared/stream-source-switcher";
import { TeamLogo } from "@/components/shared/team-logo";
import { VideoPlayer } from "@/components/shared/video-player";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGameQuery } from "@/hooks/use-game";
import { useGamesQuery } from "@/hooks/use-games";
import { formatGameDate, formatGameTime } from "@/lib/formatters";
import type { GameWithTeams } from "@/lib/types";

function StatBar({
  label,
  awayValue,
  homeValue,
}: {
  label: string;
  awayValue: number;
  homeValue: number;
}) {
  const total = awayValue + homeValue || 1;
  const awayPct = (awayValue / total) * 100;
  const homePct = (homeValue / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-foreground">{awayValue}</span>
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
        <span className="font-semibold text-foreground">{homeValue}</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-white/5">
        <div className="bg-primary" style={{ width: `${awayPct}%` }} />
        <div className="bg-white/20" style={{ width: `${homePct}%` }} />
      </div>
    </div>
  );
}

function LineupColumn({
  title,
  players,
}: {
  title: string;
  players: string[];
}) {
  return (
    <div className="space-y-2 rounded-[1.25rem] border border-white/5 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      <div className="space-y-2">
        {players.map((player) => (
          <p key={player} className="text-sm text-foreground">
            {player}
          </p>
        ))}
      </div>
    </div>
  );
}

export function GamePageClient({
  slug,
  initialGame,
  initialGames,
}: {
  slug: string;
  initialGame: GameWithTeams | null;
  initialGames: GameWithTeams[];
}) {
  const gameQuery = useGameQuery(slug, initialGame);
  const gamesQuery = useGamesQuery({}, initialGames);
  const game = gameQuery.data;
  const relatedGames = (gamesQuery.data ?? [])
    .filter((item) => item.slug !== slug)
    .slice(0, 4);

  if (!game) {
    return (
      <EmptyState
        title="Game not found"
        description="This matchup is not in the current mock schedule. Head back to the schedule page to pick another NBA game."
      />
    );
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill game={game} />
          <Badge variant="muted">{game.nationalTv}</Badge>
          <Badge variant="warning">
            {formatGameDate(game.startTime)} • {formatGameTime(game.startTime)}
          </Badge>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-4">
            <TeamLogo slug={game.awayTeam.slug} code={game.awayTeam.code} size={56} />
            <h1 className="font-heading text-5xl uppercase tracking-[0.08em] text-foreground sm:text-6xl">
              {game.awayTeam.name} vs {game.homeTeam.name}
            </h1>
            <TeamLogo slug={game.homeTeam.slug} code={game.homeTeam.code} size={56} />
          </div>
          <p className="max-w-4xl text-base leading-7 text-muted-foreground sm:text-lg">
            {game.description}
          </p>
        </div>
      </section>

      <div id="watch" className="scroll-mt-24">
        {game.status !== "finished" &&
        (game.streamType === "cdnlivetv" || game.streamType === "none") ? (
          <StreamSourceSwitcher
            slug={game.slug}
            initialUrl={game.streamType === "cdnlivetv" ? game.streamUrl : null}
            title={`${game.awayTeam.name} vs ${game.homeTeam.name}`}
          />
        ) : (
          <VideoPlayer
            streamType={game.streamType}
            streamUrl={game.streamUrl}
            title={`${game.awayTeam.name} vs ${game.homeTeam.name}`}
          />
        )}
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="grid gap-4 p-5 md:grid-cols-3">
              <div className="rounded-[1.25rem] border border-white/5 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Match status
                </p>
                <p className="mt-2 text-2xl font-black text-foreground">
                  {game.status === "upcoming"
                    ? "Pregame"
                    : `${game.score.away}-${game.score.home}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {game.quarter ?? "Awaiting tip"}
                  {game.clock ? ` • ${game.clock}` : ""}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/5 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Arena
                </p>
                <p className="mt-2 text-2xl font-black text-foreground">{game.arena}</p>
                <p className="text-sm text-muted-foreground">{game.nationalTv}</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/5 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Teams
                </p>
                <p className="mt-2 text-2xl font-black text-foreground">
                  {game.awayTeam.code} / {game.homeTeam.code}
                </p>
                <p className="text-sm text-muted-foreground">NBA only coverage</p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="stream">
            <TabsList>
              <TabsTrigger value="stream">Stream</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="lineups">Lineups</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="stream">
              <Card>
                <CardHeader>
                  <CardTitle>Stream Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3 rounded-[1.25rem] border border-white/5 bg-white/[0.03] px-4 py-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-success" />
                    <p>
                      Streams are aggregated from third-party channels. If one
                      source fails or is geo-blocked, switch to another from the
                      source list under the player.
                    </p>
                  </div>
                  <p>{game.headline}</p>
                  <p>
                    Current source type: <span className="text-foreground">{game.streamType}</span>
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Team Comparison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    {game.stats.leaders.map((leader) => (
                      <div
                        key={`${leader.team}-${leader.label}`}
                        className="rounded-[1.25rem] border border-white/5 bg-white/[0.03] p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {leader.label}
                        </p>
                        <p className="mt-2 text-xl font-black text-foreground">
                          {leader.value}
                        </p>
                        <p className="text-sm text-muted-foreground">{leader.player}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-5">
                    <StatBar
                      label="Rebounds"
                      awayValue={game.stats.away.rebounds}
                      homeValue={game.stats.home.rebounds}
                    />
                    <StatBar
                      label="Assists"
                      awayValue={game.stats.away.assists}
                      homeValue={game.stats.home.assists}
                    />
                    <StatBar
                      label="Points in paint"
                      awayValue={game.stats.away.pointsInPaint}
                      homeValue={game.stats.home.pointsInPaint}
                    />
                    <StatBar
                      label="Fast break points"
                      awayValue={game.stats.away.fastBreakPoints}
                      homeValue={game.stats.home.fastBreakPoints}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lineups">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{game.awayTeam.name} Rotation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <LineupColumn title="Starters" players={game.lineups.away.starters} />
                    <LineupColumn title="Bench" players={game.lineups.away.bench} />
                    {game.lineups.away.out.length > 0 ? (
                      <LineupColumn title="Unavailable" players={game.lineups.away.out} />
                    ) : null}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{game.homeTeam.name} Rotation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <LineupColumn title="Starters" players={game.lineups.home.starters} />
                    <LineupColumn title="Bench" players={game.lineups.home.bench} />
                    {game.lineups.home.out.length > 0 ? (
                      <LineupColumn title="Unavailable" players={game.lineups.home.out} />
                    ) : null}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="chat">
              <EmptyState
                title="Chat coming soon"
                description="The placeholder is intentionally quiet right now. If you wire a moderation-ready real-time chat later, this tab is where it can live."
                icon={MessageSquareText}
              />
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Related games</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {relatedGames.map((related) => (
                <GameCard key={related.id} game={related} compact />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coverage details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3 rounded-[1.25rem] border border-white/5 bg-white/[0.03] px-4 py-3">
                <Users className="mt-0.5 h-4 w-4 text-primary" />
                <p>Lineups, stat leaders, and score status are all mock NBA sample data.</p>
              </div>
              <div className="flex items-start gap-3 rounded-[1.25rem] border border-white/5 bg-white/[0.03] px-4 py-3">
                <BarChart3 className="mt-0.5 h-4 w-4 text-primary" />
                <p>Swap the mock API with your licensed live data provider when ready.</p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
