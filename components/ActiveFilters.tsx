"use client";
import React from 'react';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
    filters: {
        categories: string[];
        minPrice: number;
        maxPrice: number;
        brands: string[];
        rating: number;
        hasStock: boolean;
        search?: string;
    };
    onRemoveFilter: (filterType: string, value?: string) => void;
    onClearAll: () => void;
    categoryNames?: { [key: string]: string };
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
    filters,
    onRemoveFilter,
    onClearAll,
    categoryNames = {},
}) => {
    const hasActiveFilters =
        filters.categories.length > 0 ||
        filters.brands.length > 0 ||
        filters.rating > 0 ||
        filters.hasStock ||
        filters.minPrice > 0 ||
        filters.maxPrice < 10000 ||
        (filters.search && filters.search.length > 0);

    if (!hasActiveFilters) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm font-semibold text-muted-foreground">Active Filters:</span>

            {/* Search */}
            {filters.search && filters.search.length > 0 && (
                <button
                    onClick={() => onRemoveFilter('search')}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                    Search: "{filters.search}"
                    <X size={14} />
                </button>
            )}

            {/* Categories */}
            {filters.categories.map((categoryId) => (
                <button
                    key={categoryId}
                    onClick={() => onRemoveFilter('category', categoryId)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                    {categoryNames[categoryId] || categoryId}
                    <X size={14} />
                </button>
            ))}

            {/* Brands */}
            {filters.brands.map((brand) => (
                <button
                    key={brand}
                    onClick={() => onRemoveFilter('brand', brand)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                    {brand}
                    <X size={14} />
                </button>
            ))}

            {/* Price Range */}
            {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
                <button
                    onClick={() => onRemoveFilter('price')}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                    ${filters.minPrice} - ${filters.maxPrice}
                    <X size={14} />
                </button>
            )}

            {/* Rating */}
            {filters.rating > 0 && (
                <button
                    onClick={() => onRemoveFilter('rating')}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                    {filters.rating}+ ⭐
                    <X size={14} />
                </button>
            )}

            {/* Stock */}
            {filters.hasStock && (
                <button
                    onClick={() => onRemoveFilter('stock')}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                    In Stock
                    <X size={14} />
                </button>
            )}

            {/* Clear All */}
            <button
                onClick={onClearAll}
                className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-semibold hover:bg-red-500/20 transition-colors"
            >
                Clear All
            </button>
        </div>
    );
};

export default ActiveFilters;
