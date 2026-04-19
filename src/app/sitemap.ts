import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { getGames } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await getGames();
  const routes = ["", "/schedule", "/teams", "/admin"];

  return [
    ...routes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("hourly" as const) : ("daily" as const),
      priority: route === "" ? 1 : 0.8,
    })),
    ...games.map((game) => ({
      url: `${SITE_URL}/game/${game.slug}`,
      lastModified: new Date(game.startTime),
      changeFrequency:
        game.status === "live" ? ("hourly" as const) : ("daily" as const),
      priority: game.featured ? 0.9 : 0.7,
    })),
  ];
}
