import { NextResponse } from "next/server";

import { fetchPlayerCareerStats } from "@/lib/nba/client";

export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  if (!/^\d+$/.test(params.id)) {
    return NextResponse.json({ error: "Player id must be numeric" }, { status: 400 });
  }

  try {
    const data = await fetchPlayerCareerStats(params.id);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Player stats unavailable" },
      { status: 502 },
    );
  }
}
