import { NextResponse } from "next/server";

import { getGames } from "@/lib/data";
import type { GamesFilter } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filter: GamesFilter = {
    status: (searchParams.get("status") as GamesFilter["status"]) ?? undefined,
    date: searchParams.get("date") ?? undefined,
    team: searchParams.get("team") ?? undefined,
    limit: searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : undefined,
  };

  const games = await getGames(filter);

  return NextResponse.json(games);
}
