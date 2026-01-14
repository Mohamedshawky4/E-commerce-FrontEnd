"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Zap, TrendingUp, SearchX, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSearchSuggestions, useTrendingProducts, useTrendingKeywords } from '@/hooks/useProducts';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const { data: suggestions = [], isLoading } = useSearchSuggestions(debouncedQuery);
    const { data: trendingProducts = [] } = useTrendingProducts();
    const { data: trendingKeywords = [] } = useTrendingKeywords();

    const showDropdown = isFocused && (query.length > 0 || trendingProducts.length > 0);

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e?: React.FormEvent, searchQuery?: string) => {
        if (e) e.preventDefault();
        const finalQuery = searchQuery || query;
        if (finalQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(finalQuery)}`);
            setIsFocused(false);
        }
    };

    const handleKeywordClick = (keyword: string) => {
        setQuery(keyword);
        // Keep dropdown open to show suggestions for this keyword
    };

    const handleSuggestionClick = (slug: string) => {
        router.push(`/products/${slug}`);
        setIsFocused(false);
        setQuery('');
    };

    return (
        <div className="relative w-full max-w-md group" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative flex items-center">
                <div className="absolute left-4 text-primary/50 group-focus-within:text-primary transition-colors duration-300">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder="SEARCH COLLECTIONS..."
                    aria-label="Search products"
                    className="w-full bg-foreground/5 border border-white/5 rounded-2xl py-3 pl-12 pr-10 text-sm tracking-widest focus:outline-none focus:border-primary/30 focus:bg-foreground/10 transition-all duration-300 placeholder:text-foreground/30"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                        className="absolute right-4 text-foreground/30 hover:text-foreground transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </form>

            {/* Suggestions Dropdown */}
            {showDropdown && (
                <div className="absolute top-full left-0 w-full mt-2 overflow-hidden border-2 border-primary/20 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300 rounded-2xl bg-background/95 dark:bg-surface/98 backdrop-blur-xl">
                    {isLoading ? (
                        <div className="p-8 flex flex-col items-center justify-center gap-3 text-sm text-foreground/50">
                            <Zap size={24} className="animate-pulse text-primary" />
                            <span className="tracking-[0.2em] font-bold">SCANNING DATABASE...</span>
                        </div>
                    ) : query.length > 1 && suggestions.length === 0 ? (
                        <div className="p-8 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                                <SearchX size={32} className="text-primary/40" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-1 uppercase tracking-tight">No results found</h3>
                            <p className="text-xs text-foreground/50 mb-6 max-w-[200px]">We couldn't find anything matching "{query}"</p>

                            <div className="w-full pt-6 border-t border-white/5">
                                <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase mb-4 block">Try Trending Instead</span>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {trendingKeywords.map((kw: string) => (
                                        <button
                                            key={kw}
                                            onClick={() => handleKeywordClick(kw)}
                                            className="px-3 py-1.5 bg-foreground/5 hover:bg-primary/20 text-[10px] rounded-full transition-colors border border-white/5"
                                        >
                                            {kw}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-2">
                            {query.length <= 1 ? (
                                <>
                                    <div className="px-4 py-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <TrendingUp size={14} className="text-primary" />
                                            <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Trending Searches</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {trendingKeywords.map((kw: string) => (
                                                <button
                                                    key={kw}
                                                    onClick={() => handleKeywordClick(kw)}
                                                    className="px-3 py-1.5 bg-foreground/5 hover:bg-primary/20 text-[10px] rounded-full transition-colors border border-white/5"
                                                >
                                                    {kw}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {trendingProducts.length > 0 && (
                                        <div className="mt-2">
                                            <div className="px-4 py-2 text-[10px] font-bold text-primary tracking-[0.2em] uppercase border-b border-white/5 mb-2">
                                                Popular Products
                                            </div>
                                            {trendingProducts.map((product) => (
                                                <SuggestionItem
                                                    key={product._id}
                                                    product={product}
                                                    onClick={() => product.slug && handleSuggestionClick(product.slug)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="px-4 py-2 text-[10px] font-bold text-primary tracking-[0.2em] uppercase border-b border-white/5 mb-2">
                                        Found in Collection
                                    </div>
                                    {suggestions.map((product) => (
                                        <SuggestionItem
                                            key={product._id}
                                            product={product}
                                            onClick={() => product.slug && handleSuggestionClick(product.slug)}
                                        />
                                    ))}
                                    <button
                                        onClick={() => handleSearch()}
                                        className="w-full mt-2 flex items-center justify-center gap-2 p-4 text-[10px] font-black text-foreground/50 hover:text-primary transition-all bg-foreground/5 border-t border-white/5 uppercase tracking-[0.3em] group/btn"
                                    >
                                        <span>Show All Results</span>
                                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

import { Product } from "@/types/product";

const SuggestionItem = ({ product, onClick }: { product: Product, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-primary/10 transition-colors group/item"
    >
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
            <Image
                src={(product.images && product.images[0]) || '/placeholder-product.png'}
                alt={product.name || 'Product'}
                fill
                className="object-cover group-hover/item:scale-110 transition-transform duration-500"
            />
        </div>
        <div className="flex-1 text-left min-w-0">
            <h4 className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors line-clamp-1 uppercase tracking-tight">
                {product.name}
            </h4>
            <div className="flex items-center gap-2">
                <p className="text-[10px] text-foreground/50 tracking-wider uppercase">
                    {product.brand}
                </p>
                {product.averageRating > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-primary font-bold">
                        <span>★</span>
                        <span>{product.averageRating.toFixed(1)}</span>
                    </div>
                )}
            </div>
        </div>
        <div className="text-right shrink-0 flex flex-col items-end gap-1">
            {product.discountedPrice && product.discountedPrice < product.price ? (
                <>
                    <span className="text-[10px] text-foreground/30 line-through font-medium">
                        ${product.price}
                    </span>
                    <span className="text-sm font-black text-primary">
                        ${product.discountedPrice}
                    </span>
                </>
            ) : (
                <span className="text-sm font-black text-primary">
                    ${product.price}
                </span>
            )}

            {product.stock > 0 && product.stock <= 5 && (
                <span className="text-[8px] font-black text-amber-500 uppercase tracking-tighter">
                    LOW STOCK
                </span>
            )}
            {product.stock === 0 && (
                <span className="text-[8px] font-black text-rose-500 uppercase tracking-tighter">
                    SOLD OUT
                </span>
            )}
        </div>
    </button>
);

export default SearchBar;
