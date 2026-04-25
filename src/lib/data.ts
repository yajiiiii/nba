import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { unstable_noStore as noStore } from "next/cache";

import { mockGames } from "@/data/mock-games";
import { teams } from "@/data/teams";
import { toDateKey } from "@/lib/formatters";
import { fetchLiveScoreboard } from "@/lib/nba/client";
import { mapCdnGamesToGames } from "@/lib/nba/map";
import {
  buildSourcesForAllStreamEast,
} from "@/lib/providers/allstreameast";
import {
  buildSourcesForMatch,
  fetchNbaMatches,
  findChannelsForTeams,
  type CdnLiveTvMatch,
  type StreamSource,
} from "@/lib/providers/cdnlivetv";
import {
  buildSourcesForStreamedMatch,
  fetchBasketballMatches,
  findStreamedMatch,
  type StreamedMatch,
} from "@/lib/providers/streamed";
import type {
  Game,
  GamesFilter,
  GameWithTeams,
  StreamOverride,
  Team,
} from "@/lib/types";

const overridesPath = path.join(
  process.cwd(),
  "data",
  "admin-stream-overrides.json",
);

async function ensureOverridesFile() {
  await mkdir(path.dirname(overridesPath), { recursive: true });

  try {
    await readFile(overridesPath, "utf8");
  } catch {
    await writeFile(overridesPath, "[]\n", "utf8");
  }
}

async function readOverrides() {
  noStore();
  await ensureOverridesFile();

  const raw = await readFile(overridesPath, "utf8");
  return JSON.parse(raw) as StreamOverride[];
}

function getTeamMap() {
  return teams.reduce<Record<string, Team>>((map, team) => {
    map[team.slug] = team;
    return map;
  }, {});
}

function sortGames(games: GameWithTeams[]) {
  return [...games].sort((left, right) => {
    const statusWeight = {
      live: 0,
      upcoming: 1,
      finished: 2,
    };

    if (statusWeight[left.status] !== statusWeight[right.status]) {
      return statusWeight[left.status] - statusWeight[right.status];
    }

    const leftTime = new Date(left.startTime).getTime();
    const rightTime = new Date(right.startTime).getTime();

    if (left.status === "finished" && right.status === "finished") {
      return rightTime - leftTime;
    }

    return leftTime - rightTime;
  });
}

const PLAYOFF_TAG_HINTS = ["playoff", "postseason", "series"];

function isPlayoffWindow(startTime: string) {
  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) return false;
  const month = date.getUTCMonth();
  return month === 3 || month === 4 || month === 5;
}

function hasPlayoffTag(tags: string[] | undefined) {
  return Boolean(
    tags?.some((tag) =>
      PLAYOFF_TAG_HINTS.some((hint) => tag.toLowerCase().includes(hint)),
    ),
  );
}

function buildLiveHeadline(game: GameWithTeams): string {
  const homeAbbr = game.homeTeam.code;
  const awayAbbr = game.awayTeam.code;
  const score = `${awayAbbr} ${game.score.away} – ${homeAbbr} ${game.score.home}`;

  const margin = game.score.home - game.score.away;
  const leader =
    margin === 0
      ? "Tied"
      : margin > 0
        ? `${game.homeTeam.name} +${margin}`
        : `${game.awayTeam.name} +${Math.abs(margin)}`;

  const clockBits = [game.quarter, game.clock].filter(Boolean).join(" ");
  const live = clockBits ? `${clockBits} · ${score} · ${leader}` : `${score} · ${leader}`;

  const playoff = hasPlayoffTag(game.tags) || isPlayoffWindow(game.startTime);
  return playoff ? `Playoffs · ${live}` : live;
}

function buildFinishedHeadline(game: GameWithTeams): string {
  const homeAbbr = game.homeTeam.code;
  const awayAbbr = game.awayTeam.code;
  const homeWon = game.score.home > game.score.away;
  const winner = homeWon ? game.homeTeam.name : game.awayTeam.name;
  const final = `Final · ${awayAbbr} ${game.score.away} – ${homeAbbr} ${game.score.home}`;
  if (game.score.home === game.score.away) return final;
  const playoff = hasPlayoffTag(game.tags) || isPlayoffWindow(game.startTime);
  const summary = `${final} · ${winner} wins`;
  return playoff ? `Playoffs · ${summary}` : summary;
}

