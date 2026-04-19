export type Conference = "East" | "West";
export type GameStatus = "live" | "upcoming" | "finished";
export type StreamType =
  | "iframe"
  | "youtube"
  | "vimeo"
  | "hls"
  | "cdnlivetv"
  | "none";

export interface Team {
  id: string;
  slug: string;
  city: string;
  name: string;
  code: string;
  conference: Conference;
  primaryColor: string;
  secondaryColor: string;
  arena: string;
  wins: number;
  losses: number;
  conferenceRank: number;
  streak: string;
  last10: string;
  championships: number;
  description: string;
}

export interface PlayerGroup {
  starters: string[];
  bench: string[];
  out: string[];
}

export interface TeamGameStats {
  fg: string;
  threePt: string;
  rebounds: number;
  assists: number;
  turnovers: number;
  fouls: number;
  pointsInPaint: number;
  fastBreakPoints: number;
}

export interface StatLeader {
  team: "home" | "away";
  label: "PTS" | "REB" | "AST" | "3PM";
  player: string;
  value: string;
}

export interface GameStats {
  home: TeamGameStats;
  away: TeamGameStats;
  leaders: StatLeader[];
}

export interface Game {
  id: string;
  slug: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  status: GameStatus;
  score: {
    home: number;
    away: number;
  };
  arena: string;
  streamType: StreamType;
  streamUrl: string | null;
  thumbnail: string;
  isLive: boolean;
  featured?: boolean;
  quarter?: string;
  clock?: string;
  headline: string;
  description: string;
  nationalTv: string;
  tags: string[];
  lineups: {
    home: PlayerGroup;
    away: PlayerGroup;
  };
  stats: GameStats;
}

export interface GameWithTeams extends Omit<Game, "homeTeam" | "awayTeam"> {
  homeTeam: Team;
  awayTeam: Team;
  dateKey: string;
  hasStream: boolean;
}

export interface GamesFilter {
  status?: GameStatus | "all";
  date?: string;
  team?: string;
  limit?: number;
}

export interface StreamOverride {
  gameSlug: string;
  streamType: StreamType;
  streamUrl: string | null;
  note?: string;
  updatedAt: string;
}

export interface StreamInput {
  gameSlug: string;
  streamType: StreamType;
  streamUrl?: string | null;
  note?: string;
}
