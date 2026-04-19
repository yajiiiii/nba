import { Bracket } from "@/components/shared/bracket";
import { EmptyState } from "@/components/shared/empty-state";
import { PlayoffScheduleList } from "@/components/shared/playoff-schedule-list";
import { fetchPlayoffUpcomingGames } from "@/lib/nba/client";

export const revalidate = 60;

export default async function BracketPage() {
  const upcoming = await fetchPlayoffUpcomingGames().catch(() => []);

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Postseason center
        </p>
        <h1 className="font-heading text-5xl uppercase tracking-[0.08em] text-foreground sm:text-6xl">
          Playoff Bracket
        </h1>
        <p className="max-w-3xl text-base text-muted-foreground">
          Live 2026 NBA playoff bracket built from the official league schedule,
          plus every upcoming postseason game on the calendar.
        </p>
      </section>

      <section>
        <Bracket />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Coming up
            </p>
            <h2 className="font-heading text-4xl uppercase tracking-[0.08em] text-foreground">
              Future Playoff Games
            </h2>
          </div>
        </div>
        {upcoming.length > 0 ? (
          <PlayoffScheduleList games={upcoming} />
        ) : (
          <EmptyState
            title="No upcoming playoff games"
            description="The 2026 playoff schedule has no games left to play, or the NBA feed is temporarily unavailable."
          />
        )}
      </section>
    </div>
  );
}
