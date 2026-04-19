import { NextResponse } from "next/server";

import { getGameBySlug } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const game = await getGameBySlug(params.slug);

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json(game);
}
