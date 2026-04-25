const BASE_URL = process.env.STREAMED_BASE_URL ?? "https://streamed.pk/api";

export const STREAMED_ENABLED = true;

type RawTeam = { name?: string; badge?: string };
type RawSource = { source?: string; id?: string };

type RawMatch = {
  id?: string;
  title?: string;
  category?: string;
  date?: number;
  poster?: string;
  popular?: boolean;
  teams?: { home?: RawTeam; away?: RawTeam };
  sources?: RawSource[];
};

type RawStream = {
  id?: string;
  streamNo?: number;
  language?: string;
  hd?: boolean;
  embedUrl?: string;
  source?: string;
  viewers?: number;
};

export type StreamedMatch = {
  id: string;
  title: string;
  homeTeam: string;
  awayTeam: string;
  sources: { source: string; id: string }[];
};

export type StreamedSource = {
  id: string;
  label: string;
  url: string;
  channelName: string;
  viewers?: number;
};

function normalizeMatch(raw: RawMatch): StreamedMatch | null {
  if (!raw.id || !raw.title) return null;
  const home = raw.teams?.home?.name ?? "";
  const away = raw.teams?.away?.name ?? "";
  const sources = (raw.sources ?? [])
    .filter((s): s is { source: string; id: string } =>
      Boolean(s?.source && s?.id),
    )
    .map((s) => ({ source: s.source, id: s.id }));
  if (sources.length === 0) return null;
  return {
    id: raw.id,
    title: raw.title,
    homeTeam: home,
    awayTeam: away,
    sources,
  };
}

export async function fetchBasketballMatches(): Promise<StreamedMatch[]> {
  if (!STREAMED_ENABLED) return [];
  try {
    const response = await fetch(`${BASE_URL}/matches/basketball`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = (await response.json()) as RawMatch[];
    return data
      .map(normalizeMatch)
      .filter((m): m is StreamedMatch => m !== null);
  } catch {
    return [];
  }
}

async function fetchStreamsForSource(
  source: string,
  id: string,
): Promise<RawStream[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/stream/${encodeURIComponent(source)}/${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );
    if (!response.ok) return [];
    return (await response.json()) as RawStream[];
  } catch {
    return [];
  }
}

function tokenize(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function teamsMatch(
  match: StreamedMatch,
  homeName: string,
  awayName: string,
): boolean {
  const home = tokenize(homeName);
  const away = tokenize(awayName);
  const mHome = tokenize(match.homeTeam);
  const mAway = tokenize(match.awayTeam);
  const overlaps = (a: string, b: string) =>
    a.length > 0 && b.length > 0 && (a.includes(b) || b.includes(a));
  const sameOrder = overlaps(mHome, home) && overlaps(mAway, away);
  const swapped = overlaps(mHome, away) && overlaps(mAway, home);
  return sameOrder || swapped;
}

export function findStreamedMatch(
  matches: StreamedMatch[],
  homeName: string,
  awayName: string,
): StreamedMatch | null {
  return matches.find((m) => teamsMatch(m, homeName, awayName)) ?? null;
}

const SOURCE_LABELS: Record<string, string> = {
  admin: "Premium",
  alpha: "Alpha",
  bravo: "Bravo",
  charlie: "Charlie",
  delta: "Delta",
  echo: "Echo",
  foxtrot: "Foxtrot",
  golf: "Golf",
};

function prettySource(source: string) {
  return SOURCE_LABELS[source] ?? source.charAt(0).toUpperCase() + source.slice(1);
}

export async function buildSourcesForStreamedMatch(
  match: StreamedMatch,
): Promise<StreamedSource[]> {
  const groups = await Promise.all(
    match.sources.map((s) => fetchStreamsForSource(s.source, s.id)),
  );
  const flat: StreamedSource[] = [];
  for (const streams of groups) {
    for (const stream of streams) {
      if (!stream.embedUrl || !stream.source) continue;
      const channelName = prettySource(stream.source);
      const langSuffix = stream.language ? ` · ${stream.language}` : "";
      const hdSuffix = stream.hd ? " HD" : "";
      flat.push({
        id: `${stream.source}:${stream.id ?? "x"}:${stream.streamNo ?? 0}`,
        label: `${channelName}${langSuffix}${hdSuffix}`,
        url: stream.embedUrl,
        channelName,
        viewers: typeof stream.viewers === "number" ? stream.viewers : undefined,
      });
    }
  }
  return flat.sort((a, b) => (b.viewers ?? 0) - (a.viewers ?? 0));
}
