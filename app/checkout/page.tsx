"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";

import { CreditCard, Truck, ShieldCheck, Wallet, ArrowLeft } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import api from "@/lib/axios";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const CheckoutPage = () => {
    const router = useRouter();
    const { items, getTotalPrice, getSubtotal, clearCart, coupon, giftCard } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    const [method, setMethod] = useState<"card" | "wallet" | "cod">("card");
    const [provider, setProvider] = useState<"paymob" | "stripe" | "cod">("paymob");

    const [shippingData, setShippingData] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Egypt",
    });

    useEffect(() => {
        if (items.length === 0) {
            router.push("/cart");
        }
    }, [items, router]);

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        try {
            // 1. Create Order
            const orderResponse = await api.post("/orders", {
                cartItems: items.map(item => ({
                    productId: item.product._id,
                    quantity: item.quantity
                })),
                shippingAddress: shippingData,
                paymentMethod: method === "cod" ? "COD" : "Online",
                couponCode: coupon?.code,
                giftCardCode: giftCard?.code,
            });


            const orderId = orderResponse.data.order._id;

            // 2. Initiate Payment
            const paymentResponse = await api.post("/payments", {
                orderId,
                provider,
                method,
            });

            if (provider === "paymob" && paymentResponse.data.iframeUrl) {
                window.location.href = paymentResponse.data.iframeUrl;
            } else if (provider === "stripe" && paymentResponse.data.clientSecret) {
                // Here you would normally use Stripe SDK to open the checkout
                // For now, let's pretend it redirects or we just simulated success
                toast.info("Stripe Payment Hub Authorized. Redirecting to secure gateway...");
                // router.push(`/checkout/stripe?secret=${paymentResponse.data.clientSecret}`);
            } else if (provider === "cod") {
                await clearCart();
                router.push(`/order/success?id=${String(orderId)}`);
            }
        } catch (error: any) {
            console.error("Order failed:", error);
            toast.error(error.response?.data?.message || "Authorization failed. Check nexus link status.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="container mx-auto px-4 py-12 ">
            <m.button
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 text-[10px] font-black tracking-widest text-foreground/40 hover:text-primary transition-all uppercase"
            >
                <ArrowLeft size={14} /> Back to Nexus
            </m.button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Information Flow */}
                <div className="space-y-12">
                    <m.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl font-black text-metal tracking-tighter uppercase mb-2">Checkout Node</h1>
                        <p className="text-[10px] font-black text-foreground/30 tracking-[0.3em] uppercase">Phase 3: Final Authorization</p>
                    </m.div>

                    {/* Shipping Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Truck className="text-primary" size={20} />
                            <h2 className="text-sm font-black tracking-[0.2em] uppercase">Shipping Vector</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Input label="Street Address" placeholder="Sector 7G, Industrial Zone" value={shippingData.street} onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })} />
                            </div>
                            <Input label="City" placeholder="Neo Cairo" value={shippingData.city} onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })} />
                            <Input label="Postal Code" placeholder="112233" value={shippingData.postalCode} onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })} />
                        </div>
                    </div>

                    {/* Payment Provider Selection */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-primary" size={20} />
                            <h2 className="text-sm font-black tracking-[0.2em] uppercase">Payment Protocol</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: "paymob", label: "Paymob", icon: CreditCard },
                                { id: "stripe", label: "Stripe", icon: CreditCard },
                                { id: "cod", label: "COD", icon: Wallet },
                            ].map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        setProvider(p.id as any);
                                        if (p.id === "cod") setMethod("cod"); else setMethod("card");
                                    }}
                                    className={`glass-card p-6 flex flex-col items-center gap-3 transition-all duration-300 border ${provider === p.id ? "border-primary bg-primary/10" : "border-white/5 hover:border-white/20"}`}
                                >
                                    <p.icon className={provider === p.id ? "text-primary" : "text-foreground/40"} />
                                    <span className={`text-[10px] font-black tracking-widest uppercase ${provider === p.id ? "text-primary" : "text-foreground/40"}`}>{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summarized Breakdown */}
                <div className="lg:pl-8">
                    <div className="glass-card p-10 space-y-10 relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16" />

                        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-foreground/40">Manifest Items</h3>
                            {items.map((item, index) => (
                                <div key={item._id || `${item.product._id}-${item.variantId || index}`} className="flex justify-between items-center bg-white/5 p-4 rounded-xl">

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-white/10">
                                            <Image src={(item.product.images && item.product.images[0]) || "/images/product.jpg"} alt={item.product.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold truncate max-w-[150px]">{item.product.name}</p>
                                            <p className="text-[10px] text-primary font-black">QTY: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs font-black">${(item.product.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-xs font-black tracking-widest text-foreground/40 uppercase">
                                <span>Subtotal</span>
                                <span>${getSubtotal().toFixed(2)}</span>
                            </div>
                            {coupon && (
                                <div className="flex justify-between text-xs font-black tracking-widest text-primary uppercase">
                                    <span>Coupon ({coupon.code})</span>
                                    <span>-${coupon.discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            {giftCard && (
                                <div className="flex justify-between text-xs font-black tracking-widest text-primary uppercase">
                                    <span>Gift Card ({giftCard.code})</span>
                                    <span>-${giftCard.appliedAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xs font-black tracking-widest text-foreground/40 uppercase">
                                <span>Shipment Fee</span>
                                <span>$50.00</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <span className="text-xs font-black text-foreground/40 uppercase tracking-widest">Total Valuation</span>
                                <span className="text-4xl font-black text-primary text-glow">${getTotalPrice().toFixed(2)}</span>
                            </div>

                            <Button
                                onClick={handlePlaceOrder}
                                variant="liquid"
                                size="lg"
                                fullWidth
                                isLoading={isLoading}
                                className="py-6 font-black tracking-[0.3em] text-[12px]"
                                rightIcon={<ShieldCheck size={18} />}
                            >
                                CONFIRM ORDER
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
