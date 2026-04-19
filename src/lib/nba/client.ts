const CDN_BASE = "https://cdn.nba.com";
const STATS_BASE = "https://stats.nba.com";

const STATS_HEADERS: HeadersInit = {
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  Origin: "https://www.nba.com",
  Referer: "https://www.nba.com/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "x-nba-stats-origin": "stats",
  "x-nba-stats-token": "true",
};

type CdnScoreboardResponse = {
  scoreboard?: {
    gameDate?: string;
    games?: CdnGame[];
  };
};

export type CdnGame = {
  gameId: string;
  gameCode: string;
  gameStatus: 1 | 2 | 3;
  gameStatusText: string;
  period: number;
  gameClock: string;
  gameTimeUTC: string;
  gameEt: string;
  homeTeam: CdnTeam;
  awayTeam: CdnTeam;
  natlTvBroadcasters?: { broadcasterDisplay: string }[];
};

export type CdnTeam = {
  teamId: number;
  teamName: string;
  teamCity: string;
  teamTricode: string;
  wins: number;
  losses: number;
  score: number;
  periods?: { period: number; score: number }[];
};

export async function fetchLiveScoreboard(signal?: AbortSignal): Promise<CdnGame[]> {
  const url = `${CDN_BASE}/static/json/liveData/scoreboard/todaysScoreboard_00.json`;
  const response = await fetch(url, { signal, cache: "no-store" });

  if (!response.ok) {
    throw new Error(`NBA CDN scoreboard failed: ${response.status}`);
  }

  const data = (await response.json()) as CdnScoreboardResponse;
  return data.scoreboard?.games ?? [];
}

type ScoreboardV3Response = {
  scoreboard?: {
    games?: StatsGame[];
  };
};

export type StatsGame = {
  gameId: string;
  gameStatus: number;
  gameStatusText: string;
  gameTimeUTC: string;
  gameEt: string;
  period: number;
  gameClock: string;
  homeTeam: StatsTeam;
  awayTeam: StatsTeam;
  arena?: { arenaName?: string; arenaCity?: string };
  broadcasters?: { nationalBroadcasters?: { broadcasterDisplay: string }[] };
};

export type StatsTeam = {
  teamId: number;
  teamName: string;
  teamCity: string;
  teamTricode: string;
  wins: number;
  losses: number;
  score: number;
};

export async function fetchScheduleByDate(
  gameDate: string,
  signal?: AbortSignal,
): Promise<StatsGame[]> {
  const params = new URLSearchParams({
    GameDate: gameDate,
    LeagueID: "00",
  });
  const url = `${STATS_BASE}/stats/scoreboardv3?${params.toString()}`;

  const response = await fetch(url, {
    signal,
    headers: STATS_HEADERS,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`NBA stats scoreboardv3 failed: ${response.status}`);
  }

  const data = (await response.json()) as ScoreboardV3Response;
  return data.scoreboard?.games ?? [];
}

type PlayerCareerResponse = {
  resultSets?: Array<{
    name: string;
    headers: string[];
    rowSet: Array<Array<string | number | null>>;
  }>;
};

export type PlayerCareerRow = Record<string, string | number | null>;

export async function fetchPlayerCareerStats(
  playerId: string,
  signal?: AbortSignal,
): Promise<{ regularSeason: PlayerCareerRow[]; career: PlayerCareerRow[] }> {
  const params = new URLSearchParams({
    PerMode: "PerGame",
    PlayerID: playerId,
    LeagueID: "00",
  });
  const url = `${STATS_BASE}/stats/playercareerstats?${params.toString()}`;

  const response = await fetch(url, {
    signal,
    headers: STATS_HEADERS,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`NBA stats playercareerstats failed: ${response.status}`);
  }

  const data = (await response.json()) as PlayerCareerResponse;
  const toRows = (name: string) => {
    const set = data.resultSets?.find((entry) => entry.name === name);
    if (!set) return [];
    return set.rowSet.map((row) => {
      const obj: PlayerCareerRow = {};
      set.headers.forEach((header, index) => {
        obj[header] = row[index] ?? null;
      });
      return obj;
    });
  };

  return {
    regularSeason: toRows("SeasonTotalsRegularSeason"),
    career: toRows("CareerTotalsRegularSeason"),
  };
}

export type PlayoffSeriesTeam = {
  seed: number;
  teamId: number;
  teamTricode: string;
  teamShortName: string;
  teamFullName: string;
  seriesWin: number;
};

export type PlayoffSeries = {
  seriesId: string;
  roundNumber: number;
  conference: "East" | "West" | "Final";
  summaryStatusText: string;
  seriesText?: string;
  topRow?: string;
  bottomRow?: string;
  topTeam: PlayoffSeriesTeam | null;
  bottomTeam: PlayoffSeriesTeam | null;
  winner: "top" | "bottom" | null;
};

type ScheduleTeam = {
  teamId: number;
  teamTricode: string;
  teamName: string;
  teamCity: string;
  teamSlug?: string;
  wins: number;
  losses: number;
  score: number;
  seed: number;
};

export type ScheduleGame = {
  gameId: string;
  gameStatus: number;
  gameStatusText: string;
  gameDateTimeUTC: string;
  seriesGameNumber: string;
  gameLabel: string;
  gameSubLabel: string;
  seriesText: string;
  ifNecessary: string;
  homeTeam: ScheduleTeam;
  awayTeam: ScheduleTeam;
  arenaName?: string;
};

type ScheduleResponse = {
  leagueSchedule?: {
    gameDates?: Array<{ gameDate: string; games: ScheduleGame[] }>;
  };
};

