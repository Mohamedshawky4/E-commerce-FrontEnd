import { Skeleton } from "./skeletons/Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="glass-card p-4 space-y-4 h-full border border-white/10 overflow-hidden">
      <Skeleton className="aspect-square rounded-xl w-full" />
      <div className="space-y-3 p-1">
        <div className="flex gap-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-24 mt-4" />
        <Skeleton className="h-10 w-full rounded-xl mt-2" />
      </div>
    </div>
  );
}

