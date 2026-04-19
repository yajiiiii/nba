import { NextResponse } from "next/server";

import { getGameSources } from "@/lib/data";

export const revalidate = 60;

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const sources = await getGameSources(params.slug);
    return NextResponse.json({ sources });
  } catch (error) {
    return NextResponse.json(
      {
        sources: [],
        error:
          error instanceof Error ? error.message : "Failed to load sources",
      },
      { status: 502 },
    );
  }
}
