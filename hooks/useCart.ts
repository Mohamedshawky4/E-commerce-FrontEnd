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
