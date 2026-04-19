import { Badge } from "@/components/ui/badge";
import { getGameStatusText } from "@/lib/formatters";
import type { GameWithTeams } from "@/lib/types";

import { LiveBadge } from "@/components/shared/live-badge";

export function StatusPill({ game }: { game: GameWithTeams }) {
  if (game.status === "live") {
    return <LiveBadge />;
  }

  return (
    <Badge variant={game.status === "finished" ? "muted" : "warning"}>
      {getGameStatusText(game)}
    </Badge>
  );
}
