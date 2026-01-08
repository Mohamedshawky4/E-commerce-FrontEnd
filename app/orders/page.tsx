"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, MapPin, Calendar, CreditCard, ExternalLink, Box } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import Button from "@/components/Button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

const OrderHistoryPage = () => {
    const { data: orders = [], isLoading } = useOrders();
    const { token } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (mounted && !token) {
            router.push("/login?redirect=/orders");
        }
    }, [token, mounted, router]);

    if (!mounted || !token) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
            case "shipped": return "text-sky-500 bg-sky-500/10 border-sky-500/20";
            case "processing": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
            case "cancelled": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
            default: return "text-primary bg-primary/10 border-primary/20";
        }
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 text-primary text-[10px] font-black tracking-[0.3em] uppercase mb-4">
                            <Box size={14} className="text-primary" />
                            <span>Your Purchases</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-metal tracking-tighter leading-none mb-4">
                            ORDER<span className="text-primary text-glow">HISTORY</span>
                        </h1>
                        <p className="text-foreground/50 max-w-lg">
                            Track your deliveries and review your past tech investments.
                        </p>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-48 rounded-3xl glass-card animate-pulse bg-white/5" />
                        ))}
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="group relative overflow-hidden rounded-[2rem] glass-card border border-white/5 bg-white/[0.02] p-6 md:p-8 hover:bg-white/[0.04] transition-all duration-500"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-primary/10" />

                                <div className="relative flex flex-col lg:flex-row gap-8">
                                    {/* Order Info */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className="px-4 py-1.5 rounded-full glass-card border border-white/10 text-[10px] font-black tracking-widest text-foreground/70 uppercase">
                                                #{order.orderNumber}
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 p-2 rounded-xl bg-white/5 border border-white/10">
                                                    <Calendar size={14} className="text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Placed On</p>
                                                    <p className="text-sm font-medium">{new Date(order.placedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 p-2 rounded-xl bg-white/5 border border-white/10">
                                                    <CreditCard size={14} className="text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Total Amount</p>
                                                    <p className="text-xl font-black text-metal">${order.totalAmount.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 p-2 rounded-xl bg-white/5 border border-white/10">
                                                    <Package size={14} className="text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Items</p>
                                                    <p className="text-sm font-medium">{order.items.reduce((acc, item) => acc + item.quantity, 0)} Units</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product Preview */}
                                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex-shrink-0 w-16 h-16 rounded-2xl glass-card border border-white/10 bg-surface flex items-center justify-center p-2">
                                                    {/* Placeholder for images if available later */}
                                                    <Box size={24} className="text-white/20" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Hooks */}
                                    <div className="lg:w-64 flex flex-col justify-between gap-4">
                                        <Link href={`/orders/${order._id}`} className="block w-full">
                                            <Button
                                                variant="liquid"
                                                className="w-full h-14 text-[10px] font-black tracking-widest"
                                                rightIcon={<ChevronRight size={16} />}
                                            >
                                                VIEW DETAILS
                                            </Button>
                                        </Link>
                                        {order.status !== "pending" && order.status !== "cancelled" && (
                                            <Link href={`/orders/${order._id}/track`} className="block w-full">
                                                <Button
                                                    variant="outline"
                                                    className="w-full h-14 text-[10px] font-black tracking-widest border-white/5 group-hover:border-primary/50"
                                                    leftIcon={<MapPin size={16} />}
                                                >
                                                    TRACK SHIPMENT
                                                </Button>
                                            </Link>
                                        )}
                                        {/* Add Download Invoice Link if relevant */}
                                        <a href={`${process.env.NEXT_PUBLIC_API_URL}/orders/${order._id}/invoice`} target="_blank" rel="noopener noreferrer">
                                            <button className="w-full flex items-center justify-center gap-2 text-[10px] font-bold text-foreground/40 hover:text-primary transition-colors py-2">
                                                <ExternalLink size={12} />
                                                DOWNLOAD INVOICE
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center mb-8 border-white/5">
                            <Box size={40} className="text-white/10" />
                        </div>
                        <h2 className="text-3xl font-black text-metal mb-4 uppercase tracking-tighter">No orders found</h2>
                        <p className="text-foreground/40 mb-10 max-w-sm">
                            You haven't placed any orders yet. Start exploring our latest tech releases!
                        </p>
                        <Link href="/products">
                            <Button variant="liquid" size="lg" leftIcon={<ChevronRight size={18} />}>
                                START SHOPPING
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
