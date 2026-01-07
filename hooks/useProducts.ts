import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Product } from "@/types/product";

interface Pagination {
  page: number;
  pages: number;
  total: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProductsResponse {
  products: Product[];
  pagination?: Pagination;
}

export const useProducts = (params: Record<string, any> = {}, enabled = true) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await api.get("/products", { params });
      const data = response.data;

      // Map backend pagination structure if necessary
      // Assuming backend might use different names, but based on PaginationButton, we need page, pages, hasNextPage, hasPrevPage
      const rawPagination = data.pagination || {};
      const pagination: Pagination = {
        page: rawPagination.currentPage || rawPagination.page || 1,
        pages: rawPagination.totalPages || rawPagination.pages || 1,
        total: rawPagination.total || 0,
        limit: rawPagination.limit || 12,
        hasNextPage: rawPagination.hasNextPage || (rawPagination.currentPage || rawPagination.page) < (rawPagination.totalPages || rawPagination.pages),
        hasPrevPage: rawPagination.hasPrevPage || (rawPagination.currentPage || rawPagination.page) > 1,
      };

      return {
        products: data.products || [],
        pagination,
      } as ProductsResponse;
    },
    enabled,
  });
};

export const useFeaturedProducts = (endpoint: string) => {
  return useQuery({
    queryKey: ["products", "featured", endpoint],
    queryFn: async () => {
      const response = await api.get(endpoint);
      const data = response.data;
      return (data.products || data.relatedProducts || []) as Product[];
    },
    enabled: !!endpoint,
  });
};

export const useSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: ["products", "suggestions", query],
    queryFn: async () => {
      if (query.trim().length <= 1) return [];
      const { data } = await api.get(`/products/suggestions?q=${query}`);
      return (data.products || []) as Product[];
    },
    enabled: query.trim().length > 1,
    staleTime: 30 * 1000, // 30 seconds for suggestions
  });
};
