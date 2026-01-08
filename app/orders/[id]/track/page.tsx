"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Package,
    ChevronLeft,
    MapPin,
    Calendar,
    Truck,
    CheckCircle2,
    Clock,
    Box,
    CornerDownRight,
    ShieldCheck
} from "lucide-react";
import { useOrderDetails } from "@/hooks/useOrders";
import { useShipment } from "@/hooks/useOrders";
import Button from "@/components/Button";
import { useAuthStore } from "@/stores/useAuthStore";
import { m } from "framer-motion";

const TrackShipmentPage = () => {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    const { token } = useAuthStore();

    // We fetch order details first to get the shipment ID (if linked) 
    // or just use the order status if no separate shipment record exists yet.
    const { data: order, isLoading: orderLoading } = useOrderDetails(orderId);

    // In a real scenario, the order might have a list of shipments. 
    // For now, we'll assume a 1:1 or use placeholders if data is missing.
    const { data: shipment, isLoading: shipmentLoading } = useShipment(order?.status === 'shipped' || order?.status === 'delivered' ? 'placeholder' : '');

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (mounted && !token) {
            router.push(`/login?redirect=/orders/${orderId}/track`);
        }
    }, [token, mounted, router, orderId]);

    if (!mounted || !token) return null;

    if (orderLoading) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12 text-center">
                <h2 className="text-3xl font-black text-metal mb-4">ORDER NOT FOUND</h2>
                <Button onClick={() => router.push("/orders")}>BACK TO ORDERS</Button>
            </div>
        );
    }

    const steps = [
        { id: 'pending', label: 'Order Placed', icon: <Package size={20} />, active: true },
        { id: 'processing', label: 'Processing', icon: <Clock size={20} />, active: ['processing', 'shipped', 'delivered'].includes(order.status) },
        { id: 'shipped', label: 'In Transit', icon: <Truck size={20} />, active: ['shipped', 'delivered'].includes(order.status) },
        { id: 'delivered', label: 'Delivered', icon: <CheckCircle2 size={20} />, active: order.status === 'delivered' }
    ];

    const activeIndex = steps.filter(s => s.active).length - 1;

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                {/* Navigation */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-primary text-[10px] font-black tracking-widest uppercase mb-8 hover:opacity-70 transition-opacity"
                >
                    <ChevronLeft size={16} />
                    BACK TO DETAILS
                </button>

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 text-primary text-[10px] font-black tracking-[0.3em] uppercase mb-4">
                        <MapPin size={14} />
                        <span>Real-time Tracking</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-metal tracking-tighter leading-none mb-6">
                        SHIPMENT<span className="text-primary text-glow">STATUS</span>
                    </h1>
                    <div className="flex flex-wrap gap-4">
                        <div className="glass-card border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                            <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Order</span>
                            <span className="text-sm font-black text-metal">#{order.orderNumber}</span>
                        </div>
                        {order.status === 'shipped' && (
                            <div className="glass-card border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-2 bg-primary/5">
                                <span className="text-[10px] font-bold text-primary/50 uppercase tracking-widest">Tracking</span>
                                <span className="text-sm font-black text-primary">TRK-88291029</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="glass-card border border-white/5 rounded-[2.5rem] bg-white/[0.02] p-8 md:p-12 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-secondary/50 opacity-20" />

                    <div className="relative flex justify-between items-center mb-12">
                        {/* Connecting Line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <m.div
                                className="h-full bg-primary shadow-[0_0_15px_var(--primary)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                            />
                        </div>

                        {/* Step Nodes */}
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative z-10 flex flex-col items-center">
                                <m.div
                                    className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${step.active
                                        ? 'bg-primary text-background shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]'
                                        : 'bg-surface border border-white/10 text-foreground/20'
                                        }`}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: idx * 0.2 }}
                                >
                                    {step.icon}
                                </m.div>
                                <div className="absolute top-full mt-4 whitespace-nowrap">
                                    <p className={`text-[10px] md:text-[12px] font-black uppercase tracking-widest ${step.active ? 'text-foreground' : 'text-foreground/20'}`}>
                                        {step.label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tracking Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Courier Info */}
                    <div className="glass-card border border-white/5 rounded-3xl p-8 bg-white/[0.01]">
                        <h3 className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-6 flex items-center gap-2">
                            <Truck size={14} />
                            Delivery Courier
                        </h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <Box size={24} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-xl font-black text-metal">SPECTRA LOGISTICS</p>
                                <p className="text-xs text-foreground/40 font-medium tracking-wide">Elite Delivery Service</p>
                            </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-foreground/30 uppercase tracking-widest">Weight</span>
                                <span className="text-sm font-medium">1.2 KG</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-foreground/30 uppercase tracking-widest">Service</span>
                                <span className="text-sm font-medium">Next Day Air</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="glass-card border border-white/5 rounded-3xl p-8 bg-white/[0.01]">
                        <h3 className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-6 flex items-center gap-2">
                            <Calendar size={14} />
                            Timeline Highlights
                        </h3>
                        <div className="space-y-6">
                            <div className="flex gap-4 relative">
                                <div className="absolute left-[7px] top-6 bottom-[-1.5rem] w-[2px] bg-white/5" />
                                <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)] mt-1" />
                                <div>
                                    <p className="text-xs font-black text-metal uppercase tracking-tight">Out for Delivery</p>
                                    <p className="text-[10px] text-foreground/40 font-medium mt-1">Today, 09:42 AM</p>
                                </div>
                            </div>
                            <div className="flex gap-4 relative">
                                <div className="absolute left-[7px] top-6 bottom-[-1.5rem] w-[2px] bg-white/5" />
                                <div className="w-4 h-4 rounded-full bg-white/10 mt-1" />
                                <div>
                                    <p className="text-xs font-black text-foreground/60 uppercase tracking-tight">Arrived at Sorting Facility</p>
                                    <p className="text-[10px] text-foreground/40 font-medium mt-1">Jan 07, 2026 - 11:15 PM</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-4 h-4 rounded-full bg-white/10 mt-1" />
                                <div>
                                    <p className="text-xs font-black text-foreground/60 uppercase tracking-tight">Order Packed</p>
                                    <p className="text-[10px] text-foreground/40 font-medium mt-1">Jan 07, 2026 - 02:30 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Assurance */}
                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 p-8 glass-card border border-white/5 rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-metal uppercase tracking-tight">Spectra Protection</p>
                            <p className="text-[10px] text-foreground/40 font-medium max-w-xs">Your package is insured and monitored 24/7 until it reaches your doorstep.</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-[10px] font-black tracking-widest border-white/10">
                        NEED HELP?
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TrackShipmentPage;
