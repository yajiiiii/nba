import type { Game, PlayerGroup, TeamGameStats } from "@/lib/types";

const lineup = (
  starters: string[],
  bench: string[],
  out: string[] = [],
): PlayerGroup => ({
  starters,
  bench,
  out,
});

const stats = (
  fg: string,
  threePt: string,
  rebounds: number,
  assists: number,
  turnovers: number,
  fouls: number,
  pointsInPaint: number,
  fastBreakPoints: number,
): TeamGameStats => ({
  fg,
  threePt,
  rebounds,
  assists,
  turnovers,
  fouls,
  pointsInPaint,
  fastBreakPoints,
});

const game = (input: Game) => input;

export const mockGames: Game[] = [
  game({
    id: "g-001",
    slug: "rockets-vs-lakers",
    homeTeam: "lakers",
    awayTeam: "rockets",
    startTime: "2026-04-19T19:30:00-07:00",
    status: "live",
    score: {
      home: 104,
      away: 108,
    },
    arena: "Crypto.com Arena",
    streamType: "none",
    streamUrl: null,
    thumbnail: "/thumbnails/rockets-lakers.svg",
    isLive: true,
    quarter: "Q4",
    clock: "02:11",
    headline: "Playoff-energy pace with both backcourts trading clutch runs.",
    description:
      "Houston is forcing tempo while Los Angeles keeps leaning on half-court mismatches and late-clock execution.",
    nationalTv: "League Pass Premium",
    tags: ["Prime Time", "West Showdown", "Live"],
    lineups: {
      home: lineup(
        [
          "D'Angelo Russell",
          "Austin Reaves",
          "LeBron James",
          "Rui Hachimura",
          "Anthony Davis",
        ],
        ["Gabe Vincent", "Cam Reddish", "Taurean Prince", "Jaxson Hayes"],
        ["Jarred Vanderbilt"],
      ),
      away: lineup(
        [
          "Fred VanVleet",
          "Jalen Green",
          "Dillon Brooks",
          "Jabari Smith Jr.",
          "Alperen Sengun",
        ],
        ["Amen Thompson", "Cam Whitmore", "Tari Eason", "Jeff Green"],
        ["Steven Adams"],
      ),
    },
    stats: {
      home: stats("48%", "37%", 41, 24, 10, 18, 46, 11),
      away: stats("49%", "39%", 44, 27, 11, 16, 50, 15),
      leaders: [
        { team: "away", label: "PTS", player: "Jalen Green", value: "31" },
        { team: "home", label: "REB", player: "Anthony Davis", value: "14" },
        { team: "home", label: "AST", player: "LeBron James", value: "11" },
        { team: "away", label: "3PM", player: "Fred VanVleet", value: "5" },
      ],
    },
  }),
  game({
    id: "g-002",
    slug: "celtics-vs-knicks",
    homeTeam: "knicks",
    awayTeam: "celtics",
    startTime: "2026-04-20T19:00:00-04:00",
    status: "upcoming",
    score: {
      home: 0,
      away: 0,
    },
    arena: "Madison Square Garden",
    streamType: "none",
    streamUrl: null,
    thumbnail: "/thumbnails/celtics-knicks.svg",
    isLive: false,
    headline: "Boston's spacing meets New York's bruising rebounding edge.",
    description:
      "An East heavyweight matchup with playoff seeding pressure, elite wing defense, and a packed Garden crowd.",
    nationalTv: "ESPN",
    tags: ["East Feature", "Marquee Matchup"],
    lineups: {
      home: lineup(
        [
          "Jalen Brunson",
          "Donte DiVincenzo",
          "Josh Hart",
          "OG Anunoby",
          "Mitchell Robinson",
        ],
        ["Miles McBride", "Bojan Bogdanovic", "Precious Achiuwa", "Isaiah Hartenstein"],
      ),
      away: lineup(
        [
          "Jrue Holiday",
          "Derrick White",
          "Jaylen Brown",
          "Jayson Tatum",
          "Kristaps Porzingis",
        ],
        ["Payton Pritchard", "Sam Hauser", "Al Horford", "Luke Kornet"],
      ),
    },
    stats: {
      home: stats("47%", "35%", 45, 23, 12, 19, 44, 10),
      away: stats("49%", "38%", 42, 28, 11, 18, 42, 13),
      leaders: [
        { team: "home", label: "PTS", player: "Jalen Brunson", value: "29.1" },
        { team: "away", label: "REB", player: "Jayson Tatum", value: "8.4" },
        { team: "away", label: "AST", player: "Jrue Holiday", value: "7.2" },
        { team: "home", label: "3PM", player: "Donte DiVincenzo", value: "3.4" },
      ],
    },
  }),
  game({
    id: "g-003",
    slug: "warriors-vs-suns",
    homeTeam: "suns",
    awayTeam: "warriors",
    startTime: "2026-04-20T20:30:00-07:00",
    status: "upcoming",
    score: {
      home: 0,
      away: 0,
    },
    arena: "Footprint Center",
    streamType: "none",
    streamUrl: null,
    thumbnail: "/thumbnails/warriors-suns.svg",
    isLive: false,
    headline: "Movement shooting against one of the league's sharpest midrange attacks.",
    description:
      "Golden State leans on off-ball gravity while Phoenix counters with half-court precision and star shotmaking.",
    nationalTv: "TNT",
    tags: ["Late Window", "West Race"],
    lineups: {
      home: lineup(
        [
          "Bradley Beal",
          "Devin Booker",
          "Grayson Allen",
          "Kevin Durant",
          "Jusuf Nurkic",
        ],
        ["Eric Gordon", "Royce O'Neale", "Bol Bol", "Drew Eubanks"],
      ),
      away: lineup(
        [
          "Stephen Curry",
          "Brandin Podziemski",
          "Klay Thompson",
          "Jonathan Kuminga",
          "Draymond Green",
        ],
        ["Chris Paul", "Moses Moody", "Gary Payton II", "Trayce Jackson-Davis"],
      ),
    },
    stats: {
      home: stats("48%", "37%", 43, 26, 13, 18, 40, 9),
      away: stats("46%", "38%", 42, 29, 14, 17, 38, 16),
      leaders: [
        { team: "home", label: "PTS", player: "Kevin Durant", value: "28.7" },
        { team: "away", label: "REB", player: "Jonathan Kuminga", value: "7.8" },
        { team: "away", label: "AST", player: "Stephen Curry", value: "6.3" },
        { team: "home", label: "3PM", player: "Grayson Allen", value: "3.2" },
      ],
    },
  }),
  game({
    id: "g-004",
    slug: "bucks-vs-heat",
    homeTeam: "heat",
    awayTeam: "bucks",
    startTime: "2026-04-18T19:00:00-04:00",
    status: "finished",
    score: {
      home: 101,
      away: 112,
    },
    arena: "Kaseya Center",
    streamType: "none",
    streamUrl: null,
    thumbnail: "/thumbnails/bucks-heat.svg",
    isLive: false,
    headline: "Milwaukee won the paint and closed every Miami run in the fourth.",
    description:
      "The Bucks controlled second-chance chances, while Miami struggled to string together efficient half-court possessions.",
    nationalTv: "NBA TV",
    tags: ["Final", "East Battle"],
    lineups: {
      home: lineup(
        [
          "Terry Rozier",
          "Tyler Herro",
          "Jimmy Butler",
          "Nikola Jovic",
          "Bam Adebayo",
        ],
        ["Josh Richardson", "Caleb Martin", "Haywood Highsmith", "Kevin Love"],
      ),
      away: lineup(
        [
          "Damian Lillard",
          "Malik Beasley",
          "Khris Middleton",
          "Giannis Antetokounmpo",
          "Brook Lopez",
        ],
        ["Bobby Portis", "Pat Connaughton", "Jae Crowder", "AJ Green"],
      ),
    },
    stats: {
      home: stats("44%", "34%", 39, 22, 13, 19, 42, 8),
      away: stats("50%", "37%", 47, 26, 10, 17, 54, 12),
      leaders: [
        { team: "away", label: "PTS", player: "Giannis Antetokounmpo", value: "33" },
        { team: "home", label: "REB", player: "Bam Adebayo", value: "13" },
        { team: "away", label: "AST", player: "Damian Lillard", value: "9" },
        { team: "home", label: "3PM", player: "Tyler Herro", value: "4" },
      ],
    },
  }),
  game({
    id: "g-005",
    slug: "mavericks-vs-nuggets",
    homeTeam: "nuggets",
    awayTeam: "mavericks",
    startTime: "2026-04-18T20:00:00-06:00",
    status: "finished",
    score: {
      home: 118,
      away: 114,
    },
    arena: "Ball Arena",
    streamType: "none",
    streamUrl: null,
    thumbnail: "/thumbnails/league-night.svg",
    isLive: false,
    headline: "Denver's late execution outlasted a barrage of Dallas isolation buckets.",
    description:
      "The Nuggets kept the ball moving in the final three minutes and closed the night with back-to-back paint finishes.",
    nationalTv: "Altitude / Bally",
    tags: ["Final", "West Battle"],
    lineups: {
      home: lineup(
        ["Jamal Murray", "Kentavious Caldwell-Pope", "Michael Porter Jr.", "Aaron Gordon", "Nikola Jokic"],
        ["Reggie Jackson", "Christian Braun", "Peyton Watson", "Justin Holiday"],
      ),
      away: lineup(
        ["Luka Doncic", "Kyrie Irving", "Derrick Jones Jr.", "PJ Washington", "Daniel Gafford"],
        ["Dante Exum", "Tim Hardaway Jr.", "Maxi Kleber", "Dereck Lively II"],
      ),
    },
    stats: {
      home: stats("51%", "36%", 46, 31, 12, 18, 52, 10),
      away: stats("48%", "39%", 41, 24, 9, 16, 44, 13),
      leaders: [
        { team: "away", label: "PTS", player: "Luka Doncic", value: "35" },
        { team: "home", label: "REB", player: "Nikola Jokic", value: "15" },
        { team: "home", label: "AST", player: "Nikola Jokic", value: "12" },
        { team: "away", label: "3PM", player: "Kyrie Irving", value: "5" },
      ],
    },
  }),
  game({
    id: "g-006",
    slug: "clippers-vs-timberwolves",
    homeTeam: "timberwolves",
    awayTeam: "clippers",
    startTime: "2026-04-21T19:30:00-05:00",
    status: "upcoming",
    score: {
      home: 0,
      away: 0,
    },
    arena: "Target Center",
    streamType: "none",
    streamUrl: null,
    thumbnail: "/thumbnails/league-night.svg",
    isLive: false,
    headline: "Length and physicality meet one of the conference's deepest wing rotations.",
    description:
      "Minnesota tries to dictate the glass while Los Angeles leans into wing scoring and matchup versatility.",
    nationalTv: "League Pass",
    tags: ["Defensive Showcase"],
    lineups: {
      home: lineup(
        ["Mike Conley", "Anthony Edwards", "Jaden McDaniels", "Karl-Anthony Towns", "Rudy Gobert"],
        ["Nickeil Alexander-Walker", "Naz Reid", "Kyle Anderson", "Monte Morris"],
      ),
      away: lineup(
        ["James Harden", "Norman Powell", "Paul George", "Kawhi Leonard", "Ivica Zubac"],
        ["Russell Westbrook", "Terance Mann", "Amir Coffey", "Mason Plumlee"],
      ),
    },
    stats: {
      home: stats("47%", "36%", 45, 25, 13, 18, 48, 12),
      away: stats("48%", "37%", 42, 24, 12, 17, 46, 11),
      leaders: [
        { team: "home", label: "PTS", player: "Anthony Edwards", value: "27.4" },
        { team: "away", label: "REB", player: "Ivica Zubac", value: "10.8" },
        { team: "away", label: "AST", player: "James Harden", value: "8.6" },
        { team: "home", label: "3PM", player: "Karl-Anthony Towns", value: "2.4" },
      ],
    },
  }),
  game({
    id: "g-007",
    slug: "cavaliers-vs-magic",
    homeTeam: "magic",
    awayTeam: "cavaliers",
    startTime: "2026-04-19T18:00:00-04:00",
    status: "live",
    score: {
      home: 92,
      away: 90,
    },
    arena: "Kia Center",
    streamType: "none",
    streamUrl: null,
    thumbnail: "/thumbnails/league-night.svg",
    isLive: true,
    quarter: "Q3",
    clock: "05:42",
    headline: "Cleveland's shot creators are trying to break Orlando's length-heavy defense.",
    description:
      "The Magic are controlling transition and forcing deep-clock possessions in another East grinder.",
    nationalTv: "League Pass",
    tags: ["Live", "East Race"],
    lineups: {
      home: lineup(
        ["Jalen Suggs", "Gary Harris", "Franz Wagner", "Paolo Banchero", "Wendell Carter Jr."],
        ["Cole Anthony", "Anthony Black", "Jonathan Isaac", "Moritz Wagner"],
      ),
      away: lineup(
        ["Darius Garland", "Donovan Mitchell", "Max Strus", "Evan Mobley", "Jarrett Allen"],
        ["Caris LeVert", "Sam Merrill", "Isaac Okoro", "Georges Niang"],
      ),
    },
    stats: {
      home: stats("45%", "34%", 42, 21, 9, 14, 40, 14),
      away: stats("44%", "35%", 39, 18, 11, 16, 38, 9),
      leaders: [
        { team: "home", label: "PTS", player: "Paolo Banchero", value: "24" },
        { team: "away", label: "REB", player: "Jarrett Allen", value: "12" },
        { team: "away", label: "AST", player: "Darius Garland", value: "8" },
        { team: "home", label: "3PM", player: "Franz Wagner", value: "3" },
      ],
    },
  }),
  game({
    id: "g-008",
    slug: "bulls-vs-sixers",
    homeTeam: "sixers",
    awayTeam: "bulls",
    startTime: "2026-04-21T19:00:00-04:00",
    status: "upcoming",
    score: {
      home: 0,
      away: 0,
    },
    arena: "Wells Fargo Center",
    streamType: "none",
    streamUrl: null,
    thumbnail: "/thumbnails/league-night.svg",
    isLive: false,
    headline: "Chicago's pressure defense travels to Philly for a seeding swing game.",
    description:
      "Both teams are fighting for late East positioning and leaning heavily on backcourt creation.",
    nationalTv: "League Pass",
    tags: ["East Race"],
    lineups: {
      home: lineup(
        ["Tyrese Maxey", "Buddy Hield", "Kelly Oubre Jr.", "Tobias Harris", "Joel Embiid"],
        ["Kyle Lowry", "Nicolas Batum", "Paul Reed", "Cameron Payne"],
      ),
      away: lineup(
        ["Coby White", "Ayo Dosunmu", "DeMar DeRozan", "Torrey Craig", "Nikola Vucevic"],
        ["Alex Caruso", "Jevon Carter", "Julian Phillips", "Andre Drummond"],
      ),
    },
    stats: {
      home: stats("48%", "36%", 44, 26, 12, 18, 50, 10),
      away: stats("46%", "35%", 43, 24, 11, 17, 46, 8),
      leaders: [
        { team: "home", label: "PTS", player: "Joel Embiid", value: "31.0" },
        { team: "away", label: "REB", player: "Nikola Vucevic", value: "10.9" },
        { team: "home", label: "AST", player: "Tyrese Maxey", value: "7.1" },
        { team: "away", label: "3PM", player: "Coby White", value: "2.9" },
      ],
    },
  }),
];
