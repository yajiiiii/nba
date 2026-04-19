"use client";

import Hls from "hls.js";
import { AlertCircle, PlayCircle } from "lucide-react";
import { useEffect, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getStreamTypeLabel } from "@/lib/streams";
import type { StreamType } from "@/lib/types";

function UnavailablePlaceholder() {
  return (
    <div className="flex aspect-video items-center justify-center rounded-[1.75rem] border border-dashed border-white/10 bg-[radial-gradient(circle_at_top,rgba(225,29,46,0.18),transparent_35%),linear-gradient(160deg,#101010,#080808)]">
      <div className="space-y-4 px-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <AlertCircle className="h-7 w-7 text-primary" />
        </div>
        <div className="space-y-2">
          <p className="font-heading text-4xl uppercase tracking-[0.08em] text-foreground">
            No feed right now
          </p>
          <p className="max-w-xl text-sm text-muted-foreground">
            No live channel is listed for this matchup yet. Check back closer to
            tip-off, or refresh once the game starts.
          </p>
        </div>
      </div>
    </div>
  );
}

export function VideoPlayer({
  streamType,
  streamUrl,
  title,
}: {
  streamType: StreamType;
  streamUrl: string | null;
  title: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (streamType !== "hls" || !streamUrl || !videoRef.current) {
      return;
    }

    const video = videoRef.current;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      return;
    }

    if (!Hls.isSupported()) {
      return;
    }

    const hls = new Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(video);

    return () => {
      hls.destroy();
    };
  }, [streamType, streamUrl]);

  const isEmbed =
    streamType === "iframe" ||
    streamType === "youtube" ||
    streamType === "vimeo" ||
    streamType === "cdnlivetv";

  return (
    <Card className="overflow-hidden border-primary/20 bg-[#0c0c0c] shadow-glow">
      <div className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Video surface
          </p>
          <p className="text-sm font-semibold text-foreground">{title}</p>
        </div>
        <Badge variant={streamType === "none" ? "muted" : "default"}>
          {getStreamTypeLabel(streamType)}
        </Badge>
      </div>

      <div className="p-4">
        {streamType === "none" || !streamUrl ? <UnavailablePlaceholder /> : null}

        {isEmbed && streamUrl ? (
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black">
            <iframe
              src={streamUrl}
              title={title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full"
            />
          </div>
        ) : null}

        {streamType === "hls" && streamUrl ? (
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black">
            <video
              ref={videoRef}
              controls
              playsInline
              className="aspect-video w-full"
              aria-label={`${title} video stream`}
            />
          </div>
        ) : null}

        {streamType !== "none" && streamUrl ? (
          <div className="mt-4 flex items-start gap-3 rounded-[1.25rem] border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-muted-foreground">
            <PlayCircle className="mt-0.5 h-4 w-4 text-primary" />
            <p>
              Stream sourced from third-party channels. Quality and availability
              vary per matchup.
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
