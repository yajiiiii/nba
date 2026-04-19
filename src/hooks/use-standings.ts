"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchJson } from "@/lib/api-client";
import { QUERY_KEYS } from "@/lib/constants";
import type { Team } from "@/lib/types";

export function useStandingsQuery(initialData?: Team[]) {
  return useQuery({
    queryKey: [QUERY_KEYS.standings],
    queryFn: () => fetchJson<Team[]>("/api/standings"),
    initialData,
  });
}
