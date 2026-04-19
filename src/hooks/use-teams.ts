"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchJson } from "@/lib/api-client";
import { QUERY_KEYS } from "@/lib/constants";
import type { Team } from "@/lib/types";

export function useTeamsQuery(initialData?: Team[]) {
  return useQuery({
    queryKey: [QUERY_KEYS.teams],
    queryFn: () => fetchJson<Team[]>("/api/teams"),
    initialData,
  });
}
