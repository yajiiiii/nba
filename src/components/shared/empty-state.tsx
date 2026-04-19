import type { LucideIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  icon: Icon = AlertCircle,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <Card className="border-dashed border-white/10 bg-surface-elevated/70">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background/80">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading text-3xl uppercase tracking-[0.08em]">
            {title}
          </h3>
          <p className="max-w-xl text-sm text-muted-foreground">{description}</p>
        </div>
        {actionLabel && onAction ? (
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
