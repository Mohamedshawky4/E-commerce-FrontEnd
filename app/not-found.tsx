"use client";

import React from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import Button from "@/components/Button";

const NotFound = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden px-6">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />

            <m.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 text-center space-y-8"
            >
                <m.div variants={itemVariants} className="flex justify-center">
                    <div className="relative">
                        <m.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="p-8 rounded-[2.5rem] glass-card border-white/10 bg-white/5"
                        >
                            <AlertTriangle size={80} className="text-primary text-glow" />
                        </m.div>
                        <div className="absolute inset-0 bg-primary/40 blur-3xl opacity-20 -z-10 animate-pulse" />
                    </div>
                </m.div>

                <m.div variants={itemVariants} className="space-y-4">
                    <h1 className="text-8xl font-black text-metal tracking-tighter italic leading-none">
                        404: <span className="text-primary text-glow">VOID</span>
                    </h1>
                    <p className="text-[10px] font-black tracking-[0.5em] uppercase text-primary/60">
                        System Failure: Sector Not Found
                    </p>
                </m.div>

                <m.p variants={itemVariants} className="max-w-md mx-auto text-foreground/40 font-medium leading-relaxed italic">
                    The requested coordinates do not exist in the SPECTRA Nexus. Possible signal corruption or unauthorized traversal detected.
                </m.p>

                <m.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link href="/">
                        <Button variant="liquid" size="lg" leftIcon={<Home size={18} />} className="px-10 font-black tracking-widest h-14">
                            RETURN TO BASE
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => window.history.back()}
                        leftIcon={<ArrowLeft size={18} />}
                        className="px-10 font-black tracking-widest text-foreground/50 hover:text-foreground h-14"
                    >
                        RETRACE VECTOR
                    </Button>
                </m.div>
            </m.div>

            {/* Grid decoration */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-10 pointer-events-none" />
        </div>
    );
};

export default NotFound;
