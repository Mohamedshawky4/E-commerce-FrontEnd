"use client";
import React from "react";
import Image from "next/image";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Hero = () => {
    const router = useRouter();

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
            {/* Dynamic Background with Mesh Gradient */}
            <div className="absolute inset-0 bg-background">
                <div className="absolute inset-0 opacity-40" style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, var(--liquid-mesh-1) 0%, transparent 50%),
                                     radial-gradient(circle at 80% 80%, var(--liquid-mesh-2) 0%, transparent 50%),
                                     radial-gradient(circle at 40% 20%, var(--liquid-mesh-1) 0%, transparent 50%)`
                }} />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">

                        {/* Content - Left Side */}
                        <div className="lg:col-span-6 space-y-10">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="space-y-8"
                            >
                                {/* Eyebrow */}
                                <div className="flex items-center gap-3">
                                    <div className="h-px w-12 bg-gradient-to-r from-primary to-transparent" />
                                    <span className="text-sm font-bold tracking-[0.2em] text-primary uppercase">Premium Collection</span>
                                </div>

                                {/* Headline */}
                                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
                                    <span className="block text-foreground">Elevate Your</span>
                                    <span className="block bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                                        Lifestyle
                                    </span>
                                </h1>

                                {/* Description */}
                                <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-lg">
                                    Discover our handpicked selection of premium products. Quality meets innovation in every piece.
                                </p>

                                {/* CTA */}
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Button
                                        variant="liquid"
                                        size="lg"
                                        onClick={() => router.push("/products")}
                                        className="h-14 px-10 text-base font-bold rounded-xl"
                                    >
                                        Explore Collection
                                    </Button>
                                    <Button
                                        variant="metal"
                                        size="lg"
                                        className="h-14 px-10 text-base font-bold rounded-xl"
                                    >
                                        Learn More
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Trust Indicators */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="flex flex-wrap gap-8 pt-6 border-t border-white/5"
                            >
                                <div className="space-y-1">
                                    <div className="text-2xl font-black text-foreground">10K+</div>
                                    <div className="text-xs text-text-muted uppercase tracking-wider">Products</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl font-black text-foreground">99%</div>
                                    <div className="text-xs text-text-muted uppercase tracking-wider">Satisfaction</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl font-black text-foreground">24/7</div>
                                    <div className="text-xs text-text-muted uppercase tracking-wider">Support</div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Image - Right Side */}
                        <div className="lg:col-span-6">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative"
                            >
                                {/* Main Image Container */}
                                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden group">
                                    <Image
                                        src="/images/product.jpg"
                                        alt="Featured Product"
                                        fill
                                        className="object-cover transition-all duration-700 group-hover:scale-105"
                                        priority
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent" />

                                    {/* Floating Info Card */}
                                    <div className="absolute bottom-8 left-8 right-8 glass-card p-6 border-white/10 backdrop-blur-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Featured Item</div>
                                                <div className="text-xl font-bold text-foreground">Premium Collection</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Rating</div>
                                                <div className="text-xl font-bold text-primary">4.9★</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                                    <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-[120px]" />
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]" />
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>
    );
};

export default Hero;