function buildUpcomingHeadline(game: GameWithTeams): string {
  const matchup = `${game.awayTeam.name} at ${game.homeTeam.name}`;
  const playoff = hasPlayoffTag(game.tags) || isPlayoffWindow(game.startTime);
  return playoff ? `Playoffs · ${matchup}` : matchup;
}

function buildContext(game: GameWithTeams): {
  headline: string;
  description: string;
} {
  if (game.status === "live") {
    const headline = buildLiveHeadline(game);
    const description =
      game.description && game.description.trim().length > 0
        ? game.description
        : `Live now from ${game.arena}. Score and clock update as the game plays.`;
    return { headline, description };
  }

  if (game.status === "finished") {
    const headline = buildFinishedHeadline(game);
    const description =
      game.description && game.description.trim().length > 0
        ? game.description
        : `Final from ${game.arena}.`;
    return { headline, description };
  }

  const headline = buildUpcomingHeadline(game);
  const description =
    game.description && game.description.trim().length > 0
      ? game.description
      : `Tip-off scheduled at ${game.arena}.`;
  return { headline, description };
}

function applyContextAndCleanup(game: GameWithTeams): GameWithTeams {
  const { headline, description } = buildContext(game);

  if (game.status === "finished") {
    return {
      ...game,
      headline,
      description,
      streamType: "none",
      streamUrl: null,
      hasStream: false,
      isLive: false,
      featured: false,
    };
  }

  return { ...game, headline, description };
}

function enrichGames(baseGames: Game[], overrides: StreamOverride[]) {
  const teamMap = getTeamMap();
  const overrideMap = new Map(
    overrides.map((override) => [override.gameSlug, override]),
  );

  return sortGames(
    baseGames.map((game) => {
      const homeTeam = teamMap[game.homeTeam];
      const awayTeam = teamMap[game.awayTeam];

      if (!homeTeam || !awayTeam) {
        throw new Error(`Game ${game.slug} references a missing team.`);
      }

      const override = overrideMap.get(game.slug);

      const enriched: GameWithTeams = {
        ...game,
        streamType: override?.streamType ?? game.streamType,
        streamUrl: override?.streamUrl ?? game.streamUrl,
        homeTeam,
        awayTeam,
        dateKey: toDateKey(game.startTime),
        hasStream: Boolean((override?.streamUrl ?? game.streamUrl) || false),
      };

      return applyContextAndCleanup(enriched);
    }),
  );
}

async function fetchLiveNbaGames(
  overrides: StreamOverride[],
): Promise<GameWithTeams[]> {
  try {
    const cdnGames = await fetchLiveScoreboard();
    const mapped = mapCdnGamesToGames(cdnGames);
    if (mapped.length === 0) return [];

    const overrideMap = new Map(
      overrides.map((override) => [override.gameSlug, override]),
    );

    return mapped.map((game) => {
      const override = overrideMap.get(game.slug);
      const merged = override
        ? {
            ...game,
            streamType: override.streamType,
            streamUrl: override.streamUrl,
            hasStream: Boolean(override.streamUrl),
          }
        : game;

      return applyContextAndCleanup(merged);
    });
  } catch {
    return [];
  }
}

function mergeGames(
  liveGames: GameWithTeams[],
  mockGamesEnriched: GameWithTeams[],
): GameWithTeams[] {
  if (liveGames.length > 0) return sortGames(liveGames);
  return mockGamesEnriched;
}

function attachAggregatedStreams(
  games: GameWithTeams[],
  overrideSlugs: Set<string>,
  cdnMatches: CdnLiveTvMatch[],
  streamedMatches: StreamedMatch[],
): GameWithTeams[] {
  return games.map((game) => {
    if (game.status === "finished") return game;
    if (overrideSlugs.has(game.slug)) return game;
    if (game.streamUrl) return game;

    if (cdnMatches.length > 0) {
      const channels = findChannelsForTeams(
        cdnMatches,
        game.homeTeam.name,
        game.awayTeam.name,
      );
      const cdnSources = buildSourcesForMatch(channels);
      const first = cdnSources[0];
      if (first) {
        return {
          ...game,
          streamType: "cdnlivetv",
          streamUrl: first.url,
          hasStream: true,
        };
      }
    }

    const streamedMatch = findStreamedMatch(
      streamedMatches,
      game.homeTeam.name,
      game.awayTeam.name,
    );
    if (streamedMatch) {
      return {
        ...game,
        streamType: "streamed",
        streamUrl: null,
        hasStream: true,
      };
    }

    const allStreamEast = buildSourcesForAllStreamEast(
      game.homeTeam.name,
      game.awayTeam.name,
    );
    if (allStreamEast[0]) {
      return {
        ...game,
        streamType: "allstreameast",
        streamUrl: allStreamEast[0].url,
        hasStream: true,
      };
    }

    return game;
  });
}

