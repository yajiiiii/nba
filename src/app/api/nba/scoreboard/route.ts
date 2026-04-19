import { NextResponse } from "next/server";

import { fetchLiveScoreboard } from "@/lib/nba/client";
import { mapCdnGamesToGames } from "@/lib/nba/map";

export const revalidate = 5;

export async function GET() {
  try {
    const cdnGames = await fetchLiveScoreboard();
    const games = mapCdnGamesToGames(cdnGames);
    return NextResponse.json(games, {
      headers: {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=15",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Scoreboard unavailable" },
      { status: 502 },
    );
  }
}
