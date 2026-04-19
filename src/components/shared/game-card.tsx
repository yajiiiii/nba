"use client";

import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { StatusPill } from "@/components/shared/status-pill";
import { TeamLogo } from "@/components/shared/team-logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatGameDate, formatGameTime } from "@/lib/formatters";
import type { GameWithTeams } from "@/lib/types";
import { cn } from "@/lib/utils";

export function GameCard({
  game,
  compact = false,
}: {
  game: GameWithTeams;
  compact?: boolean;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.22 }}>
      <Link href={`/game/${game.slug}`} className="block focus-visible:outline-none">
        <Card
          className={cn(
            "group overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-glow focus-within:border-primary/40",
            game.status === "live" && "border-primary/30 shadow-live",
          )}
        >
          <div className={cn("relative", compact ? "aspect-[16/10]" : "aspect-[16/9]")}>
            <Image
              src={game.thumbnail}
              alt={`${game.awayTeam.name} versus ${game.homeTeam.name}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes={compact ? "(max-width: 768px) 100vw, 40vw" : "(max-width: 768px) 100vw, 33vw"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/55 to-transparent" />
            <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
              <StatusPill game={game} />
              <Badge variant="muted">{game.nationalTv}</Badge>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {formatGameDate(game.startTime)}
                </p>
                <div className="mt-1 flex items-center gap-3">
                  <TeamLogo slug={game.awayTeam.slug} code={game.awayTeam.code} size={36} />
                  <h3 className="font-heading text-3xl uppercase tracking-[0.08em] text-foreground sm:text-4xl">
                    {game.awayTeam.code} vs {game.homeTeam.code}
                  </h3>
                  <TeamLogo slug={game.homeTeam.slug} code={game.homeTeam.code} size={36} />
                </div>
              </div>
              <div className="rounded-full border border-white/10 bg-black/40 p-3 text-foreground">
                {game.hasStream ? (
                  <PlayCircle className="h-5 w-5" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}
              </div>
            </div>
          </div>
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    {game.awayTeam.city} {game.awayTeam.name}
                  </span>
                  <span className="text-xl font-black text-foreground">
                    {game.status === "upcoming" ? "00" : game.score.away}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    {game.homeTeam.city} {game.homeTeam.name}
                  </span>
                  <span className="text-xl font-black text-foreground">
                    {game.status === "upcoming" ? "00" : game.score.home}
                  </span>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>{game.arena}</p>
                <p>{formatGameTime(game.startTime)}</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{game.headline}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
