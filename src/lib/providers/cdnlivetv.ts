const BASE_URL =
  process.env.CDNLIVETV_BASE_URL ?? "https://api.cdnlivetv.tv/api/v1";
const USER = process.env.CDNLIVETV_USER ?? "cdnlivetv";
const PLAN = process.env.CDNLIVETV_PLAN ?? "free";

const SPORTS_URL = `${BASE_URL}/events/sports/?user=${USER}&plan=${PLAN}`;
const EMBED_URL = `${BASE_URL}/channels/embed/`;

export const CDNLIVETV_ENABLED = true;

export type CdnLiveTvChannel = {
  name: string;
  code: string;
  url?: string;
  viewers?: number;
  image?: string;
};

export type CdnLiveTvMatch = {
  gameID?: string;
  homeTeam: string;
  awayTeam: string;
  start?: string;
  status?: string;
  tournament?: string;
  channels?: CdnLiveTvChannel[];
};

type RawChannel = {
  channel_name?: string;
  channel_code?: string;
  name?: string;
  code?: string;
  url?: string;
  viewers?: string | number;
  image?: string;
};

type RawMatch = {
  gameID?: string;
  homeTeam?: string;
  awayTeam?: string;
  start?: string;
  status?: string;
  tournament?: string;
  channels?: RawChannel[];
};

type SportsResponse = Record<string, unknown>;

function normalizeChannel(raw: RawChannel): CdnLiveTvChannel | null {
  const name = raw.channel_name ?? raw.name;
  const code = raw.channel_code ?? raw.code;
  if (!name || !code) return null;

  const viewers =
    typeof raw.viewers === "string"
      ? Number.parseInt(raw.viewers, 10)
      : raw.viewers;

  return {
    name,
    code,
    url: raw.url,
    viewers: Number.isFinite(viewers) ? (viewers as number) : undefined,
    image: raw.image,
  };
}

function normalizeMatch(raw: RawMatch): CdnLiveTvMatch | null {
  if (!raw.homeTeam || !raw.awayTeam) return null;
  const channels = (raw.channels ?? [])
    .map(normalizeChannel)
    .filter((channel): channel is CdnLiveTvChannel => channel !== null);
  return {
    gameID: raw.gameID,
    homeTeam: raw.homeTeam,
    awayTeam: raw.awayTeam,
    start: raw.start,
    status: raw.status,
    tournament: raw.tournament,
    channels,
  };
}

function extractNbaMatches(data: SportsResponse): CdnLiveTvMatch[] {
  for (const value of Object.values(data)) {
    if (!value || typeof value !== "object") continue;
    const nba = (value as Record<string, unknown>).NBA;
    if (!Array.isArray(nba)) continue;
    return (nba as RawMatch[])
      .map(normalizeMatch)
      .filter((match): match is CdnLiveTvMatch => match !== null);
  }
  return [];
}

export async function fetchNbaMatches(): Promise<CdnLiveTvMatch[]> {
  if (!CDNLIVETV_ENABLED) return [];

  try {
    const response = await fetch(SPORTS_URL, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];

    const data = (await response.json()) as SportsResponse;
    return extractNbaMatches(data);
  } catch {
    return [];
  }
}

export function buildEmbedUrl(channel: Pick<CdnLiveTvChannel, "name" | "code">) {
  const params = new URLSearchParams({
    name: channel.name,
    code: channel.code,
    user: USER,
    plan: PLAN,
    autoplay: "1",
  });
  return `${EMBED_URL}?${params.toString()}`;
}

export function buildPlayerUrl(channel: Pick<CdnLiveTvChannel, "name" | "code">) {
  const params = new URLSearchParams({
    name: channel.name,
    code: channel.code,
    user: USER,
    plan: PLAN,
    embed: "true",
    autoplay: "1",
    mute: "0",
    controls: "1",
  });
  return `${BASE_URL}/channels/player/?${params.toString()}`;
}

function ensureProviderParams(url: string): string {
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("user")) parsed.searchParams.set("user", USER);
    if (!parsed.searchParams.has("plan")) parsed.searchParams.set("plan", PLAN);
    parsed.searchParams.set("embed", "true");
    parsed.searchParams.set("autoplay", "1");
    return parsed.toString();
  } catch {
    return url;
  }
}

export type StreamSource = {
  id: string;
  label: string;
  url: string;
  channelName: string;
  viewers?: number;
};

export function buildSourcesForChannel(channel: CdnLiveTvChannel): StreamSource[] {
  const sources: StreamSource[] = [];
  const seen = new Set<string>();
  const push = (variant: string, label: string, url: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    sources.push({
      id: `${channel.code}:${variant}`,
      label: `${channel.name} · ${label}`,
      url,
      channelName: channel.name,
      viewers: channel.viewers,
    });
  };

  if (channel.url) push("raw", "Primary", ensureProviderParams(channel.url));
  push("player", "Player", buildPlayerUrl(channel));
  push("embed", "Embed", buildEmbedUrl(channel));

  return sources;
}

export function buildSourcesForMatch(
  channels: CdnLiveTvChannel[],
): StreamSource[] {
  const sorted = [...channels].sort(
    (a, b) => (b.viewers ?? 0) - (a.viewers ?? 0),
  );
  return sorted.flatMap(buildSourcesForChannel);
}

export function normalizeTeamToken(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function findChannelsForTeams(
  matches: CdnLiveTvMatch[],
  homeName: string,
  awayName: string,
): CdnLiveTvChannel[] {
  const home = normalizeTeamToken(homeName);
  const away = normalizeTeamToken(awayName);

  const match = matches.find((entry) => {
    const entryHome = normalizeTeamToken(entry.homeTeam);
    const entryAway = normalizeTeamToken(entry.awayTeam);
    const hasHome = entryHome.includes(home) || home.includes(entryHome);
    const hasAway = entryAway.includes(away) || away.includes(entryAway);
    return hasHome && hasAway;
  });

  return match?.channels ?? [];
}
