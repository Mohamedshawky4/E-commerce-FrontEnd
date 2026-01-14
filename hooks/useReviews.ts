import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
        avatar?: string;
    };
    product: string;
    rating: number;
    comment: string;
    likes: string[];
    createdAt: string;
}

export const useProductReviews = (productIdOrSlug: string) => {
    return useQuery({
        queryKey: ["reviews", "product", productIdOrSlug],
        queryFn: async () => {
            const { data } = await api.get(`/reviews/product/${productIdOrSlug}`);
            return data.reviews as Review[];
        },
        enabled: !!productIdOrSlug,
    });
};

export const useAddReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newReview: { product: string; rating: number; comment: string }) => {
            const { data } = await api.post("/reviews", newReview);
            return data.review;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["reviews", "product", variables.product] });
            queryClient.invalidateQueries({ queryKey: ["product", variables.product] });
        },
    });
};

export const useToggleLikeReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (reviewId: string) => {
            const { data } = await api.post(`/reviews/${reviewId}/like`);
            return data;
        },
        onSuccess: (_, reviewId) => {
            // This is tricky as we don't know the product ID here to invalidate precisely
            // but we can invalidate all reviews or hope the user refetch
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        },
    });
};
