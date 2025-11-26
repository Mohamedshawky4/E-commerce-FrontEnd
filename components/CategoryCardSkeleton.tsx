import React from 'react';

const CategoryCardSkeleton = () => {
    return (
        <div className="flex flex-col items-center gap-3 p-4 animate-pulse">
            {/* Icon Skeleton */}
            <div className="w-16 h-16 bg-muted/30 rounded-full" />

            {/* Text Skeleton */}
            <div className="w-20 h-4 bg-muted/30 rounded" />
        </div>
    );
};

export default CategoryCardSkeleton;
