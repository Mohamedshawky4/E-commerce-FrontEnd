"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import api from "@/lib/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import ProductCardSkeleton from "../ProductCardSkeleton";

interface Product {
  _id: string;
  name: string;
  images?: string[];
  price: number;
  discountPercent?: number;
  discountedPrice?: number;
  averageRating?: number;
  slug?: string;
  categories?: { _id: string; name: string; slug: string }[];
}

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

  useEffect(() => {
    const fetchData = async () => {
      if (!endpoint) return;
      try {
        const response = await api.get(endpoint);
        setProducts(response.data.products);
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
    <section className="py-12 w-full flex flex-col items-center mb-8">
      {/* Header */}
      <div className="flex w-full max-w-7xl px-6 sm:px-8 justify-between items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        {linkHref && (
          <Link
            href={linkHref}
            className="text-primary font-medium hover:underline hover:text-primary/80 transition"
          >
            See More →
          </Link>
        )}
      </div>

      <div className="relative w-full max-w-7xl px-2 sm:px-6">
        {/* Custom Navigation Buttons */}
        <button className="swiper-button-prev-custom absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full opacity-60 shadow-lg hover:opacity-100 p-3 hover:bg-primary hover:text-white transition">
          <ChevronLeft size={22} />
        </button>
        <button className="swiper-button-next-custom absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full opacity-60 shadow-lg hover:opacity-100 p-3 hover:bg-primary hover:text-white transition">
          <ChevronRight size={22} />
        </button>

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          autoplay={autoplay ? { delay: 3500, disableOnInteraction: false } : false}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
            1280: { slidesPerView: 5, spaceBetween: 30 },
          }}
          className="pb-10"
        >
          {/* Skeleton slides */}
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <SwiperSlide key={i} className="flex justify-center">
                <ProductCardSkeleton />
              </SwiperSlide>
            ))}

          {/* Real products */}
          {!loading &&
            products.map((p) => (
              <SwiperSlide key={p._id} className="flex justify-center">
                <ProductCard product={p} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductSection;
