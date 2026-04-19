import { teams } from "@/data/teams";

const byCode = new Map(teams.map((team) => [team.code.toUpperCase(), team]));
const byName = new Map(teams.map((team) => [team.name.toLowerCase(), team]));

export function resolveTeamSlugByTricode(tricode: string | undefined | null) {
  if (!tricode) return null;
  return byCode.get(tricode.toUpperCase())?.slug ?? null;
}

export function resolveTeamSlugByName(name: string | undefined | null) {
  if (!name) return null;
  return byName.get(name.toLowerCase())?.slug ?? null;
}
