"use client";
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import ProductFilters from '@/components/ProductFilters';
import ActiveFilters from '@/components/ActiveFilters';
import React, { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import SortDropdown from '@/components/SortDropDown';
import { Product } from "@/types/product";
import { PaginationButton } from '@/components/Pagination';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import api from '@/lib/axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCategories } from '@/hooks/useCategories';

import { Suspense } from 'react';

const ProductsContent = () => {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || "";

  const [sortBy, setSortBy] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initialSearch);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    categories: [] as string[],
    minPrice: 0,
    maxPrice: 10000,
    brands: [] as string[],
    rating: 0,
    hasStock: false,
  });

  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Fetch categories using TanStack Query
  const { data: categoriesData = [] } = useCategories();
  const availableCategories = categoriesData;

  // Fetch products using TanStack Query
  const queryParams: any = {
    sort: sortBy,
    search: debouncedSearch,
    page,
    limit: 12,
  };

  if (filters.categories.length > 0) {
    queryParams.category = filters.categories;
  }
  if (filters.minPrice > 0) {
    queryParams.minPrice = filters.minPrice;
  }
  if (filters.maxPrice < 10000) {
    queryParams.maxPrice = filters.maxPrice;
  }
  if (filters.brands.length > 0) {
    queryParams.brand = filters.brands.join(',');
  }
  if (filters.rating > 0) {
    queryParams.rating = filters.rating;
  }
  if (filters.hasStock) {
    queryParams.hasStock = true;
  }

  const { data: productsData, isLoading: loading, isError, error: queryError } = useProducts(queryParams);
  const products = productsData?.products || [];
  const pagination = productsData?.pagination;
  const error = isError ? (queryError as any)?.response?.data?.message || "Something went wrong" : null;

  // Fetch brands (simpler to keep as is for now or could also be a hook)
  useEffect(() => {
    const fetchBrandsData = async () => {
      try {
        const brandsRes = await api.get('/products/brands');
        setAvailableBrands(brandsRes.data.brands || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrandsData();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setPage(1);
  }, [filters, sortBy]);

  const handleSort = (sortValue: string) => {
    setSortBy(sortValue);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleRemoveFilter = (filterType: string, value?: any) => {
    switch (filterType) {
      case 'search':
        setSearchQuery('');
        setDebouncedSearch('');
        break;
      case 'category':
        setFilters({
          ...filters,
          categories: filters.categories.filter(id => id !== value),
        });
        break;
      case 'brand':
        setFilters({
          ...filters,
          brands: filters.brands.filter(b => b !== value),
        });
        break;
      case 'price':
        setFilters({ ...filters, minPrice: 0, maxPrice: 10000 });
        break;
      case 'rating':
        setFilters({ ...filters, rating: 0 });
        break;
      case 'stock':
        setFilters({ ...filters, hasStock: false });
        break;
    }
  };

  const handleClearAll = () => {
    setFilters({
      categories: [],
      minPrice: 0,
      maxPrice: 10000,
      brands: [],
      rating: 0,
      hasStock: false,
    });
    setSearchQuery('');
    setDebouncedSearch('');
    setSortBy('');
  };

  const categoryNamesMap = availableCategories.reduce((acc: { [key: string]: string }, cat: any) => {
    acc[cat._id] = cat.name;
    return acc;
  }, {} as { [key: string]: string });

  return (
    <div className="mt-20 min-h-screen">
      {/* Breadcrumbs */}
      <div className="px-6 lg:px-16 py-4">
        <div className="text-sm text-muted-foreground">
          <Link href="/"><span className="hover:text-primary cursor-pointer">Home</span></Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-semibold">Products</span>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 lg:px-16 mb-6">
        <h1 className="text-4xl font-black mb-4">All Products</h1>

        {/* Search Bar */}
        <div className="relative max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setDebouncedSearch('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl mb-4"
        >
          <SlidersHorizontal size={20} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="px-6 lg:px-16 flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            availableCategories={availableCategories}
            availableBrands={availableBrands}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Active Filters & Sort */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">
                {pagination && (
                  <span>Showing {products.length} of {pagination.total} products</span>
                )}
              </div>
              <SortDropdown onSort={handleSort} />
            </div>

            <ActiveFilters
              filters={{ ...filters, search: debouncedSearch }}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAll}
              categoryNames={categoryNamesMap}
            />
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {loading ? (
              // Loading Skeletons
              Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : products.length > 0 ? (
              // Products
              products.map((p: Product) => (
                <ProductCard key={p._id} product={p} />
              ))
            ) : (
              // Empty State
              <div className="col-span-full text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && products.length > 0 && (
            <PaginationButton
              pagination={pagination}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div className="mt-20 px-6 lg:px-16 py-20 text-center">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
};

export default Page;
