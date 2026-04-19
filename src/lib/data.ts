import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { unstable_noStore as noStore } from "next/cache";

import { mockGames } from "@/data/mock-games";
import { teams } from "@/data/teams";
import { toDateKey } from "@/lib/formatters";
import { fetchLiveScoreboard } from "@/lib/nba/client";
import { mapCdnGamesToGames } from "@/lib/nba/map";
import {
  buildSourcesForMatch,
  fetchNbaMatches,
  findChannelsForTeams,
  type CdnLiveTvMatch,
  type StreamSource,
} from "@/lib/providers/cdnlivetv";
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

      return {
        ...game,
        streamType: override?.streamType ?? game.streamType,
        streamUrl: override?.streamUrl ?? game.streamUrl,
        homeTeam,
        awayTeam,
        dateKey: toDateKey(game.startTime),
        hasStream: Boolean((override?.streamUrl ?? game.streamUrl) || false),
      } satisfies GameWithTeams;
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
      if (!override) return game;
      return {
        ...game,
        streamType: override.streamType,
        streamUrl: override.streamUrl,
        hasStream: Boolean(override.streamUrl),
      };
    });
  } catch {
    return [];
  }
}

function mergeGames(
  liveGames: GameWithTeams[],
  mockGamesEnriched: GameWithTeams[],
): GameWithTeams[] {
  if (liveGames.length === 0) return mockGamesEnriched;

  const seen = new Set(liveGames.map((game) => game.slug));
  const merged = [...liveGames];
  for (const mock of mockGamesEnriched) {
    if (!seen.has(mock.slug)) merged.push(mock);
  }
  return sortGames(merged);
}

function attachCdnStreams(
  games: GameWithTeams[],
  overrideSlugs: Set<string>,
  cdnMatches: CdnLiveTvMatch[],
): GameWithTeams[] {
  if (cdnMatches.length === 0) return games;

  return games.map((game) => {
    if (overrideSlugs.has(game.slug)) return game;
    if (game.streamUrl) return game;

    const channels = findChannelsForTeams(
      cdnMatches,
      game.homeTeam.name,
      game.awayTeam.name,
    );
    const sources = buildSourcesForMatch(channels);
    const first = sources[0];
    if (!first) return game;

    return {
      ...game,
      streamType: "cdnlivetv",
      streamUrl: first.url,
      hasStream: true,
    };
  });
}

async function fetchCdnMatchesSafe(): Promise<CdnLiveTvMatch[]> {
  try {
    return await fetchNbaMatches();
  } catch {
    return [];
  }
}

export async function getGames(filter: GamesFilter = {}) {
  const overrides = await readOverrides();
  const overrideSlugs = new Set(overrides.map((o) => o.gameSlug));
  const [liveGames, mockEnriched, cdnMatches] = await Promise.all([
    fetchLiveNbaGames(overrides),
    Promise.resolve(enrichGames(mockGames, overrides)),
    fetchCdnMatchesSafe(),
  ]);
  let games = mergeGames(liveGames, mockEnriched);
  games = attachCdnStreams(games, overrideSlugs, cdnMatches);

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

export async function getGameSources(slug: string): Promise<StreamSource[]> {
  const game = await getGameBySlug(slug);
  if (!game) return [];

  const cdnMatches = await fetchCdnMatchesSafe();
  if (cdnMatches.length === 0) return [];

  const channels = findChannelsForTeams(
    cdnMatches,
    game.homeTeam.name,
    game.awayTeam.name,
  );
  return buildSourcesForMatch(channels);
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

