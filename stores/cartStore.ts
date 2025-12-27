"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";

export interface CartItem {
    _id: string;
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
        slug: string;
        variants?: any[]; // For finding variant details
    };
    variantId?: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchCart: () => Promise<void>;
    addItem: (productId: string, quantity?: number, variantId?: string) => Promise<void>;
    removeItem: (productId: string, variantId?: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number, variantId?: string) => Promise<void>;
    clearCart: () => Promise<void>;

    // Local Helpers
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,
            error: null,

            fetchCart: async () => {
                set({ isLoading: true });
                try {
                    const response = await api.get("/cart");
                    set({ items: response.data.cart.items, error: null });
                } catch (err: any) {
                    set({ error: err.response?.data?.message || "Failed to fetch cart" });
                } finally {
                    set({ isLoading: false });
                }
            },

            addItem: async (productId, quantity = 1, variantId) => {
                try {
                    const response = await api.post("/cart", { productId, variantId, quantity });
                    set({ items: response.data.cart.items });
                } catch (err: any) {
                    console.error("Failed to add to cart:", err);
                }
            },

            removeItem: async (productId, variantId) => {
                try {
                    const response = await api.delete("/cart/item", { data: { productId, variantId } });
                    set({ items: response.data.cart.items });
                } catch (err: any) {
                    console.error("Failed to remove from cart:", err);
                }
            },

            updateQuantity: async (productId, quantity, variantId) => {
                try {
                    const response = await api.put("/cart/item", { productId, variantId, quantity });
                    set({ items: response.data.cart.items });
                } catch (err: any) {
                    console.error("Failed to update quantity:", err);
                }
            },

            clearCart: async () => {
                try {
                    await api.delete("/cart");
                    set({ items: [] });
                } catch (err: any) {
                    console.error("Failed to clear cart:", err);
                }
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
            },
        }),
        {
            name: "genesis-cart-storage",
        }
    )
);
