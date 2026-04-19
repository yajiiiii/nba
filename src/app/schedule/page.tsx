import { SchedulePageClient } from "@/components/pages/schedule-page-client";
import { getGames } from "@/lib/data";
import type { GameStatus } from "@/lib/types";

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: {
    status?: string;
    team?: string;
    date?: string;
  };
}) {
  const games = await getGames();

  return (
    <SchedulePageClient
      initialGames={games}
      initialStatus={(searchParams.status as GameStatus | "all") ?? "all"}
      initialTeam={searchParams.team ?? ""}
      initialDate={searchParams.date ?? ""}
    />
  );
}
