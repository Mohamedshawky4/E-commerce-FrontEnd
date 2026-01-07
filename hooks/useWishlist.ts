import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface WishlistItem {
    _id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
    discountedPrice?: number;
    discountPercent?: number;
    stock: number;
    variants?: any[];
    averageRating?: number;
}

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
            const currentItems = response.data.wishlist || [];
            const isIn = currentItems.some((item: any) => item._id === productId);

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
