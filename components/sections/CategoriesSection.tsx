"use client";
import React from 'react';
import CategoryCard from '../CategoryCard';
import CategoryCardSkeleton from '../CategoryCardSkeleton';
import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';

const CategoriesSection = () => {
  const { data: categories = [], isLoading: loading } = useCategories();

  return (
    <section id="categories-section" className="py-12 px-0 flex flex-col items-center w-full">
      {/* Header Row */}
      <div className="flex w-full px-18 justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold ">Categories</h1>
        <Link
          href="/categories"
          className="text-primary font-medium hover:underline hover:text-primary/80 transition"
        >
          See More →
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] justify-center  w-full px-20">
        {loading ? (
          // Show skeletons while loading
          Array.from({ length: 6 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))
        ) : (
          // Show actual categories
          categories.map((c) => (
            <CategoryCard key={c._id} category={c} />
          ))
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
