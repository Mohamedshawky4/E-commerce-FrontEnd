import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Product } from "@/types/product";

export type ProductQueryParams = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;

  // ⬇️ change these to allow arrays
  category?: string | string[];
  brand?: string | string[];
  size?: string | string[];
  color?: string | string[];

  minPrice?: number;
  maxPrice?: number;
  discounted?: boolean;
  rating?: number;
  hasStock?: boolean;
  fields?: string;
};

export type Pagination = {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🧠 auto-convert arrays → comma-separated lists
  const normalizeParams = (params: ProductQueryParams) => {
    const normalized: Record<string, any> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        normalized[key] = value.join(",");
      } else {
        normalized[key] = value;
      }
    });

    return normalized;
  };

  const fetchProducts = async (params: ProductQueryParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const normalizedParams = normalizeParams(params);

      const response = await api.get("/products", {
        params: normalizedParams,
      });

      const data = response.data;

      setProducts(data.products || []);
      setPagination(data.pagination || null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, pagination, loading, error, fetchProducts };
};
