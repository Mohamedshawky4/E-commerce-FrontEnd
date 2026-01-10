import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import { Product } from "@/types/product";

export type WishlistItem = Product;

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
                    // Backend returns: res.json({ success: true, wishlist: wishlist.products });
                    // So response.data.wishlist is the array of products.
                    set({ items: response.data.wishlist || [], error: null });
                } catch (error) {
                    const err = error as AxiosError<{ message: string }>;
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
                        await api.post("/wishlist", { productIdOrSlug: product._id });
                        set({ items: [...get().items, product] });
                    }
                } catch (err) {
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
                } catch (err) {
                    console.error("Failed to clear wishlist:", err);
                }
            },
        }),
        {
            name: "spectra-wishlist-storage",
        }
    )
);
