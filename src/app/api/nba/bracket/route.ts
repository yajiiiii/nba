import { NextResponse } from "next/server";

import { fetchPlayoffBracket } from "@/lib/nba/client";

export const revalidate = 60;

export async function GET() {
  try {
    const series = await fetchPlayoffBracket();
    return NextResponse.json(
      { series },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bracket unavailable" },
      { status: 502 },
    );
  }
}
