"use client";

import React, { useEffect } from "react";
import { m } from "framer-motion";
import { ShieldAlert, RefreshCw, Home } from "lucide-react";
import Button from "@/components/Button";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 blur-[150px] rounded-full pointer-events-none" />

            <m.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 text-center space-y-8"
            >
                <m.div variants={itemVariants} className="flex justify-center">
                    <div className="relative">
                        <m.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="p-8 rounded-[2.5rem] glass-card border-rose-500/20 bg-rose-500/5"
                        >
                            <ShieldAlert size={80} className="text-rose-500 filter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                        </m.div>
                        <div className="absolute inset-0 bg-rose-500/40 blur-3xl opacity-20 -z-10 animate-pulse" />
                    </div>
                </m.div>

                <m.div variants={itemVariants} className="space-y-4">
                    <h1 className="text-6xl md:text-7xl font-black text-metal tracking-tighter italic leading-none">
                        CRITICAL <span className="text-rose-500">EXCEPTION</span>
                    </h1>
                    <p className="text-[10px] font-black tracking-[0.5em] uppercase text-rose-500/60">
                        Operational Flow Disrupted: Node Unstable
                    </p>
                </m.div>

                <div className="max-w-md mx-auto p-4 glass-card bg-white/5 border-white/5 text-left mb-8">
                    <p className="text-[10px] font-black text-white/30 tracking-widest uppercase mb-2">Error Log Trace:</p>
                    <code className="text-xs text-rose-400 font-mono break-all opacity-80">
                        {error.message || "An unexpected neural disruption occurred in the Nexus core."}
                    </code>
                </div>

                <m.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button
                        variant="liquid"
                        size="lg"
                        onClick={() => reset()}
                        leftIcon={<RefreshCw size={18} />}
                        className="px-10 font-black tracking-widest h-14 bg-rose-600 hover:bg-rose-500"
                    >
                        REINITIALIZE NODE
                    </Button>
                    <Link href="/">
                        <Button
                            variant="ghost"
                            size="lg"
                            leftIcon={<Home size={18} />}
                            className="px-10 font-black tracking-widest text-foreground/50 hover:text-foreground h-14"
                        >
                            EXIT TO MAIN DECK
                        </Button>
                    </Link>
                </m.div>
            </m.div>

            {/* Background text decoration */}
            <div className="absolute bottom-10 left-10 text-[10vw] font-black text-white/5 pointer-events-none select-none italic tracking-tighter">
                FAILURE
            </div>
        </div>
    );
}
