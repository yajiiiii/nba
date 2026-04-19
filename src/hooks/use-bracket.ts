"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchJson } from "@/lib/api-client";
import type { PlayoffSeries } from "@/lib/nba/client";

const BRACKET_REFETCH_MS = 60_000;

type BracketResponse = { series: PlayoffSeries[] };

export function useBracketQuery(initialData?: PlayoffSeries[]) {
  return useQuery({
    queryKey: ["bracket"],
    queryFn: async () => {
      const res = await fetchJson<BracketResponse>("/api/nba/bracket");
      return res.series ?? [];
    },
    initialData,
    refetchInterval: BRACKET_REFETCH_MS,
    refetchIntervalInBackground: false,
  });
}
