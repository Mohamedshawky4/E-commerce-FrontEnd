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
            // We can optimize this by checking cache first or just letting the backend handle it
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

export const useIsInWishlist = (productId: string) => {
    const { data: wishlist = [] } = useWishlist();
    return wishlist.some((item) => item._id === productId);
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

