"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchJson } from "@/lib/api-client";
import { QUERY_KEYS } from "@/lib/constants";
import type { GamesFilter, GameWithTeams } from "@/lib/types";
import { buildQueryString } from "@/lib/utils";

const LIVE_REFETCH_MS = 10_000;

export function useGamesQuery(
  filter: GamesFilter = {},
  initialData?: GameWithTeams[],
) {
  const isLive = filter.status === "live";
  return useQuery({
    queryKey: [QUERY_KEYS.games, filter],
    queryFn: () =>
      fetchJson<GameWithTeams[]>(
        `/api/games${buildQueryString({
          status: filter.status,
          date: filter.date,
          team: filter.team,
          limit: filter.limit,
        })}`,
      ),
    initialData,
    refetchInterval: isLive ? LIVE_REFETCH_MS : false,
    refetchIntervalInBackground: false,
  });
}
