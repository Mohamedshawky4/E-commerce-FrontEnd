import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Category } from "@/types/category";

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await api.get("/categories");
            return response.data.categories as Category[];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes (categories change less often)
    });
};
