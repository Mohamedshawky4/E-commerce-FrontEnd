"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import api from "@/lib/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import ProductCardSkeleton from "../ProductCardSkeleton";

import { Product } from "@/types/product";

interface ProductSectionProps {
    title: string;
    endpoint?: string;
    products?: Product[];
    linkHref?: string;
    autoplay?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
    title,
    endpoint,
    products: initialProducts,
    linkHref,
    autoplay = true,
}) => {
    const [products, setProducts] = useState<Product[]>(initialProducts || []);
    const [loading, setLoading] = useState(!initialProducts?.length);

    // Create a unique ID for navigation classes
    const sectionId = title.toLowerCase().replace(/\s+/g, '-');

    useEffect(() => {
        const fetchData = async () => {
            if (!endpoint) return;
            try {
                const response = await api.get(endpoint);
                const data = response.data;
                const fetchedProducts = data.products || data.relatedProducts || [];
                setProducts(fetchedProducts);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (!initialProducts?.length) {
            fetchData();
        }
    }, [endpoint, initialProducts]);

    return (
        <section className="py-16 w-full flex flex-col items-center overflow-hidden">
            {/* Header */}
            <div className="flex w-full max-w-[1600px] px-6 md:px-12 justify-between items-end mb-12">
                <div className="space-y-1">
                    <div className="w-12 h-1 bg-primary rounded-full opacity-50" />
                    <h2 className="text-4xl md:text-5xl font-black text-metal tracking-tighter uppercase">{title}</h2>
                </div>
                {linkHref && (
                    <Link
                        href={linkHref}
                        className="text-xs font-black tracking-[0.3em] uppercase text-primary hover:text-foreground transition-colors pb-1 border-b border-primary/20 hover:border-primary"
                    >
                        Explore All →
                    </Link>
                )}
            </div>

            <div className="relative w-full max-w-[1600px] px-4 md:px-8">
                {/* Custom Navigation Buttons */}
                <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-30 pointer-events-none w-full flex justify-between pr-8 md:pr-16">
                    <button className={`nav-prev-${sectionId} pointer-events-auto glass-card h-14 w-14 flex items-center justify-center text-foreground hover:text-primary transition-all rounded-full group active:scale-90 disabled:opacity-0`}>
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button className={`nav-next-${sectionId} pointer-events-auto glass-card h-14 w-14 flex items-center justify-center text-foreground hover:text-primary transition-all rounded-full group active:scale-90 disabled:opacity-0`}>
                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <Swiper
                    modules={[Navigation, Autoplay]}
                    navigation={{
                        prevEl: `.nav-prev-${sectionId}`,
                        nextEl: `.nav-next-${sectionId}`,
                    }}
                    autoplay={autoplay ? { delay: 4000, disableOnInteraction: false } : false}
                    spaceBetween={32}
                    slidesPerView={1.2}
                    centeredSlides={true}
                    loop={(products?.length || 0) > 5}
                    breakpoints={{
                        640: { slidesPerView: 3, centeredSlides: false, spaceBetween: 24 },
                        1024: { slidesPerView: 4, centeredSlides: false, spaceBetween: 24 },
                        1280: { slidesPerView: 5, centeredSlides: false, spaceBetween: 32 },
                        1536: { slidesPerView: 5, centeredSlides: false, spaceBetween: 32 },
                    }}
                    className="!px-6 md:!px-12 !pb-12"
                >
                    {/* Skeleton slides */}
                    {loading &&
                        Array.from({ length: 6 }).map((_, i) => (
                            <SwiperSlide key={i} className="flex justify-center">
                                <ProductCardSkeleton />
                            </SwiperSlide>
                        ))}

                    {/* Real products */}
                    {!loading &&
                        products.map((p) => (
                            <SwiperSlide key={p._id} className="flex justify-center h-full">
                                <ProductCard product={p} />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
        </section>
    );
};

export default ProductSection;
