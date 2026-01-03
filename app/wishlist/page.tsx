"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";
import ProductCard from "@/components/ProductCard";
import Button from "@/components/Button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

const WishlistPage = () => {
    const { items, isLoading, fetchWishlist, clearWishlist } = useWishlistStore();
    const { token } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!token) {
            router.push("/login?redirect=/wishlist");
        } else {
            fetchWishlist();
        }
    }, [token, fetchWishlist, router]);

    if (!mounted || !token) return null;

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 text-primary text-[10px] font-black tracking-[0.3em] uppercase mb-4">
                            <Heart size={14} className="fill-primary text-primary" />
                            <span>Your Collection</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-metal tracking-tighter leading-none mb-4">
                            WISH<span className="text-primary text-glow">LIST</span>
                        </h1>
                        <p className="text-foreground/50 max-w-lg">
                            Saved items that you love. Keep track of what you want to bring home.
                        </p>
                    </div>

                    {items.length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearWishlist}
                            leftIcon={<Trash2 size={14} />}
                            className="text-[10px] font-black tracking-widest border-white/5 hover:border-rose-500/50 hover:text-rose-500 transition-all"
                        >
                            CLEAR WISHLIST
                        </Button>
                    )}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square rounded-3xl glass-card animate-pulse bg-white/5" />
                        ))}
                    </div>
                ) : items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {items.map((product) => (
                            <ProductCard key={product._id} product={product as any} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center mb-8 border-white/5">
                            <Heart size={40} className="text-white/10" />
                        </div>
                        <h2 className="text-3xl font-black text-metal mb-4 uppercase tracking-tighter">Your wishlist is empty</h2>
                        <p className="text-foreground/40 mb-10 max-w-sm">
                            Discover something you love and save it here to keep an eye on it!
                        </p>
                        <Link href="/products">
                            <Button variant="liquid" size="lg" leftIcon={<ShoppingBag size={18} />}>
                                START EXPLORING
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
