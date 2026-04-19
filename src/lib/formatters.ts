import {
  format,
  isToday,
  isTomorrow,
  parseISO,
  startOfToday,
} from "date-fns";

import type { GameWithTeams, Team } from "@/lib/types";

export function toDateKey(value: string) {
  return format(parseISO(value), "yyyy-MM-dd");
}

export function formatGameTime(value: string) {
  return format(parseISO(value), "h:mm a");
}

export function formatGameDate(value: string) {
  const parsed = parseISO(value);

  if (isToday(parsed)) {
    return `Today, ${format(parsed, "MMM d")}`;
  }

  if (isTomorrow(parsed)) {
    return `Tomorrow, ${format(parsed, "MMM d")}`;
  }

  return format(parsed, "EEEE, MMM d");
}

export function formatScheduleHeading(dateKey: string) {
  const parsed = parseISO(`${dateKey}T00:00:00`);

  if (isToday(parsed)) {
    return "Today";
  }

  if (isTomorrow(parsed)) {
    return "Tomorrow";
  }

  return format(parsed, "EEEE, MMMM d");
}

export function formatRecord(team: Team) {
  return `${team.wins}-${team.losses}`;
}

export function getGameMatchup(game: Pick<GameWithTeams, "awayTeam" | "homeTeam">) {
  return `${game.awayTeam.name} vs ${game.homeTeam.name}`;
}

export function getGameStatusText(
  game: Pick<GameWithTeams, "status" | "quarter" | "clock" | "startTime">,
) {
  if (game.status === "live") {
    return `${game.quarter ?? "Live"}${game.clock ? ` • ${game.clock}` : ""}`;
  }

  if (game.status === "upcoming") {
    return formatGameTime(game.startTime);
  }

  return "Final";
}

export function groupGamesByDate(games: GameWithTeams[]) {
  return games.reduce<Record<string, GameWithTeams[]>>((groups, game) => {
    groups[game.dateKey] ??= [];
    groups[game.dateKey].push(game);
    return groups;
  }, {});
}

export function getSectionTitleForGames(games: GameWithTeams[]) {
  const liveCount = games.filter((game) => game.status === "live").length;
  const upcomingCount = games.filter((game) => game.status === "upcoming").length;

  if (liveCount > 0) {
    return `${liveCount} live now`;
  }

  if (upcomingCount > 0) {
    return `${upcomingCount} games on deck`;
  }

  return "Latest finals";
}

export function isRecentFinal(game: GameWithTeams) {
  return (
    game.status === "finished" &&
    parseISO(game.startTime).getTime() >=
      startOfToday().getTime() - 1000 * 60 * 60 * 48
  );
}
