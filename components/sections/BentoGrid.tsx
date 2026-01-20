"use client";
import React from "react";
import SpotlightCard from "../ui/SpotlightCard";
import { ShieldCheck, Truck, Headphones, RefreshCcw, Star } from "lucide-react";

const BentoGrid = () => {
    return (
        <section className="py-24 px-6 md:px-12 w-full max-w-[1600px] mx-auto">
            <div className="mb-16 text-center md:text-left">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-foreground to-foreground/40 inline-block">
                    Why Choose Us
                </h2>
                <div className="h-2 w-24 bg-primary mt-4 rounded-full md:mx-0 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 min-h-[600px]">
                {/* Large Main Feature */}
                <SpotlightCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-primary/5 border-primary/10">
                    <div className="h-full flex flex-col justify-between p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-8 shadow-[0_0_30px_-5px_var(--primary)] backdrop-blur-md border border-primary/20">
                                <ShieldCheck size={40} />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Secure & Encrypted</h3>
                            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-md">
                                Top-tier 256-bit encryption ensures your data is fortress-secure.
                                We prioritize your privacy with banking-grade security protocols.
                            </p>
                        </div>
                        {/* Decoration */}
                        <div className="absolute right-[-10%] bottom-[-10%] w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
                        <div className="absolute top-10 right-10 opacity-20 rotate-12">
                            <ShieldCheck size={200} />
                        </div>
                    </div>
                </SpotlightCard>

                {/* Support */}
                <SpotlightCard className="col-span-1 md:col-span-1 row-span-1 group">
                    <div className="h-full p-8 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Headphones size={100} />
                        </div>
                        <Headphones className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-500" />
                        <h3 className="text-2xl font-bold mb-3">24/7 Support</h3>
                        <p className="text-muted-foreground">Expert assistance available around the clock.</p>
                    </div>
                </SpotlightCard>

                {/* Delivery */}
                <SpotlightCard className="col-span-1 md:col-span-1 row-span-1 group">
                    <div className="h-full p-8 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Truck size={100} />
                        </div>
                        <Truck className="w-12 h-12 text-primary mb-4 group-hover:translate-x-2 transition-transform duration-500" />
                        <h3 className="text-2xl font-bold mb-3">Turbo Delivery</h3>
                        <p className="text-muted-foreground">Global shipping with real-time GPS tracking.</p>
                    </div>
                </SpotlightCard>

                {/* Returns - Wide */}
                <SpotlightCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1">
                    <div className="h-full p-8 flex flex-row items-center gap-8 relative overflow-hidden">
                        <div className="shrink-0 w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center border border-white/5">
                            <RefreshCcw className="w-8 h-8 text-foreground" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-2">30-Day Happiness Guarantee</h3>
                            <p className="text-muted-foreground text-lg">Not in love? Return it hassle-free. No questions asked.</p>
                        </div>
                        <div className="absolute right-[-20px] top-[-20px] opacity-5 rotate-45">
                            <RefreshCcw size={150} />
                        </div>
                    </div>
                </SpotlightCard>

                {/* Quality */}
                <SpotlightCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-linear-to-br from-card to-background border-white/5">
                    <div className="h-full p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 relative z-10">
                            <div className="flex gap-1 text-amber-500">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="currentColor" size={24} className="drop-shadow-md" />)}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Premium Quality</h3>
                                <p className="text-muted-foreground text-lg">Certified 5-star ratings from 50k+ users.</p>
                            </div>
                        </div>
                        <div className="hidden md:flex w-32 h-32 bg-primary/10 rounded-full relative items-center justify-center">
                            <div className="text-4xl font-black text-primary">A+</div>
                            <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-[spin_15s_linear_infinite_reverse] scale-75" />
                        </div>
                    </div>
                </SpotlightCard>

            </div>
        </section>
    );
};

export default BentoGrid;
