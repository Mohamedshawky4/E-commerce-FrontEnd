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
    coupon: {
        code: string;
        discountAmount: number;
    } | null;
    giftCard: {
        code: string;
        balance: number;
        appliedAmount: number;
    } | null;
    shippingFee: number;

    // Actions
    fetchCart: () => Promise<void>;
    addItem: (productId: string, quantity?: number, variantId?: string) => Promise<void>;
    removeItem: (productId: string, variantId?: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number, variantId?: string) => Promise<void>;
    clearCart: () => Promise<void>;
    applyCoupon: (code: string) => Promise<void>;
    applyGiftCard: (code: string) => Promise<void>;
    removeCoupon: () => void;
    removeGiftCard: () => void;

    // Local Helpers
    getTotalItems: () => number;
    getSubtotal: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,
            error: null,
            coupon: null,
            giftCard: null,
            shippingFee: 50,

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
                    set({ items: [], coupon: null, giftCard: null });
                } catch (err: any) {
                    console.error("Failed to clear cart:", err);
                }
            },

            applyCoupon: async (code) => {
                set({ isLoading: true });
                try {
                    const cartTotal = get().getSubtotal();
                    const response = await api.post("/coupons/validate", { code, cartTotal });
                    set({
                        coupon: {
                            code: response.data.code,
                            discountAmount: response.data.discountAmount
                        },
                        error: null
                    });
                } catch (err: any) {
                    set({ error: err.response?.data?.message || "Invalid coupon" });
                    throw err;
                } finally {
                    set({ isLoading: false });
                }
            },

            applyGiftCard: async (code) => {
                set({ isLoading: true });
                try {
                    const response = await api.post("/gift-cards/check", { code });
                    const balance = response.data.balance;
                    const subtotal = get().getSubtotal();
                    const afterCoupon = subtotal - (get().coupon?.discountAmount || 0);
                    const appliedAmount = Math.min(balance, afterCoupon);

                    set({
                        giftCard: {
                            code: response.data.code,
                            balance,
                            appliedAmount
                        },
                        error: null
                    });
                } catch (err: any) {
                    set({ error: err.response?.data?.message || "Invalid gift card" });
                    throw err;
                } finally {
                    set({ isLoading: false });
                }
            },

            removeCoupon: () => set({ coupon: null }),
            removeGiftCard: () => set({ giftCard: null }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
            },

            getTotalPrice: () => {
                const subtotal = get().getSubtotal();
                const discount = get().coupon?.discountAmount || 0;
                const giftCardApplied = get().giftCard?.appliedAmount || 0;
                return Math.max(0, subtotal - discount - giftCardApplied + get().shippingFee);
            },
        }),
        {
            name: "genesis-cart-storage",
        }
    )
);
