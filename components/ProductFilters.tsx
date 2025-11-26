"use client";
import React from 'react';

interface ProductFiltersProps {
    filters: {
        categories: string[];
        minPrice: number;
        maxPrice: number;
        brands: string[];
        rating: number;
        hasStock: boolean;
    };
    onFilterChange: (filters: any) => void;
    availableCategories?: { _id: string; name: string }[];
    availableBrands?: string[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
    filters,
    onFilterChange,
    availableCategories = [],
    availableBrands = [],
}) => {
    return (
        <div className="w-64">
            {/* Categories */}
            {availableCategories.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-sm font-bold mb-4 text-foreground">CATEGORY</h3>
                    <div className="space-y-3">
                        {availableCategories.map((category) => (
                            <label
                                key={category._id}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.categories.includes(category._id)}
                                    onChange={() => {
                                        const newCategories = filters.categories.includes(category._id)
                                            ? filters.categories.filter(id => id !== category._id)
                                            : [...filters.categories, category._id];
                                        onFilterChange({ ...filters, categories: newCategories });
                                    }}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20"
                                />
                                <span className="text-sm text-foreground/80 group-hover:text-primary transition-colors">
                                    {category.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Price */}
            <div className="mb-8">
                <h3 className="text-sm font-bold mb-4 text-foreground">PRICE</h3>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => onFilterChange({ ...filters, minPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Min"
                    />
                    <span className="text-gray-400">—</span>
                    <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Max"
                    />
                </div>
            </div>

            {/* Brands */}
            {availableBrands.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-sm font-bold mb-4 text-foreground">BRAND</h3>
                    <div className="space-y-3">
                        {availableBrands.map((brand) => (
                            <label
                                key={brand}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.brands.includes(brand)}
                                    onChange={() => {
                                        const newBrands = filters.brands.includes(brand)
                                            ? filters.brands.filter(b => b !== brand)
                                            : [...filters.brands, brand];
                                        onFilterChange({ ...filters, brands: newBrands });
                                    }}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20"
                                />
                                <span className="text-sm text-foreground/80 group-hover:text-primary transition-colors">
                                    {brand}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Rating */}
            <div className="mb-8">
                <h3 className="text-sm font-bold mb-4 text-foreground">RATING</h3>
                <div className="space-y-3">
                    {[4, 3, 2, 1].map((rating) => (
                        <label
                            key={rating}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type="radio"
                                name="rating"
                                checked={filters.rating === rating}
                                onChange={() => onFilterChange({ ...filters, rating: filters.rating === rating ? 0 : rating })}
                                className="w-4 h-4 border-gray-300 text-primary focus:ring-2 focus:ring-primary/20"
                            />
                            <span className="text-sm text-foreground/80 group-hover:text-primary transition-colors">
                                {rating}+ ⭐
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Stock */}
            <div>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={filters.hasStock}
                        onChange={() => onFilterChange({ ...filters, hasStock: !filters.hasStock })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">
                        In Stock Only
                    </span>
                </label>
            </div>
        </div>
    );
};

export default ProductFilters;
