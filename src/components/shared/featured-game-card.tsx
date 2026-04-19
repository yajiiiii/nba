"use client";

import { CalendarRange, MapPin, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { StatusPill } from "@/components/shared/status-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatGameDate, formatGameTime } from "@/lib/formatters";
import type { GameWithTeams } from "@/lib/types";

export function FeaturedGameCard({ game }: { game: GameWithTeams }) {
  return (
    <Card className="relative overflow-hidden border-primary/20 bg-[#0d0d0d]">
      <div className="absolute inset-0">
        <Image
          src={game.thumbnail}
          alt={`${game.awayTeam.name} versus ${game.homeTeam.name}`}
          fill
          priority
          className="object-cover opacity-60"
          sizes="(max-width: 1280px) 100vw, 70vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(225,29,46,0.28),transparent_30%),linear-gradient(120deg,rgba(9,9,9,0.98),rgba(9,9,9,0.76),rgba(9,9,9,0.88))]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 grid gap-10 p-6 sm:p-8 xl:grid-cols-[minmax(0,1.2fr)_320px]"
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill game={game} />
            {game.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
              Featured NBA game
            </p>
            <h1 className="font-heading text-5xl uppercase tracking-[0.08em] text-foreground sm:text-6xl xl:text-7xl">
              {game.awayTeam.name} vs {game.homeTeam.name}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {game.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <CalendarRange className="h-4 w-4 text-primary" />
                Tipoff
              </div>
              <p className="text-lg font-semibold text-foreground">
                {formatGameDate(game.startTime)}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatGameTime(game.startTime)}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Arena
              </div>
              <p className="text-lg font-semibold text-foreground">{game.arena}</p>
              <p className="text-sm text-muted-foreground">{game.nationalTv}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-4">
              <div className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Scoreline
              </div>
              <p className="text-3xl font-black text-foreground">
                {game.status === "upcoming"
                  ? "00 - 00"
                  : `${game.score.away} - ${game.score.home}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {game.awayTeam.code} at {game.homeTeam.code}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href={`/game/${game.slug}`}>
                <PlayCircle className="mr-2 h-5 w-5" />
                Open game page
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/schedule">See full schedule</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-black/35 p-5 backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Matchup pulse
          </p>
          <div className="mt-6 space-y-5">
            <div className="rounded-[1.5rem] bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Away
              </p>
              <p className="font-heading text-4xl uppercase tracking-[0.1em] text-foreground">
                {game.awayTeam.code}
              </p>
              <p className="text-sm text-muted-foreground">
                {game.awayTeam.city} {game.awayTeam.name}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Home
              </p>
              <p className="font-heading text-4xl uppercase tracking-[0.1em] text-foreground">
                {game.homeTeam.code}
              </p>
              <p className="text-sm text-muted-foreground">
                {game.homeTeam.city} {game.homeTeam.name}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </Card>
  );
}
