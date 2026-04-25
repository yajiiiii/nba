"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, PlayCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Source = {
  id: string;
  label: string;
  url: string;
  channelName: string;
  viewers?: number;
};

type SourcesResponse = { sources: Source[] };

export function StreamSourceSwitcher({
  slug,
  initialUrl,
  title,
}: {
  slug: string;
  initialUrl: string | null;
  title: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadKey, setLoadKey] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["game-sources", slug],
    queryFn: async () => {
      const response = await fetch(`/api/games/${slug}/sources`);
      if (!response.ok) throw new Error("Failed to load sources");
      return (await response.json()) as SourcesResponse;
    },
    staleTime: 60_000,
  });

  const sources = data?.sources ?? [];
  const fallbackSource: Source | null = initialUrl
    ? {
        id: "initial",
        label: "Primary",
        url: initialUrl,
        channelName: "Primary",
      }
    : null;
  const list: Source[] =
    sources.length > 0 ? sources : fallbackSource ? [fallbackSource] : [];
  const active = list[Math.min(activeIndex, Math.max(list.length - 1, 0))];

  useEffect(() => {
    setLoadFailed(false);
  }, [active?.url, loadKey]);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    setLoadKey((key) => key + 1);
  };

  const handleReload = () => {
    setLoadKey((key) => key + 1);
  };

  return (
    <Card className="overflow-hidden border-primary/20 bg-[#0c0c0c] shadow-glow">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Video surface
          </p>
          <p className="text-sm font-semibold text-foreground">{title}</p>
        </div>
        <Badge variant="default">{active?.channelName ?? "No source"}</Badge>
      </div>

      <div className="p-4">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black">
          {active ? (
            <iframe
              key={`${active.id}:${loadKey}`}
              ref={iframeRef}
              src={active.url}
              title={title}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              referrerPolicy="no-referrer"
              className="aspect-video w-full"
              onError={() => setLoadFailed(true)}
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
              {isLoading
                ? "Looking for live sources…"
                : "No live sources are available for this matchup yet. Check back closer to tip-off."}
            </div>
          )}
        </div>

        {loadFailed ? (
          <div className="mt-3 flex items-start gap-3 rounded-[1.25rem] border border-warning/40 bg-warning/5 px-4 py-3 text-sm text-warning">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <p>
              This source failed to load. Try another below or reload the
              current one.
            </p>
          </div>
        ) : null}

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Sources{" "}
              {isLoading ? <span>· loading…</span> : <span>· {list.length}</span>}
            </p>
            <Button variant="secondary" size="sm" onClick={handleReload}>
              Reload source
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {list.map((source, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={source.id}
                  onClick={() => handleSelect(index)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                    isActive
                      ? "border-primary bg-primary/15 text-foreground"
                      : "border-white/10 bg-white/[0.03] text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span className="font-semibold">{source.label}</span>
                  {typeof source.viewers === "number" ? (
                    <span className="text-[10px] uppercase tracking-[0.18em]">
                      {source.viewers} viewers
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-[1.25rem] border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-muted-foreground">
          <PlayCircle className="mt-0.5 h-4 w-4 text-primary" />
          <p>
            Sources are aggregated third-party channels. If one fails or is
            geo-blocked, switch to another — availability varies per matchup.
          </p>
        </div>
      </div>
    </Card>
  );
}
