import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Product, ProductVariant } from "@/types/product";

export interface CartItem {
    _id: string;
    product: Product;
    variantId?: string;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
}

export const useCart = () => {
    return useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const response = await api.get("/cart");
            return response.data.cart as Cart;
        },
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, quantity = 1, variantId }: { productId: string; quantity?: number; variantId?: string }) => {
            const response = await api.post("/cart", { productId, variantId, quantity });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["cart"], data.cart);
        },
    });
};

export const useUpdateCartQuantity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, quantity, variantId }: { productId: string; quantity: number; variantId?: string }) => {
            const response = await api.put("/cart/item", { productId, variantId, quantity });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["cart"], data.cart);
        },
    });
};

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, variantId }: { productId: string; variantId?: string }) => {
            const response = await api.delete("/cart/item", { data: { productId, variantId } });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["cart"], data.cart);
        },
    });
};

export const useClearCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await api.delete("/cart");
            return response.data;
        },
        onSuccess: () => {
            queryClient.setQueryData(["cart"], { items: [] });
        },
    });
};

export const useApplyCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ code, cartTotal }: { code: string; cartTotal: number }) => {
            const response = await api.post("/coupons/validate", { code, cartTotal });
            return response.data;
        },
        onSuccess: (data) => {
            // Usually we'd update a "checkout" or "cartExtras" query if it existed,
            // but for now we'll just return it and let the component handle it or 
            // we can store it in a local query if needed.
            // Since coupons are usually validated against a specific cart.
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        }
    });
};

export const useApplyGiftCard = () => {
    return useMutation({
        mutationFn: async ({ code }: { code: string }) => {
            const response = await api.post("/gift-cards/check", { code });
            return response.data;
        }
    });
};

// Selection Helpers
export const selectCartTotals = (cart: Cart | undefined, coupon?: any, giftCard?: any, shippingFee = 50) => {
    if (!cart) return { subtotal: 0, itemsCount: 0, total: 0 };

    const subtotal = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const itemsCount = cart.items.reduce((total, item) => total + item.quantity, 0);

    const discount = coupon?.discountAmount || 0;
    const giftCardApplied = giftCard?.appliedAmount || 0;
    const total = Math.max(0, subtotal - discount - giftCardApplied + shippingFee);

    return { subtotal, itemsCount, total };
};

