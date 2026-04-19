import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GamePageClient } from "@/components/pages/game-page-client";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getGameBySlug, getGames } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const game = await getGameBySlug(params.slug);

  if (!game) {
    return {
      title: "Game not found",
    };
  }

  const title = `${game.awayTeam.name} vs ${game.homeTeam.name}`;
  const description = `${game.description} Watch approved embeds and follow mock NBA stats, lineups, and score state on ${SITE_NAME}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/game/${game.slug}`,
      images: [
        {
          url: absoluteUrl(game.thumbnail),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(game.thumbnail)],
    },
  };
}

export async function generateStaticParams() {
  const games = await getGames();
  return games.map((game) => ({ slug: game.slug }));
}

export default async function GamePage({
  params,
}: {
  params: { slug: string };
}) {
  const [game, games] = await Promise.all([
    getGameBySlug(params.slug),
    getGames(),
  ]);

  if (!game) {
    notFound();
  }

  return (
    <GamePageClient slug={params.slug} initialGame={game} initialGames={games} />
  );
}
