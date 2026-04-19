# Redline Hoops

Premium NBA-only streaming and scores experience built with Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui patterns, TanStack Query, Lucide, and Framer Motion.

Design goals:

- No ads
- No popups
- No trackers
- Live NBA schedule and scores from the official NBA CDN (no scraping)
- Live game streams auto-attached from the cdnlivetv aggregator. Admin can still override with iframe / YouTube / Vimeo / HLS / cdnlivetv sources.

> **Note on sources:** cdnlivetv is a third-party aggregator of live TV channels. Licensing of the underlying feeds is not guaranteed and varies by jurisdiction. Operating this app in production is the operator's responsibility.

## Features

- Sticky live score ticker and responsive sticky navbar
- Premium dark sports design with bold headings and red accent system
- Home dashboard with featured game, live strip, upcoming grid, results, standings, and team shortcuts
- Game detail page with cinematic player area, stream notes, stats, lineups, chat placeholder, and related games
- Schedule page with date, status, and team filters
- Teams directory for all 30 NBA teams
- Admin placeholder flow that saves approved stream overrides to local JSON
- SEO metadata for static routes and per-game pages
- Sitemap and robots routes
- Loading, empty, and error states

## Stack

- Next.js 14.2.35
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui-style component architecture
- TanStack Query
- Framer Motion
- Lucide React
- hls.js
- ESLint + Prettier

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open `http://localhost:3000`

Optional:

```bash
# used for canonical metadata and OG URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run format
npm run format:check
```

## Admin Persistence

Admin stream saves are written to:

```text
data/admin-stream-overrides.json
```

That keeps the demo runnable locally without introducing a database. The seed `Rockets vs Lakers` game ships with a first-party demo iframe route so the player can be exercised without relying on any third-party source.

## Routes

- `/`
- `/schedule`
- `/teams`
- `/game/[slug]`
- `/admin`

API routes:

- `/api/games`
- `/api/games/[slug]`
- `/api/teams`
- `/api/standings`
- `/api/admin/streams`

## File Tree

```text
.
|-- components.json
|-- data/
|   `-- admin-stream-overrides.json
|-- public/
|   `-- thumbnails/
|       |-- bucks-heat.svg
|       |-- celtics-knicks.svg
|       |-- league-night.svg
|       |-- rockets-lakers.svg
|       `-- warriors-suns.svg
|-- src/
|   |-- app/
|   |   |-- admin/page.tsx
|   |   |-- api/admin/streams/route.ts
|   |   |-- api/games/[slug]/route.ts
|   |   |-- api/games/route.ts
|   |   |-- api/standings/route.ts
|   |   |-- api/teams/route.ts
|   |   |-- embed/demo/route.ts
|   |   |-- game/[slug]/page.tsx
|   |   |-- schedule/page.tsx
|   |   |-- teams/page.tsx
|   |   |-- globals.css
|   |   |-- icon.svg
|   |   |-- layout.tsx
|   |   |-- loading.tsx
|   |   |-- not-found.tsx
|   |   |-- page.tsx
|   |   |-- robots.ts
|   |   `-- sitemap.ts
|   |-- components/
|   |   |-- layout/
|   |   |   |-- score-ticker.tsx
|   |   |   |-- search-bar.tsx
|   |   |   |-- site-chrome.tsx
|   |   |   |-- site-footer.tsx
|   |   |   `-- site-navbar.tsx
|   |   |-- pages/
|   |   |   |-- admin-page-client.tsx
|   |   |   |-- game-page-client.tsx
|   |   |   |-- home-page-client.tsx
|   |   |   |-- schedule-page-client.tsx
|   |   |   `-- teams-page-client.tsx
|   |   |-- providers/app-providers.tsx
|   |   |-- shared/
|   |   |   |-- empty-state.tsx
|   |   |   |-- featured-game-card.tsx
|   |   |   |-- game-card.tsx
|   |   |   |-- live-badge.tsx
|   |   |   |-- schedule-list.tsx
|   |   |   |-- standings-panel.tsx
|   |   |   |-- status-pill.tsx
|   |   |   |-- team-chip.tsx
|   |   |   `-- video-player.tsx
|   |   `-- ui/
|   |       |-- badge.tsx
|   |       |-- button.tsx
|   |       |-- card.tsx
|   |       |-- input.tsx
|   |       |-- skeleton.tsx
|   |       |-- tabs.tsx
|   |       `-- textarea.tsx
|   |-- data/
|   |   |-- mock-games.ts
|   |   `-- teams.ts
|   |-- hooks/
|   |   |-- use-game.ts
|   |   |-- use-games.ts
|   |   |-- use-standings.ts
|   |   `-- use-teams.ts
|   `-- lib/
|       |-- api-client.ts
|       |-- constants.ts
|       |-- data.ts
|       |-- formatters.ts
|       |-- streams.ts
|       |-- types.ts
|       `-- utils.ts
|-- .eslintrc.json
|-- .prettierignore
|-- .prettierrc.json
|-- next.config.mjs
|-- package-lock.json
|-- package.json
|-- postcss.config.mjs
|-- tailwind.config.ts
`-- tsconfig.json
```

## Notes

- The app uses mock NBA schedule and team data only.
- The admin flow is intentionally simple and local-file based.
- HLS playback is supported through `hls.js`.
- Embeds are never scraped or transformed from third-party watch pages.

## Verification

Successfully run:

```bash
npm run lint
npm run typecheck
npm run build
```

## Security Note

`npm audit --omit=dev` still reports one high-severity advisory tied to staying on the Next.js 14 line. This repo is already on the latest available 14.x patch (`14.2.35`), but the advisory is only fully cleared by upgrading to a newer major. If strict production policy requires a clean audit, move this app to a supported newer Next.js major after confirming that the Next 14 requirement can be relaxed.
