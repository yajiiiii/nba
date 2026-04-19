"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { StatusPill } from "@/components/shared/status-pill";
import { formatGameDate, formatGameTime, formatScheduleHeading } from "@/lib/formatters";
import type { GameWithTeams } from "@/lib/types";
import { groupGamesByDate } from "@/lib/formatters";

export function ScheduleList({ games }: { games: GameWithTeams[] }) {
  const groupedGames = groupGamesByDate(games);
  const dates = Object.keys(groupedGames).sort();

  return (
    <div className="space-y-8">
      {dates.map((dateKey) => (
        <section key={dateKey} className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {dateKey}
              </p>
              <h2 className="font-heading text-4xl uppercase tracking-[0.08em] text-foreground">
                {formatScheduleHeading(dateKey)}
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {groupedGames[dateKey].map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.22 }}
              >
                <Link
                  href={`/game/${game.slug}${game.status === "live" ? "#watch" : ""}`}
                  className="grid gap-4 rounded-[1.5rem] border border-border bg-surface/90 p-4 transition hover:border-primary/30 hover:bg-surface-elevated md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-center"
                >
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {formatGameDate(game.startTime)}
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {formatGameTime(game.startTime)}
                    </p>
                    <StatusPill game={game} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-foreground">
                        {game.awayTeam.city} {game.awayTeam.name}
                      </p>
                      <span className="text-xl font-black text-foreground">
                        {game.status === "upcoming" ? "00" : game.score.away}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-foreground">
                        {game.homeTeam.city} {game.homeTeam.name}
                      </p>
                      <span className="text-xl font-black text-foreground">
                        {game.status === "upcoming" ? "00" : game.score.home}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-left text-sm text-muted-foreground md:text-right">
                    <p>{game.arena}</p>
                    <p>{game.nationalTv}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
