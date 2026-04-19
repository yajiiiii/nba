import { Badge } from "@/components/ui/badge";

export function LiveBadge({ className }: { className?: string }) {
  return (
    <Badge variant="live" className={className}>
      <span className="mr-2 h-2 w-2 animate-pulse-dot rounded-full bg-primary" />
      Live
    </Badge>
  );
}
