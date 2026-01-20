"use client";
import React, { useState } from "react";
import ProductCard from "../ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import ProductCardSkeleton from "../ProductCardSkeleton";
import { Product } from "@/types/product";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { m, AnimatePresence } from "framer-motion";

interface Tab {
    id: string;
    label: string;
    endpoint: string;
    linkHref?: string;
}

const tabs: Tab[] = [
    { id: "featured", label: "Featured", endpoint: "/products?sort=-price&limit=8", linkHref: "/products" },
    { id: "new", label: "New Arrivals", endpoint: "/products?sort=-createdAt&limit=8", linkHref: "/new-arrivals" },
    { id: "top", label: "Best Sellers", endpoint: "/products?sort=-averageRating&limit=8" },
];

const TabbedProductShowcase: React.FC = () => {
    const [activeTabId, setActiveTabId] = useState(tabs[0].id);
    const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

    const { data: products, isLoading } = useFeaturedProducts(activeTab.endpoint);

    const loading = isLoading;

    return (
        <section className="py-32 w-full flex flex-col items-center overflow-hidden relative">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="w-full max-w-[1600px] px-6 md:px-12 mb-16">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-b from-foreground to-foreground/40 tracking-tighter uppercase mb-6">
                            Curated For You
                        </h2>

                        {/* Glass Tabs */}
                        <div className="flex flex-wrap gap-2 p-1.5 rounded-full bg-foreground/5 backdrop-blur-md border border-white/5 inline-flex">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTabId(tab.id)}
                                    className={`
                        relative px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500
                        ${activeTabId === tab.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}
                        `}
                                >
                                    {activeTabId === tab.id && (
                                        <m.div
                                            layoutId="activeTabGlow"
                                            className="absolute inset-0 bg-primary rounded-full shadow-[0_0_20px_-5px_var(--primary)]"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* View All Link */}
                    {activeTab.linkHref && (
                        <Link
                            href={activeTab.linkHref}
                            className="hidden md:flex group items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors"
                        >
                            View Collection
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    )}
                </div>
            </div>

            <div className="relative w-full max-w-[1600px] px-4 md:px-8">
                {/* Navigation Buttons */}
                <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-30 pointer-events-none w-full flex justify-between pr-8 md:pr-16">
                    <button className="nav-prev-tabbed pointer-events-auto w-12 h-12 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all active:scale-95 disabled:opacity-0 cursor-pointer">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="nav-next-tabbed pointer-events-auto w-12 h-12 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all active:scale-95 disabled:opacity-0 cursor-pointer">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="min-h-[400px]">
                    {/* Key changes to force re-render of swiper when tab changes */}
                    <Swiper
                        key={activeTabId}
                        modules={[Navigation, Autoplay]}
                        navigation={{
                            prevEl: ".nav-prev-tabbed",
                            nextEl: ".nav-next-tabbed",
                        }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        spaceBetween={24}
                        slidesPerView={1.2}
                        centeredSlides={true}
                        loop={false}
                        breakpoints={{
                            640: { slidesPerView: 2.5, centeredSlides: false },
                            1024: { slidesPerView: 4, centeredSlides: false },
                            1280: { slidesPerView: 5, centeredSlides: false, spaceBetween: 32 },
                        }}
                        className="px-4! md:px-12! pb-12!"
                    >
                        {loading &&
                            Array.from({ length: 5 }).map((_, i) => (
                                <SwiperSlide key={`skeleton-${i}`} className="flex justify-center">
                                    <ProductCardSkeleton />
                                </SwiperSlide>
                            ))}

                        {!loading &&
                            products?.map((p: Product) => (
                                <SwiperSlide key={p._id} className="flex justify-center h-full">
                                    <ProductCard product={p} />
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default TabbedProductShowcase;
