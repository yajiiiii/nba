import type { StreamInput, StreamType } from "@/lib/types";

const YOUTUBE_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtube-nocookie.com",
]);

const VIMEO_HOSTS = new Set([
  "vimeo.com",
  "www.vimeo.com",
  "player.vimeo.com",
]);

function normalizeRelativeUrl(rawUrl: string) {
  if (rawUrl.startsWith("/")) {
    return rawUrl;
  }

  return null;
}

function ensureHttps(url: URL) {
  return url.protocol === "https:";
}

function getYoutubeId(url: URL) {
  if (url.hostname === "youtu.be") {
    return url.pathname.replace("/", "");
  }

  if (url.pathname.startsWith("/embed/")) {
    return url.pathname.split("/embed/")[1];
  }

  return url.searchParams.get("v") ?? "";
}

function getVimeoId(url: URL) {
  if (url.pathname.startsWith("/video/")) {
    return url.pathname.split("/video/")[1];
  }

  return url.pathname.replace(/\//g, "");
}

export function getStreamTypeLabel(streamType: StreamType) {
  switch (streamType) {
    case "iframe":
      return "Licensed embed";
    case "youtube":
      return "YouTube embed";
    case "vimeo":
      return "Vimeo embed";
    case "hls":
      return "Owned HLS feed";
    case "cdnlivetv":
      return "Unofficial (cdnlivetv)";
    default:
      return "Unavailable";
  }
}

export function normalizeStreamUrl(
  streamType: StreamType,
  rawUrl?: string | null,
) {
  if (streamType === "none") {
    return null;
  }

  if (!rawUrl) {
    return null;
  }

  const trimmed = rawUrl.trim();
  const relativeUrl = normalizeRelativeUrl(trimmed);

  if (relativeUrl && streamType === "iframe") {
    return relativeUrl;
  }

  const url = new URL(trimmed);

  if (!ensureHttps(url)) {
    throw new Error("Only HTTPS stream URLs are supported.");
  }

  if (streamType === "hls") {
    if (!/\.m3u8($|\?)/i.test(url.toString())) {
      throw new Error("HLS sources must point to an `.m3u8` playlist.");
    }

    return url.toString();
  }

  if (streamType === "cdnlivetv") {
    if (!/cdnlivetv\.tv/i.test(url.hostname)) {
      throw new Error("cdnlivetv URLs must be on cdnlivetv.tv.");
    }
    return url.toString();
  }

  if (streamType === "youtube") {
    if (!YOUTUBE_HOSTS.has(url.hostname)) {
      throw new Error("Use a valid YouTube URL or embed URL.");
    }

    const videoId = getYoutubeId(url);

    if (!videoId) {
      throw new Error("The YouTube video ID could not be detected.");
    }

    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (streamType === "vimeo") {
    if (!VIMEO_HOSTS.has(url.hostname)) {
      throw new Error("Use a valid Vimeo URL or player embed URL.");
    }

    const videoId = getVimeoId(url);

    if (!videoId) {
      throw new Error("The Vimeo video ID could not be detected.");
    }

    return `https://player.vimeo.com/video/${videoId}`;
  }

  return url.toString();
}

export function validateStreamInput(input: StreamInput) {
  if (!input.gameSlug) {
    throw new Error("A game must be selected before saving a stream.");
  }

  if (input.streamType === "none") {
    return {
      streamType: "none" as const,
      streamUrl: null,
      note: input.note?.trim() || undefined,
    };
  }

  if (!input.streamUrl?.trim()) {
    throw new Error("A stream URL is required for the selected stream type.");
  }

  return {
    streamType: input.streamType,
    streamUrl: normalizeStreamUrl(input.streamType, input.streamUrl),
    note: input.note?.trim() || undefined,
  };
}
