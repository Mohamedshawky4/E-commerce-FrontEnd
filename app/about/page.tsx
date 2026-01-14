"use client";

import React from "react";
import { m } from "framer-motion";
import { Shield, Target, Users, Zap } from "lucide-react";

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Hero section */}
                <div className="text-center mb-24">
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-primary/20 text-primary text-[10px] font-black tracking-[0.3em] uppercase mb-6"
                    >
                        <Zap size={12} className="text-primary animate-pulse" />
                        <span>The Genesis Protocol</span>
                    </m.div>
                    <m.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black text-metal tracking-tighter leading-none mb-8"
                    >
                        FORGING THE <span className="text-primary text-glow">FUTURE</span>
                    </m.h1>
                    <m.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-foreground/50 max-w-2xl mx-auto text-lg leading-relaxed font-medium"
                    >
                        SPECTRA is not just a marketplace. We are a digital nexus where elite craftsmanship meets cutting-edge technology.
                    </m.p>
                </div>

                {/* Values grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {[
                        {
                            icon: Target,
                            title: "Our Mission",
                            desc: "To synchronize global creators with enthusiasts of high-fidelity digital and physical assets.",
                            color: "blue"
                        },
                        {
                            icon: Shield,
                            title: "Absolute Integrity",
                            desc: "Every item in the vault undergoes strict verification protocols to ensure peak excellence.",
                            color: "emerald"
                        },
                        {
                            icon: Users,
                            title: "Community Driven",
                            desc: "Spectra belongs to the visionaries. Your input shapes the evolution of the protocol.",
                            color: "purple"
                        }
                    ].map((value, i) => (
                        <m.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-10 border-white/5 bg-white/2 hover:bg-white/4 transition-all duration-500 group"
                        >
                            <div className={`p-4 rounded-2xl bg-${value.color}-500/10 w-fit mb-6 group-hover:scale-110 transition-transform`}>
                                <value.icon size={28} className={value.color === 'blue' ? 'text-blue-500' : value.color === 'emerald' ? 'text-emerald-500' : 'text-purple-500'} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">{value.title}</h3>
                            <p className="text-foreground/40 leading-relaxed">{value.desc}</p>
                        </m.div>
                    ))}
                </div>

                {/* Narrative section */}
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <m.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl font-black text-metal tracking-tighter uppercase underline decoration-primary/30 decoration-8 underline-offset-8">The Spectra Ethos</h2>
                        <div className="space-y-6 text-foreground/50 leading-relaxed font-medium">
                            <p>
                                Founded in 2024, SPECTRA emerged from the need for a retail experience that respects the technical complexity of modern hardware while celebrating the artistic soul of design.
                            </p>
                            <p>
                                We believe that the tools we use define the boundaries of what we can create. By providing a curated showcase of elite hardware and software nodes, we empower the next generation of engineers, artists, and architects.
                            </p>
                        </div>
                    </m.div>
                    <m.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative aspect-video rounded-3xl overflow-hidden glass-card border-white/10"
                    >
                        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-secondary/20" />
                        <div className="absolute inset-0 flex items-center justify-center p-12">
                            <Zap size={120} className="text-white/5 animate-pulse" />
                        </div>
                        {/* Futuristic overlay elements */}
                        <div className="absolute top-4 right-4 p-4 border-l border-t border-primary/30 w-24 h-24" />
                        <div className="absolute bottom-4 left-4 p-4 border-r border-b border-primary/30 w-24 h-24" />
                    </m.div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
