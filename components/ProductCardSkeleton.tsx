// components/ProductCardSkeleton.tsx
export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse flex flex-col overflow-hidden rounded-3xl 
      border border-white/20 dark:border-white/10 bg-white/40 dark:bg-white/5 
      backdrop-blur-xl shadow-lg h-full">

      {/* Image Skeleton */}
      <div className="w-full aspect-square bg-gray-300/40 dark:bg-gray-700/40" />

      <div className="p-4 sm:p-5 space-y-3">
        {/* Categories */}
        <div className="flex gap-2">
          <div className="h-3 w-12 bg-gray-300/50 dark:bg-gray-700/50 rounded-md" />
          <div className="h-3 w-16 bg-gray-300/50 dark:bg-gray-700/50 rounded-md" />
        </div>

        {/* Title */}
        <div className="h-4 w-3/4 bg-gray-300/50 dark:bg-gray-700/50 rounded-md" />

        {/* Rating */}
        <div className="h-3 w-20 bg-gray-300/50 dark:bg-gray-700/50 rounded-md" />

        {/* Price */}
        <div className="h-4 w-24 bg-gray-300/50 dark:bg-gray-700/50 rounded-md" />

        {/* Button */}
        <div className="h-9 w-full bg-gray-300/50 dark:bg-gray-700/50 rounded-xl" />
      </div>
    </div>
  );
}
