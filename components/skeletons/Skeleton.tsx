"use client";
import { m } from "framer-motion";
import clsx from "clsx";

interface SkeletonProps {
    className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
    <m.div
        className={clsx("bg-foreground/5 rounded-md relative overflow-hidden", className)}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
        <m.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
    </m.div>
);

export const ProductCardSkeleton = () => (
    <div className="glass-card p-4 space-y-4">
        <Skeleton className="aspect-square rounded-xl" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
        </div>
        <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-1/3 rounded-lg" />
        </div>
    </div>
);

export const CategorySkeleton = () => (
    <div className="flex flex-col items-center space-y-3">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="h-3 w-12" />
    </div>
);
