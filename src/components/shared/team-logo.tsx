"use client";

import Image from "next/image";
import { useState } from "react";

import { getNbaTeamLogoUrl } from "@/data/nba-team-ids";
import { cn } from "@/lib/utils";

export function TeamLogo({
  slug,
  code,
  size = 32,
  className,
}: {
  slug: string;
  code: string;
  size?: number;
  className?: string;
}) {
  const url = getNbaTeamLogoUrl(slug);
  const [failed, setFailed] = useState(false);

  if (!url || failed) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground",
          className,
        )}
        style={{ width: size, height: size }}
      >
        {code}
      </span>
    );
  }

  return (
    <Image
      src={url}
      alt={`${code} logo`}
      width={size}
      height={size}
      className={cn("object-contain", className)}
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}
