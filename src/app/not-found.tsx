import { EmptyState } from "@/components/shared/empty-state";

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you were looking for is not part of this NBA demo route map."
    />
  );
}
