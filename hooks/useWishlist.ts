import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

import { Product } from "@/types/product";

export type WishlistItem = Product;

export const useWishlist = () => {
    return useQuery({
        queryKey: ["wishlist"],
        queryFn: async () => {
            const response = await api.get("/wishlist");
            return (response.data.wishlist || []) as WishlistItem[];
        },
    });
};

export const useToggleWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            const response = await api.get("/wishlist");
            const currentItems = (response.data.wishlist || []) as WishlistItem[];
            const isIn = currentItems.some((item) => item._id === productId);

            if (isIn) {
                return api.delete(`/wishlist/${productId}`);
            } else {
                return api.post("/wishlist", { productIdOrSlug: productId });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        },
    });
};

export const useClearWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            return api.delete("/wishlist");
        },
        onSuccess: () => {
            queryClient.setQueryData(["wishlist"], []);
        },
    });
};
