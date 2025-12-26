"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";

export interface WishlistItem {
    _id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
}

interface WishlistState {
    items: WishlistItem[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchWishlist: () => Promise<void>;
    toggleWishlist: (product: WishlistItem) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,
            error: null,

            fetchWishlist: async () => {
                set({ isLoading: true });
                try {
                    const response = await api.get("/wishlist");
                    set({ items: response.data.wishlist.products, error: null });
                } catch (err: any) {
                    set({ error: err.response?.data?.message || "Failed to fetch wishlist" });
                } finally {
                    set({ isLoading: false });
                }
            },

            toggleWishlist: async (product) => {
                const isIn = get().isInWishlist(product._id);
                try {
                    if (isIn) {
                        await api.delete(`/wishlist/${product._id}`);
                        set({ items: get().items.filter((item) => item._id !== product._id) });
                    } else {
                        await api.post("/wishlist", { productId: product._id });
                        set({ items: [...get().items, product] });
                    }
                } catch (err: any) {
                    console.error("Failed to toggle wishlist:", err);
                }
            },

            isInWishlist: (productId) => {
                return get().items.some((item) => item._id === productId);
            },

            clearWishlist: async () => {
                try {
                    await api.delete("/wishlist");
                    set({ items: [] });
                } catch (err: any) {
                    console.error("Failed to clear wishlist:", err);
                }
            },
        }),
        {
            name: "genesis-wishlist-storage",
        }
    )
);
