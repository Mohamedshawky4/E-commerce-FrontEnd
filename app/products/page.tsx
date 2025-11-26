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

const Page = () => {
  const { products, loading, error, fetchProducts, pagination } = useProducts();

  const [sortBy, setSortBy] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    categories: [] as string[],
    minPrice: 0,
    maxPrice: 10000,
    brands: [] as string[],
    rating: 0,
    hasStock: false,
  });

  const [availableCategories, setAvailableCategories] = useState<{ _id: string; name: string }[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Fetch categories and brands
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products/brands')
        ]);
        setAvailableCategories(categoriesRes.data.categories || []);
        setAvailableBrands(brandsRes.data.brands || []);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };
    fetchFiltersData();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products when filters or search change
  useEffect(() => {
    const params: any = {
      sort: sortBy,
      search: debouncedSearch,
    };

    // Send categories as array instead of comma-separated string
    if (filters.categories.length > 0) {
      // Backend expects individual category queries or array
      // Try sending first category for now
      params.category = filters.categories;
    }
    if (filters.minPrice > 0) {
      params.minPrice = filters.minPrice;
    }
    if (filters.maxPrice < 10000) {
      params.maxPrice = filters.maxPrice;
    }
    if (filters.brands.length > 0) {
      params.brand = filters.brands.join(',');
    }
    if (filters.rating > 0) {
      params.rating = filters.rating;
    }
    if (filters.hasStock) {
      params.hasStock = true;
    }

    fetchProducts(params);
  }, [debouncedSearch, filters, sortBy]);

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

  const categoryNamesMap = availableCategories.reduce((acc, cat) => {
    acc[cat._id] = cat.name;
    return acc;
  }, {} as { [key: string]: string });

  return (
    <div className="mt-20 min-h-screen">
      {/* Breadcrumbs */}
      <div className="px-6 lg:px-16 py-4">
        <div className="text-sm text-muted-foreground">
          <span className="hover:text-primary cursor-pointer">Home</span>
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
              onPageChange={(newPage) => fetchProducts({ sort: sortBy, page: newPage, search: debouncedSearch, ...filters })}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
