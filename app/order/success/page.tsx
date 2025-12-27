"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Home, RefreshCw } from "lucide-react";
import Button from "@/components/Button";
import Link from "next/link";

const SuccessContent = () => {
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const id = searchParams.get("id") || searchParams.get("order_id"); // Fallback for Paymob/Stripe params
        setOrderId(id);
    }, [searchParams]);

    if (!mounted) return null;

    return (
        <div className="container mx-auto px-4 py-12  flex flex-col items-center justify-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-lg text-center space-y-10"
            >
                {/* Success Icon with Glow */}
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
                    <motion.div
                        initial={{ rotate: -180, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="relative z-10 w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,242,254,0.6)]"
                    >
                        <CheckCircle2 size={48} className="text-background" />
                    </motion.div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl font-black text-metal tracking-tighter uppercase">Nexus Verified</h1>
                    <p className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Transmission Complete</p>
                </div>

                <div className="glass-card p-10 space-y-4 bg-white/5 border-white/10">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Order Identifier</p>
                        <p className="text-xl font-bold font-mono tracking-tight text-metal truncate">
                            {orderId || "PROCESSING..."}
                        </p>
                    </div>
                    <p className="text-sm text-foreground/60 leading-relaxed">
                        Your order has been successfully logged into the nexus. Our automated logistics drones are preparing your delivery vector.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/" className="w-full sm:w-auto">
                        <Button
                            variant="metal"
                            size="lg"
                            className="px-10 font-black tracking-widest"
                            rightIcon={<Home size={18} />}
                        >
                            Return Home
                        </Button>
                    </Link>
                    <Link href="/products" className="w-full sm:w-auto">
                        <Button
                            variant="liquid"
                            size="lg"
                            className="px-10 font-black tracking-widest"
                            rightIcon={<ChevronRight size={18} />}
                        >
                            CONTINUE BROWSE
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

const OrderSuccessPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <RefreshCw className="animate-spin text-primary" size={40} />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
};

export default OrderSuccessPage;
