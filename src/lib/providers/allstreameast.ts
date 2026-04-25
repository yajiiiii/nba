const DEFAULT_TEMPLATE = "https://allstreameast.com/nba/{away}-vs-{home}";

const URL_TEMPLATE = process.env.ALLSTREAMEAST_URL_TEMPLATE ?? DEFAULT_TEMPLATE;
const ALT_TEMPLATE =
  process.env.ALLSTREAMEAST_ALT_URL_TEMPLATE ??
  "https://allstreameast.com/nba/{home}-vs-{away}";

export const ALLSTREAMEAST_ENABLED =
  process.env.ALLSTREAMEAST_DISABLED !== "true";

export type AllStreamEastSource = {
  id: string;
  label: string;
  url: string;
  channelName: string;
};

function slugTeam(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function applyTemplate(template: string, home: string, away: string) {
  return template
    .replace(/\{home\}/g, slugTeam(home))
    .replace(/\{away\}/g, slugTeam(away));
}

export function buildSourcesForAllStreamEast(
  homeName: string,
  awayName: string,
): AllStreamEastSource[] {
  if (!ALLSTREAMEAST_ENABLED) return [];
  if (!homeName || !awayName) return [];

  const seen = new Set<string>();
  const sources: AllStreamEastSource[] = [];

  const candidates = [
    { url: applyTemplate(URL_TEMPLATE, homeName, awayName), variant: "primary" },
    { url: applyTemplate(ALT_TEMPLATE, homeName, awayName), variant: "alt" },
  ];

  for (const candidate of candidates) {
    if (!candidate.url || seen.has(candidate.url)) continue;
    seen.add(candidate.url);
    sources.push({
      id: `allstreameast:${candidate.variant}`,
      label: `AllStreamEast · ${candidate.variant === "primary" ? "Primary" : "Alt"}`,
      url: candidate.url,
      channelName: "AllStreamEast",
    });
  }

  return sources;
}
