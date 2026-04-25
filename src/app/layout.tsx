import type { Metadata } from "next";
import { Barlow, Bebas_Neue } from "next/font/google";

import { SiteChrome } from "@/components/layout/site-chrome";
import { AppProviders } from "@/components/providers/app-providers";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { getGames, getTeams } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";

import "./globals.css";

const headingFont = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
});

const bodyFont = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | NBA Streaming and Scores`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} | NBA Streaming and Scores`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: absoluteUrl("/thumbnails/league-night.svg"),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} social preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | NBA Streaming and Scores`,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl("/thumbnails/league-night.svg")],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [games, teams] = await Promise.all([getGames(), getTeams()]);

  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${headingFont.variable} min-h-screen bg-background font-body text-foreground antialiased`}
      >
        <AppProviders>
          <SiteChrome games={games} teams={teams}>
            {children}
          </SiteChrome>
        </AppProviders>
      </body>
    </html>
  );
}
