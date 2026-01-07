"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";

import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, X } from "lucide-react";
import Button from "@/components/Button";
import { useCartStore } from "@/stores/cartStore";

import { useCart, useUpdateCartQuantity, useRemoveFromCart, useClearCart } from "@/hooks/useCart";

const CartPage = () => {
    const { data: cartData, isLoading } = useCart();
    const items = cartData?.items || [];
    const { mutate: updateQuantity } = useUpdateCartQuantity();
    const { mutate: removeItem } = useRemoveFromCart();
    const {
        getSubtotal, getTotalPrice,
        coupon, giftCard, applyCoupon, applyGiftCard, removeCoupon, removeGiftCard
    } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [applying, setApplying] = useState(false);


    useEffect(() => {
        setMounted(true);
    }, []);

    if (isLoading && items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <m.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pt-8 pb-0 ">
            <m.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-12"
            >
                <h1 className="text-5xl font-black text-metal tracking-tighter uppercase">
                    Your Cargo
                </h1>
                <div className="w-20 h-1.5 bg-primary mt-4 rounded-full opacity-60 shadow-[0_0_15px_rgba(0,242,254,0.5)]" />
            </m.div>

            {items.length === 0 ? (
                <m.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-20 text-center space-y-8"
                >
                    <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                        <ShoppingBag size={48} className="text-foreground/20" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-black text-metal tracking-tight uppercase">SYSTEM EMPTY</h2>
                        <p className="text-foreground/40 uppercase tracking-widest text-[10px]">No items detected in your spatial inventory.</p>
                    </div>
                    <Link href="/products" className="inline-block">
                        <Button variant="liquid" size="lg" className="px-10 font-black tracking-widest">
                            BROWSE NEXUS
                        </Button>
                    </Link>
                </m.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {items.map((item, index) => (
                                <m.div
                                    key={item._id || item.product._id || index}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass-card p-6 flex items-center gap-6 group hover:border-primary/30 transition-all duration-300"
                                >
                                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden glass-card border-white/10">
                                        <Image
                                            src={(item.product?.images && item.product.images[0]) || "/images/product.jpg"}
                                            alt={item.product?.name || "Product Identity"}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <h3 className="text-lg font-bold text-metal tracking-tight group-hover:text-primary transition-colors">
                                            {item.product.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {item.variantId && item.product.variants && (
                                                <>
                                                    {(() => {
                                                        const variant = item.product.variants.find(v => v._id === item.variantId);
                                                        if (!variant) return null;
                                                        return (
                                                            <>
                                                                {variant.size && (
                                                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 glass-card border-primary/20 text-primary">
                                                                        Size: {variant.size}
                                                                    </span>
                                                                )}
                                                                {variant.color && (
                                                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 glass-card border-primary/20 text-primary">
                                                                        Color: {variant.color}
                                                                    </span>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </>
                                            )}
                                        </div>
                                        <p className="text-sm font-black text-primary text-glow">${item.product.price}</p>
                                    </div>

                                    <div className="flex items-center gap-4 py-2 px-4 rounded-xl bg-foreground/5 border border-white/5">
                                        <button
                                            onClick={() => updateQuantity({ productId: item.product._id, quantity: Math.max(1, item.quantity - 1), variantId: item.variantId })}
                                            className="hover:text-primary transition-colors disabled:opacity-20"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-xs font-black min-w-[20px] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity({ productId: item.product._id, quantity: item.quantity + 1, variantId: item.variantId })}
                                            className="hover:text-primary transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeItem({ productId: item.product._id, variantId: item.variantId })}
                                        className="p-3 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all text-foreground/30"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </m.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-10 space-y-8 sticky top-28"
                        >
                            <h2 className="text-2xl font-black text-metal tracking-tighter uppercase">Summary</h2>

                            {/* Promo Code Input */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black tracking-widest text-foreground/40 uppercase">HAVE A PROMO CODE?</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        placeholder="CODE"
                                        className="flex-1 bg-foreground/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-black tracking-widest focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={async () => {
                                            setApplying(true);
                                            try {
                                                if (promoCode.startsWith('GC-')) {
                                                    await applyGiftCard(promoCode);
                                                } else {
                                                    await applyCoupon(promoCode);
                                                }
                                                setPromoCode("");
                                            } catch (err) { }
                                            setApplying(false);
                                        }}
                                        isLoading={applying}
                                        className="border border-white/10"
                                    >
                                        APPLY
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex justify-between text-xs font-black tracking-widest text-foreground/40 uppercase">
                                    <span>Subtotal</span>
                                    <span className="text-foreground">${mounted ? getSubtotal().toFixed(2) : "0.00"}</span>
                                </div>

                                {coupon && (
                                    <div className="flex justify-between text-xs font-black tracking-widest text-primary uppercase">
                                        <div className="flex items-center gap-2">
                                            <span>Coupon ({coupon.code})</span>
                                            <button onClick={removeCoupon} className="hover:text-rose-500"><X size={12} /></button>
                                        </div>
                                        <span>-${coupon.discountAmount.toFixed(2)}</span>
                                    </div>
                                )}

                                {giftCard && (
                                    <div className="flex justify-between text-xs font-black tracking-widest text-primary uppercase">
                                        <div className="flex items-center gap-2">
                                            <span>Gift Card ({giftCard.code})</span>
                                            <button onClick={removeGiftCard} className="hover:text-rose-500"><X size={12} /></button>
                                        </div>
                                        <span>-${giftCard.appliedAmount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-xs font-black tracking-widest text-foreground/40 uppercase">
                                    <span>Shipment Fee</span>
                                    <span className="text-foreground">$50.00</span>
                                </div>
                                <div className="h-[1px] bg-white/10 my-4" />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black tracking-widest uppercase">Total Amount</span>
                                    <span className="text-3xl font-black text-primary text-glow">${mounted ? getTotalPrice().toFixed(2) : "0.00"}</span>
                                </div>
                            </div>


                            <Link href="/checkout" className="block">
                                <Button
                                    variant="liquid"
                                    size="lg"
                                    fullWidth
                                    className="py-5 font-black tracking-[0.2em]"
                                    rightIcon={<ArrowRight size={20} />}
                                >
                                    CHECKOUT
                                </Button>
                            </Link>

                            <div className="pt-4 border-t border-white/5 space-y-3">
                                <p className="text-[10px] font-bold text-foreground/30 uppercase text-center tracking-[0.2em]">Secure Transaction Node</p>
                                <div className="flex justify-center gap-4 opacity-30">
                                    {/* Logos placeholder */}
                                    <div className="w-8 h-5 bg-white rounded-sm" />
                                    <div className="w-8 h-5 bg-white rounded-sm" />
                                    <div className="w-8 h-5 bg-white rounded-sm" />
                                </div>
                            </div>
                        </m.div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
