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
    { id: "featured", label: "FEATURED_COLLECTION", endpoint: "/products?sort=-price&limit=8", linkHref: "/products" },
    { id: "new", label: "NEW_TECH_PROTOCOLS", endpoint: "/products?sort=-createdAt&limit=8", linkHref: "/new-arrivals" },
    { id: "top", label: "ELITE_TIER_ASSETS", endpoint: "/products?sort=-averageRating&limit=8" },
];

const TabbedProductShowcase: React.FC = () => {
    const [activeTabId, setActiveTabId] = useState(tabs[0].id);
    const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

    const { data: products, isLoading } = useFeaturedProducts(activeTab.endpoint);

    return (
        <section className="py-24 md:py-32 w-full flex flex-col items-center overflow-hidden relative bg-surface/5">
            {/* Monolith Texture Backdrop */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3 RIGHT%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="w-full max-w-[1600px] px-6 md:px-12 mb-20">
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-12">
                    <div className="space-y-6">
                        <div className="h-px w-12 bg-primary" />
                        <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter uppercase leading-none">
                            SIGNATURE<br />
                            <span className="text-text-muted">DISCOVERY</span>
                        </h2>

                        {/* Precision Tab Bar */}
                        <div className="flex gap-8 mt-12 bg-white/5 p-1 rounded-sm border border-white/5">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTabId(tab.id)}
                                    className={`
                                        relative px-4 py-2 text-[9px] font-black uppercase tracking-[0.4em] transition-all duration-300
                                        ${activeTabId === tab.id ? "text-primary bg-white/5" : "text-text-muted hover:text-foreground"}
                                    `}
                                >
                                    {activeTabId === tab.id && (
                                        <m.div
                                            layoutId="precisionUnderline"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                        />
                                    )}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab.linkHref && (
                        <Link
                            href={activeTab.linkHref}
                            className="group flex items-center gap-4 text-[9px] font-black tracking-[0.3em] uppercase text-text-muted hover:text-primary transition-colors border border-white/10 px-6 py-3 rounded-sm hover:bg-white/5"
                        >
                            ACCESS_FULL_VAULT
                            <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>
            </div>

            <div className="relative w-full max-w-[1600px] px-4 md:px-8">
                {/* Haptic Navigation Handles */}
                <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-30 pointer-events-none w-full flex justify-between pr-8 md:pr-16">
                    <button className="nav-prev-tabbed pointer-events-auto h-16 w-10 bg-white/5 flex items-center justify-center text-foreground hover:bg-primary hover:text-black transition-all border border-white/10">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="nav-next-tabbed pointer-events-auto h-16 w-10 bg-white/5 flex items-center justify-center text-foreground hover:bg-primary hover:text-black transition-all border border-white/10">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="min-h-[400px]">
                    <Swiper
                        key={activeTabId}
                        modules={[Navigation, Autoplay]}
                        navigation={{
                            prevEl: ".nav-prev-tabbed",
                            nextEl: ".nav-next-tabbed",
                        }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        spaceBetween={32}
                        slidesPerView={1.2}
                        centeredSlides={true}
                        breakpoints={{
                            640: { slidesPerView: 2.5, centeredSlides: false },
                            1024: { slidesPerView: 4, centeredSlides: false },
                            1280: { slidesPerView: 5, centeredSlides: false },
                        }}
                        className="!px-6 md:!px-12 pb-12"
                    >
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <SwiperSlide key={`skel-${i}`} className="flex justify-center">
                                    <ProductCardSkeleton />
                                </SwiperSlide>
                            ))
                        ) : (
                            products?.map((p: Product) => (
                                <SwiperSlide key={p._id} className="flex justify-center h-full">
                                    <ProductCard product={p} />
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default TabbedProductShowcase;
