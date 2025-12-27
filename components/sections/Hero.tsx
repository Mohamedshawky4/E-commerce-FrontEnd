"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import Button from "../Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingCart, Star, Zap, ChevronRight, Activity } from "lucide-react";
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";

interface Product {
    _id: string;
    name: string;
    images?: string[];
    price: number;
    discountPercent?: number;
    discountedPrice?: number;
    averageRating?: number;
    slug?: string;
    brand?: string;
}

// --- NEURAL PARTICLE FIELD ---
const NeuralParticles = ({ mouseX, mouseY }: { mouseX: any; mouseY: any }) => {
    const particles = useMemo(() => [...Array(40)].map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5
    })), []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        y: ["0%", "100%"],
                        x: [`${p.x}%`, `${p.x + (Math.random() - 0.5) * 10}%`]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                    style={{
                        position: "absolute",
                        left: `${p.x}%`,
                        top: `-10%`,
                        width: p.size,
                        height: p.size,
                        backgroundColor: "var(--primary)",
                        borderRadius: "50%",
                        filter: "blur(1px)",
                        boxShadow: "0 0 10px var(--primary)"
                    }}
                />
            ))}
        </div>
    );
};

const Hero = () => {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // --- MOUSE TRACKING ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 50, stiffness: 200, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // --- PARALLAX & TRANSFORMATIONS ---
    const bgX = useTransform(springX, [-100, 100], [25, -25]);
    const bgY = useTransform(springY, [-100, 100], [25, -25]);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const response = await api.get("/products?sort=-averageRating&limit=5");
                setProducts(response.data.products || []);
            } catch (error) {
                console.error("Failed to fetch products for Hero:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopProducts();

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 200;
            const y = (e.clientY / innerHeight - 0.5) * 200;
            mouseX.set(x);
            mouseY.set(y);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    useEffect(() => {
        if (products.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % products.length);
        }, 7000);
        return () => clearInterval(interval);
    }, [products]);

    return (
        <section
            ref={containerRef}
            className="relative w-full  flex items-center overflow-hidden bg-[#030303] selection:bg-primary selection:text-black"
        >
            {/* --- ADVANCED NEURAL BACKGROUND --- */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-[-15%]">
                    <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[200px] animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '2s' }} />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[80px_80px]" />
                </motion.div>
                <NeuralParticles mouseX={mouseX} mouseY={mouseY} />
                <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_0%,#030303_90%)" />
            </div>

            <div className="container mx-auto px-6 lg:px-20 xl:px-32 relative z-10 w-full">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-32 items-center">

                    {/* --- CONTENT LAYER --- */}
                    <div className="lg:col-span-6 space-y-16">
                        <div className="space-y-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="inline-flex items-center gap-4 px-6  rounded-full border border-white/5 bg-white/2 backdrop-blur-3xl shadow-2xl"
                            >
                                <Activity size={12} className="text-primary animate-pulse" />
                                <span className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase">Neural Network Active</span>
                            </motion.div>

                            <h1 className="text-8xl md:text-[10rem] xl:text-[12rem] font-black leading-[0.78] tracking-tighter flex flex-col perspective-1000">
                                <motion.span
                                    initial={{ opacity: 0, rotateX: 90 }}
                                    animate={{ opacity: 1, rotateX: 0 }}
                                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-white relative"
                                >
                                    ELITE
                                    <span className="absolute inset-0 text-primary/10 blur-sm translate-x-1 translate-y-1">ELITE</span>
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3, duration: 1.2 }}
                                    className="italic bg-linear-to-r from-primary via-white to-secondary bg-clip-text text-transparent"
                                >
                                    RETAIL
                                </motion.span>
                            </h1>

                            <div className="text-xl text-white/20 leading-relaxed max-w-lg font-medium border-l border-primary/20 pl-10 ml-2 relative overflow-hidden group">
                                <span className="relative z-10">The Genesis Vault offers a <span className="text-white">hand-picked selection</span> of the world's most exclusive digital assets.</span>
                                <motion.div
                                    animate={{ left: ["-100%", "200%"] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-y-0 w-32 bg-linear-to-r from-transparent via-primary/5 to-transparent skew-x-12"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-10">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    variant="liquid"
                                    size="lg"
                                    onClick={() => router.push("/products")}
                                    className="h-[80px] px-16 group relative overflow-hidden ring-1 ring-white/10"
                                >
                                    <span className="relative z-10 text-[11px] font-black tracking-[0.6em] uppercase">Enter Showcase</span>
                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <ArrowRight className="ml-4 group-hover:translate-x-3 transition-transform duration-700 text-primary" size={20} />
                                </Button>
                            </motion.div>

                            <div className="flex gap-10 items-center opacity-40 hover:opacity-100 transition-opacity duration-500">
                                <div className="h-10 w-px bg-white/10" />
                                <div className="space-y-1">
                                    <div className="text-2xl font-black text-white">$4.2M+</div>
                                    <div className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Inventory Locked</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- BOUTIQUE STACK SHOWCASE --- */}
                    <div className="lg:col-span-6 h-[650px] lg:h-[800px] flex items-center justify-center relative">
                        {loading ? (
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin shadow-[0_0_20px_rgba(var(--primary),0.3)]" />
                                <span className="text-[10px] font-black tracking-[0.6em] text-white/20 uppercase animate-pulse">Synchronizing Data</span>
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Atmospheric Orbs */}
                                <div className="absolute w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />

                                {/* 3D Stacked Carousel */}
                                <div className="relative w-[380px] h-[520px] perspective-2000">
                                    <AnimatePresence mode="popLayout">
                                        {products.map((prod, i) => {
                                            const relativeIndex = (i - activeIndex + products.length) % products.length;
                                            if (relativeIndex > 2) return null;

                                            return (
                                                <motion.div
                                                    key={prod._id}
                                                    initial={{ opacity: 0, x: 100, rotateY: 30, z: -200 }}
                                                    animate={{
                                                        opacity: 1 - relativeIndex * 0.35,
                                                        scale: 1 - relativeIndex * 0.08,
                                                        x: relativeIndex * 50,
                                                        z: relativeIndex * -80,
                                                        y: relativeIndex * -30,
                                                        rotateY: -20 + relativeIndex * 8,
                                                        rotateX: relativeIndex * 2
                                                    }}
                                                    exit={{ opacity: 0, x: -150, rotateY: -60, scale: 0.6 }}
                                                    transition={{ type: "spring", stiffness: 120, damping: 25 }}
                                                    style={{ zIndex: 10 - relativeIndex, position: "absolute", inset: 0 }}
                                                    className="group cursor-pointer"
                                                    onClick={() => router.push(`/products/${prod.slug}`)}
                                                >
                                                    <div className="relative w-full h-full rounded-[3rem] bg-[#080808] border border-white/[0.07] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.9)] transition-all duration-700 hover:border-primary/50 ring-1 ring-white/5">
                                                        {/* Product Visual */}
                                                        <div className="absolute inset-0">
                                                            <Image
                                                                src={prod.images?.[0] || "/images/product.jpg"}
                                                                alt={prod.name}
                                                                fill
                                                                className="object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-1000 group-hover:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/10 to-black/95" />
                                                        </div>

                                                        {/* Advanced Micro-UI */}
                                                        <div className="absolute inset-0 p-10 flex flex-col justify-between">
                                                            <div className="flex justify-between items-start">
                                                                <div className="px-4 py-1.5 bg-primary/10 backdrop-blur-2xl rounded-full border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                                                                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Verified Elite</span>
                                                                </div>
                                                                <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white/10 group-hover:text-primary group-hover:bg-primary/5 transition-all duration-700">
                                                                    <Star size={20} className={prod.averageRating ? "fill-primary/20 text-primary" : ""} />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-6">
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="h-px w-6 bg-primary/40" />
                                                                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">{prod.brand || "GENESIS"}</span>
                                                                    </div>
                                                                    <h2 className="text-4xl font-black text-white tracking-tighter leading-[0.9]">{prod.name}</h2>
                                                                </div>

                                                                <div className="flex justify-between items-center pt-2">
                                                                    <div className="space-y-1">
                                                                        <span className="text-[10px] font-black text-white/15 uppercase tracking-[0.3em]">Value</span>
                                                                        <span className="text-3xl font-black text-primary font-mono block">${prod.price}</span>
                                                                    </div>
                                                                    <motion.div
                                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                                        className="w-14 h-14 rounded-3xl bg-primary flex items-center justify-center text-black shadow-[0_0_40px_rgba(var(--primary),0.5)] group-hover:animate-pulse"
                                                                    >
                                                                        <ShoppingCart size={24} />
                                                                    </motion.div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Scanning Refraction Beam */}
                                                        <motion.div
                                                            animate={{ top: ["-10%", "110%"] }}
                                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                                            className="absolute inset-x-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent blur-[1px] opacity-0 group-hover:opacity-100"
                                                        />
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>

                                {/* Dynamic Stats */}
                                <div className="absolute top-1/2 left-[-100px] -translate-y-1/2 space-y-8">
                                    {[
                                        { label: "Market Load", value: "High", icon: Activity },
                                        { label: "Sync Latency", value: "0.2ms", icon: Zap }
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1.5 + i * 0.2 }}
                                            className="py-2 px-6 border-l-2 border-primary/20 bg-white/2 backdrop-blur-xl group hover:border-primary transition-colors"
                                        >
                                            <div className="flex items-center gap-3 mb-1">
                                                <stat.icon size={10} className="text-primary/40 group-hover:text-primary transition-colors" />
                                                <div className="text-[8px] font-black tracking-[0.3em] text-white/10 uppercase">{stat.label}</div>
                                            </div>
                                            <div className="text-xs font-black text-white font-mono group-hover:text-primary transition-colors">{stat.value}</div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Progress Indicator */}
                                <div className="absolute top-1/2 -right-16 -translate-y-1/2 flex flex-col gap-4">
                                    {products.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-1 h-1 rounded-full transition-all duration-700 ${i === activeIndex ? "bg-primary h-8" : "bg-white/10"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Neural Scroll hint */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
                <div className="h-20 w-px bg-white/5 relative overflow-hidden">
                    <motion.div
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-10 bg-linear-to-b from-transparent via-primary to-transparent"
                    />
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-[9px] font-black tracking-[1em] text-white/10 uppercase">Synchronize Down</span>
                    <ChevronRight size={12} className="text-white/10 animate-pulse" />
                </div>
            </div>
        </section>
    );
};

export default Hero;
