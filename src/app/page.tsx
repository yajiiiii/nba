import { HomePageClient } from "@/components/pages/home-page-client";
import { getGames, getStandings } from "@/lib/data";

export default async function HomePage() {
  const [games, standings] = await Promise.all([getGames(), getStandings()]);

  return (
    <HomePageClient initialGames={games} initialStandings={standings} />
  );
}
