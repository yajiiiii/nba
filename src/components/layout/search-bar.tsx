"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import type { GameWithTeams, Team } from "@/lib/types";

type SearchResult =
  | {
      type: "game";
      id: string;
      label: string;
      description: string;
      href: string;
    }
  | {
      type: "team";
      id: string;
      label: string;
      description: string;
      href: string;
    };

function normalizeQuery(query: string) {
  return query.trim().toLowerCase();
}

export function SearchBar({
  games,
  teams,
}: {
  games: GameWithTeams[];
  teams: Team[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const normalizedQuery = normalizeQuery(query);
  const gameMatches: SearchResult[] = normalizedQuery
    ? games
        .filter((game) => {
          const matchup = `${game.awayTeam.name} ${game.homeTeam.name}`.toLowerCase();
          const teamsText = `${game.awayTeam.city} ${game.awayTeam.code} ${game.homeTeam.city} ${game.homeTeam.code}`.toLowerCase();
          return matchup.includes(normalizedQuery) || teamsText.includes(normalizedQuery);
        })
        .slice(0, 4)
        .map((game) => ({
          type: "game" as const,
          id: game.slug,
          label: `${game.awayTeam.name} vs ${game.homeTeam.name}`,
          description: game.status === "live" ? "Live game" : game.arena,
          href: `/game/${game.slug}`,
        }))
    : [];

  const teamMatches: SearchResult[] = normalizedQuery
    ? teams
        .filter((team) => {
          const name = `${team.city} ${team.name} ${team.code}`.toLowerCase();
          return name.includes(normalizedQuery);
        })
        .slice(0, 4)
        .map((team) => ({
          type: "team" as const,
          id: team.slug,
          label: `${team.city} ${team.name}`,
          description: `${team.conference} • ${team.wins}-${team.losses}`,
          href: `/schedule?team=${team.slug}`,
        }))
    : [];

  const results = [...gameMatches, ...teamMatches].slice(0, 6);

  return (
    <div className="relative w-full max-w-xl">
      <label className="sr-only" htmlFor="site-search">
        Search NBA games or teams
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="site-search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setIsOpen(false), 120);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && results[0]) {
            router.push(results[0].href);
            setIsOpen(false);
          }
        }}
        placeholder="Search teams, matchups, or game pages"
        className="pl-11"
        aria-label="Search teams or games"
      />

      {isOpen && results.length > 0 ? (
        <div className="absolute top-[calc(100%+0.5rem)] z-50 w-full rounded-[1.5rem] border border-border bg-[#0b0b0b]/95 p-2 shadow-2xl backdrop-blur-xl">
          {results.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              href={result.href}
              className="flex items-center justify-between rounded-[1rem] px-3 py-3 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {result.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {result.description}
                </p>
              </div>
              <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {result.type}
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
