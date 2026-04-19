import { TeamsPageClient } from "@/components/pages/teams-page-client";
import { getTeams } from "@/lib/data";

export default async function TeamsPage() {
  const teams = await getTeams();

  return <TeamsPageClient initialTeams={teams} />;
}
