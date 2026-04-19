import Link from "next/link";

import { TeamLogo } from "@/components/shared/team-logo";
import { Card, CardContent } from "@/components/ui/card";
import { formatRecord } from "@/lib/formatters";
import type { Team } from "@/lib/types";

export function TeamChip({
  team,
  href = `/schedule?team=${team.slug}`,
}: {
  team: Team;
  href?: string;
}) {
  return (
    <Link href={href} className="block focus-visible:outline-none">
      <Card className="h-full transition hover:border-primary/30 hover:bg-surface-elevated/80">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.04] p-1.5">
            <TeamLogo slug={team.slug} code={team.code} size={36} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">
              {team.city} {team.name}
            </p>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {team.conference} #{team.conferenceRank} • {formatRecord(team)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
