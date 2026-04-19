import type { GameStatus, StreamType } from "@/lib/types";

export const SITE_NAME = "NBA Snippets - Yaji";
export const SITE_DESCRIPTION =
  "Premium NBA-only streaming and scores experience built for legal embeds, clean game tracking, and responsive all-device viewing.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/bracket", label: "Bracket" },
  { href: "/teams", label: "Teams" },
];

export const STATUS_FILTERS: Array<{
  label: string;
  value: GameStatus | "all";
}> = [
  { label: "All Games", value: "all" },
  { label: "Live", value: "live" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Finished", value: "finished" },
];

export const STREAM_TYPE_OPTIONS: Array<{
  label: string;
  value: StreamType;
  hint: string;
}> = [
  {
    label: "No stream",
    value: "none",
    hint: "Use this when a game should show the premium unavailable placeholder.",
  },
  {
    label: "Iframe embed",
    value: "iframe",
    hint: "For a licensed provider embed URL that is already approved for iframe use.",
  },
  {
    label: "YouTube embed",
    value: "youtube",
    hint: "For an owned or officially embeddable YouTube video or channel asset.",
  },
  {
    label: "Vimeo embed",
    value: "vimeo",
    hint: "For a licensed Vimeo video that allows embedding.",
  },
  {
    label: "Owned HLS URL",
    value: "hls",
    hint: "For an HLS `.m3u8` playlist you control or are licensed to stream.",
  },
  {
    label: "Unofficial (cdnlivetv)",
    value: "cdnlivetv",
    hint: "Requires NEXT_PUBLIC_ENABLE_UNOFFICIAL_STREAMS=true. Third-party aggregator, not guaranteed legal in all jurisdictions — use at your own risk.",
  },
];

export const UNOFFICIAL_STREAMS_ENABLED = true;

export const QUERY_KEYS = {
  games: "games",
  teams: "teams",
  standings: "standings",
} as const;