async function fetchCdnMatchesSafe(): Promise<CdnLiveTvMatch[]> {
  try {
    return await fetchNbaMatches();
  } catch {
    return [];
  }
}

async function fetchStreamedMatchesSafe(): Promise<StreamedMatch[]> {
  try {
    return await fetchBasketballMatches();
  } catch {
    return [];
  }
}

export async function getGames(filter: GamesFilter = {}) {
  const overrides = await readOverrides();
  const overrideSlugs = new Set(overrides.map((o) => o.gameSlug));
  const [liveGames, mockEnriched, cdnMatches, streamedMatches] =
    await Promise.all([
      fetchLiveNbaGames(overrides),
      Promise.resolve(enrichGames(mockGames, overrides)),
      fetchCdnMatchesSafe(),
      fetchStreamedMatchesSafe(),
    ]);
  let games = mergeGames(liveGames, mockEnriched);
  games = attachAggregatedStreams(
    games,
    overrideSlugs,
    cdnMatches,
    streamedMatches,
  );

  if (filter.status && filter.status !== "all") {
    games = games.filter((game) => game.status === filter.status);
  }

  if (filter.date) {
    games = games.filter((game) => game.dateKey === filter.date);
  }

  if (filter.team) {
    const normalizedTeam = filter.team.toLowerCase();
    games = games.filter(
      (game) =>
        game.homeTeam.slug === normalizedTeam ||
        game.awayTeam.slug === normalizedTeam ||
        game.homeTeam.code.toLowerCase() === normalizedTeam ||
        game.awayTeam.code.toLowerCase() === normalizedTeam,
    );
  }

  if (filter.limit) {
    games = games.slice(0, filter.limit);
  }

  return games;
}

export async function getGameBySlug(slug: string) {
  const games = await getGames();
  return games.find((game) => game.slug === slug) ?? null;
}

async function getStreamedSources(
  homeName: string,
  awayName: string,
): Promise<StreamSource[]> {
  try {
    const matches = await fetchBasketballMatches();
    const match = findStreamedMatch(matches, homeName, awayName);
    if (!match) return [];
    return await buildSourcesForStreamedMatch(match);
  } catch {
    return [];
  }
}

async function getCdnSources(
  homeName: string,
  awayName: string,
): Promise<StreamSource[]> {
  const cdnMatches = await fetchCdnMatchesSafe();
  if (cdnMatches.length === 0) return [];
  return buildSourcesForMatch(findChannelsForTeams(cdnMatches, homeName, awayName));
}

function getAllStreamEastSources(
  homeName: string,
  awayName: string,
): StreamSource[] {
  return buildSourcesForAllStreamEast(homeName, awayName).map((source) => ({
    id: source.id,
    label: source.label,
    url: source.url,
    channelName: source.channelName,
  }));
}

export async function getGameSources(slug: string): Promise<StreamSource[]> {
  const game = await getGameBySlug(slug);
  if (!game) return [];
  if (game.status === "finished") return [];

  const [cdnSources, streamedSources] = await Promise.all([
    getCdnSources(game.homeTeam.name, game.awayTeam.name),
    getStreamedSources(game.homeTeam.name, game.awayTeam.name),
  ]);
  const allStreamEast = getAllStreamEastSources(
    game.homeTeam.name,
    game.awayTeam.name,
  );

  const aggregated = [...cdnSources, ...streamedSources, ...allStreamEast];
  const seen = new Set<string>();
  return aggregated.filter((source) => {
    if (seen.has(source.url)) return false;
    seen.add(source.url);
    return true;
  });
}

export async function getTeams() {
  noStore();
  return [...teams].sort((left, right) => {
    if (left.conference !== right.conference) {
      return left.conference.localeCompare(right.conference);
    }

    return left.conferenceRank - right.conferenceRank;
  });
}

export async function getStandings() {
  noStore();
  return [...teams].sort((left, right) => {
    if (left.conference !== right.conference) {
      return left.conference.localeCompare(right.conference);
    }

    return left.conferenceRank - right.conferenceRank;
  });
}

export async function getAvailableDates() {
  const games = await getGames();
  return Array.from(new Set(games.map((game) => game.dateKey)));
}
