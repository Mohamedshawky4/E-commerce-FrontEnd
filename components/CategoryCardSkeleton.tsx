import React from 'react';
import { Skeleton } from './skeletons/Skeleton';

const CategoryCardSkeleton = () => {
    return (
        <div className="flex flex-col items-center gap-3 p-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="w-20 h-4 rounded" />
        </div>
    );
};

export default CategoryCardSkeleton;

