"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchJson } from "@/lib/api-client";
import { QUERY_KEYS } from "@/lib/constants";
import type { GameWithTeams } from "@/lib/types";

export function useGameQuery(slug: string, initialData?: GameWithTeams | null) {
  return useQuery({
    queryKey: [QUERY_KEYS.games, slug],
    queryFn: () => fetchJson<GameWithTeams>(`/api/games/${slug}`),
    initialData: initialData ?? undefined,
    enabled: Boolean(slug),
  });
}
