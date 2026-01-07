import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Product } from "@/types/product";

export const useProduct = (idOrSlug: string) => {
    return useQuery({
        queryKey: ["product", idOrSlug],
        queryFn: async () => {
            if (!idOrSlug) return null;
            const response = await api.get(`/products/${idOrSlug}`);
            return response.data.product as Product;
        },
        enabled: !!idOrSlug,
    });
};
