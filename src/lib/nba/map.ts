import { teams } from "@/data/teams";
import type { CdnGame } from "@/lib/nba/client";
import { resolveTeamSlugByTricode } from "@/lib/nba/team-map";
import type { Game, GameStatus, GameWithTeams, PlayerGroup, Team } from "@/lib/types";

const teamMap = teams.reduce<Record<string, Team>>((map, team) => {
  map[team.slug] = team;
  return map;
}, {});

const emptyLineup: PlayerGroup = { starters: [], bench: [], out: [] };
const emptyTeamStats = {
  fg: "—",
  threePt: "—",
  rebounds: 0,
  assists: 0,
  turnovers: 0,
  fouls: 0,
  pointsInPaint: 0,
  fastBreakPoints: 0,
};

function toGameStatus(gameStatus: number): GameStatus {
  if (gameStatus === 2) return "live";
  if (gameStatus === 3) return "finished";
  return "upcoming";
}

function quarterLabel(period: number) {
  if (!period || period <= 0) return undefined;
  if (period <= 4) return `Q${period}`;
  return `OT${period - 4}`;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function mapCdnGameToGame(cdn: CdnGame): GameWithTeams | null {
  const homeSlug = resolveTeamSlugByTricode(cdn.homeTeam.teamTricode);
  const awaySlug = resolveTeamSlugByTricode(cdn.awayTeam.teamTricode);

  if (!homeSlug || !awaySlug) return null;

  const home = teamMap[homeSlug];
  const away = teamMap[awaySlug];
  if (!home || !away) return null;

  const status = toGameStatus(cdn.gameStatus);
  const broadcaster = cdn.natlTvBroadcasters?.[0]?.broadcasterDisplay ?? "League Pass";

  const slug = slugify(`${away.slug}-vs-${home.slug}-${cdn.gameId}`);
  const dateKey = new Date(cdn.gameTimeUTC).toISOString().slice(0, 10);

  const base: Game = {
    id: cdn.gameId,
    slug,
    homeTeam: home.slug,
    awayTeam: away.slug,
    startTime: cdn.gameTimeUTC,
    status,
    score: {
      home: cdn.homeTeam.score ?? 0,
      away: cdn.awayTeam.score ?? 0,
    },
    arena: home.arena,
    streamType: "none",
    streamUrl: null,
    thumbnail: "/thumbnails/league-night.svg",
    isLive: status === "live",
    featured: status === "live",
    quarter: quarterLabel(cdn.period),
    clock: cdn.gameClock ? cdn.gameClock.replace(/^PT/, "").replace("M", ":").replace("S", "") : undefined,
    headline: `${away.name} at ${home.name}`,
    description: cdn.gameStatusText,
    nationalTv: broadcaster,
    tags: status === "live" ? ["Live"] : status === "finished" ? ["Final"] : ["Scheduled"],
    lineups: { home: emptyLineup, away: emptyLineup },
    stats: { home: emptyTeamStats, away: emptyTeamStats, leaders: [] },
  };

  return {
    ...base,
    homeTeam: home,
    awayTeam: away,
    dateKey,
    hasStream: false,
  };
}

export function mapCdnGamesToGames(cdnGames: CdnGame[]): GameWithTeams[] {
  return cdnGames
    .map(mapCdnGameToGame)
    .filter((game): game is GameWithTeams => game !== null);
}
