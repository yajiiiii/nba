import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-16 w-64 rounded-full" />
      <Skeleton className="aspect-[16/9] w-full rounded-[2rem]" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-72 w-full rounded-[1.75rem]" />
          <Skeleton className="h-72 w-full rounded-[1.75rem]" />
        </div>
        <Skeleton className="h-[32rem] w-full rounded-[1.75rem]" />
      </div>
    </div>
  );
}
