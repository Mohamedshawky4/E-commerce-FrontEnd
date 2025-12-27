import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Product } from "@/types/product";

export const useProduct = (idOrSlug: string) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!idOrSlug) return;

        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/products/${idOrSlug}`);
                setProduct(response.data.product);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || "Failed to fetch product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [idOrSlug]);

    return { product, loading, error };
};
