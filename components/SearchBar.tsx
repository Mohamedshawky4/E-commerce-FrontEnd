"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/axios';
import { Product } from '@/types/product';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length > 1) {
                setIsLoading(true);
                try {
                    const { data } = await api.get(`/products/suggestions?q=${query}`);
                    setSuggestions(data.products || []);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query)}`);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (slug: string) => {
        router.push(`/products/${slug}`);
        setShowSuggestions(false);
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
                    placeholder="SEARCH COLLECTIONS..."
                    className="w-full bg-foreground/5 border border-white/5 rounded-2xl py-3 pl-12 pr-10 text-sm tracking-widest focus:outline-none focus:border-primary/30 focus:bg-foreground/10 transition-all duration-300 placeholder:text-foreground/30"
                    onFocus={() => query.length > 1 && setShowSuggestions(true)}
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="absolute right-4 text-foreground/30 hover:text-foreground transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (suggestions.length > 0 || isLoading) && (
                <div className="absolute top-full left-0 w-full mt-2 glass-card overflow-hidden border border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    {isLoading ? (
                        <div className="p-4 flex items-center justify-center gap-2 text-sm text-foreground/50">
                            <Zap size={16} className="animate-pulse text-primary" />
                            <span>SCANNING DATABASE...</span>
                        </div>
                    ) : (
                        <div className="py-2">
                            <div className="px-4 py-2 text-[10px] font-bold text-primary tracking-[0.2em] uppercase border-b border-white/5 mb-2">
                                Top Matches
                            </div>
                            {suggestions.map((product) => (
                                <button
                                    key={product._id}
                                    onClick={() => product.slug && handleSuggestionClick(product.slug)}
                                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-primary/10 transition-colors group/item"
                                >
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                                        <Image
                                            src={(product.images && product.images[0]) || '/placeholder-product.png'}
                                            alt={product.name || 'Product'}
                                            fill
                                            className="object-cover group-hover/item:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors line-clamp-1 uppercase tracking-tight">
                                            {product.name}
                                        </h4>
                                        <p className="text-xs text-foreground/50 tracking-wide">
                                            {product.brand}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-black text-primary">
                                            ${product.price}
                                        </span>
                                    </div>
                                </button>
                            ))}
                            <button
                                onClick={handleSearch}
                                className="w-full p-4 text-xs font-black text-center text-foreground/50 hover:text-primary transition-colors bg-foreground/5 border-t border-white/5 uppercase tracking-[0.2em]"
                            >
                                View All Results
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