async function fetchScheduleLeague(signal?: AbortSignal): Promise<ScheduleGame[]> {
  const url = `${CDN_BASE}/static/json/staticData/scheduleLeagueV2.json`;
  const response = await fetch(url, { signal, cache: "no-store" });
  if (!response.ok) {
    throw new Error(`NBA scheduleLeagueV2 failed: ${response.status}`);
  }
  const data = (await response.json()) as ScheduleResponse;
  const games: ScheduleGame[] = [];
  for (const gd of data.leagueSchedule?.gameDates ?? []) {
    for (const g of gd.games ?? []) games.push(g);
  }
  return games;
}

function isPlayoffRoundGame(g: ScheduleGame): boolean {
  const label = g.gameLabel ?? "";
  return /^(East |West )?(First Round|Conference Semifinal|Conf(\.|erence) Semifinal|Conference Finals|Conf(\.|erence) Finals)$|^NBA Finals$/i.test(
    label,
  );
}

function roundNumberFromLabel(label: string): number {
  if (/NBA Finals/i.test(label)) return 4;
  if (/Conf(\.|erence)?\s*Finals/i.test(label)) return 3;
  if (/Semifinal/i.test(label)) return 2;
  if (/First Round/i.test(label)) return 1;
  return 0;
}

function conferenceFromLabel(label: string): "East" | "West" | "Final" {
  if (/NBA Finals/i.test(label)) return "Final";
  if (/^East/i.test(label)) return "East";
  if (/^West/i.test(label)) return "West";
  return "Final";
}

function seriesKey(g: ScheduleGame, round: number, conf: string): string {
  const a = g.homeTeam.teamId;
  const b = g.awayTeam.teamId;
  const [lo, hi] = a < b ? [a, b] : [b, a];
  return `${round}|${conf}|${lo}-${hi}`;
}

function toSeriesTeam(t: ScheduleTeam, seriesWins: number): PlayoffSeriesTeam {
  return {
    seed: t.seed ?? 0,
    teamId: t.teamId,
    teamTricode: t.teamTricode,
    teamShortName: t.teamName,
    teamFullName: `${t.teamCity} ${t.teamName}`.trim(),
    seriesWin: seriesWins,
  };
}

export async function fetchPlayoffBracket(
  signal?: AbortSignal,
): Promise<PlayoffSeries[]> {
  const games = await fetchScheduleLeague(signal);
  const playoffGames = games.filter(isPlayoffRoundGame);

  type Accum = {
    round: number;
    conf: "East" | "West" | "Final";
    topTeam: ScheduleTeam;
    bottomTeam: ScheduleTeam;
    topWins: number;
    bottomWins: number;
    latestStatus: string;
    seriesText: string;
    latestGameTime: string;
  };

  const byKey = new Map<string, Accum>();

  for (const g of playoffGames) {
    const label = g.gameLabel;
    const round = roundNumberFromLabel(label);
    const conf = conferenceFromLabel(label);
    const key = seriesKey(g, round, conf);

    let acc = byKey.get(key);
    if (!acc) {
      const [first, second] =
        g.homeTeam.teamId < g.awayTeam.teamId
          ? [g.homeTeam, g.awayTeam]
          : [g.awayTeam, g.homeTeam];
      acc = {
        round,
        conf,
        topTeam: first,
        bottomTeam: second,
        topWins: 0,
        bottomWins: 0,
        latestStatus: "",
        seriesText: g.seriesText ?? "",
        latestGameTime: g.gameDateTimeUTC,
      };
      byKey.set(key, acc);
    }

    if (g.gameStatus === 3) {
      const home = g.homeTeam;
      const away = g.awayTeam;
      const homeWon = home.score > away.score;
      const winnerId = homeWon ? home.teamId : away.teamId;
      if (winnerId === acc.topTeam.teamId) acc.topWins++;
      else if (winnerId === acc.bottomTeam.teamId) acc.bottomWins++;
    }

    if (g.gameDateTimeUTC >= acc.latestGameTime) {
      acc.latestGameTime = g.gameDateTimeUTC;
      acc.seriesText = g.seriesText || acc.seriesText;
      acc.latestStatus = g.gameStatusText ?? acc.latestStatus;
    }
  }

  const out: PlayoffSeries[] = [];
  byKey.forEach((acc, key) => {
    const winner: "top" | "bottom" | null =
      acc.topWins >= 4 ? "top" : acc.bottomWins >= 4 ? "bottom" : null;

    out.push({
      seriesId: key,
      roundNumber: acc.round,
      conference: acc.conf,
      summaryStatusText: winner
        ? `${winner === "top" ? acc.topTeam.teamTricode : acc.bottomTeam.teamTricode} wins`
        : acc.seriesText,
      seriesText: `Round ${acc.round}`,
      topTeam: toSeriesTeam(acc.topTeam, acc.topWins),
      bottomTeam: toSeriesTeam(acc.bottomTeam, acc.bottomWins),
      winner,
    });
  });

  out.sort((a, b) => {
    if (a.roundNumber !== b.roundNumber) return a.roundNumber - b.roundNumber;
    const confRank = (c: string) => (c === "East" ? 0 : c === "West" ? 1 : 2);
    return confRank(a.conference) - confRank(b.conference);
  });

  return out;
}

export async function fetchPlayoffUpcomingGames(
  signal?: AbortSignal,
): Promise<ScheduleGame[]> {
  const games = await fetchScheduleLeague(signal);
  return games
    .filter(isPlayoffRoundGame)
    .filter((g) => g.gameStatus !== 3)
    .sort(
      (a, b) =>
        new Date(a.gameDateTimeUTC).getTime() -
        new Date(b.gameDateTimeUTC).getTime(),
    );
}

