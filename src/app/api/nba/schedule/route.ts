import { NextResponse } from "next/server";

import { fetchScheduleByDate } from "@/lib/nba/client";

export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "`date` query param must be YYYY-MM-DD" },
      { status: 400 },
    );
  }

  try {
    const games = await fetchScheduleByDate(date);
    return NextResponse.json(games, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Schedule unavailable" },
      { status: 502 },
    );
  }
}
