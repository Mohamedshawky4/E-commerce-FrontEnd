"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";

import { CreditCard, Truck, ShieldCheck, Wallet, ArrowLeft, MapPin, Check } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import api from "@/lib/axios";
import { useCart, useClearCart, selectCartTotals, useApplyCoupon, useApplyGiftCard } from "@/hooks/useCart";
import { useUserAddresses } from "@/hooks/useUser";
import { toast } from "sonner";
import { AxiosError } from "axios";

const CheckoutPage = () => {
    const router = useRouter();
    const { data: cart } = useCart();
    const { mutate: clearCart } = useClearCart();
    const { mutateAsync: validateCoupon } = useApplyCoupon();
    const { mutateAsync: validateGiftCard } = useApplyGiftCard();
    const { data: addresses = [] } = useUserAddresses();

    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [coupon, setCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
    const [giftCard, setGiftCard] = useState<{ code: string; balance: number; appliedAmount: number } | null>(null);
    const [couponInput, setCouponInput] = useState("");
    const [giftCardInput, setGiftCardInput] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [isApplyingGiftCard, setIsApplyingGiftCard] = useState(false);

    const [shippingData, setShippingData] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Egypt",
    });

    const { itemsCount, subtotal, total } = selectCartTotals(cart, coupon, giftCard);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [method, setMethod] = useState<"card" | "wallet" | "cod">("card");
    const [provider, setProvider] = useState<"paymob" | "stripe" | "cod">("paymob");

    useEffect(() => {
        if (mounted && cart && cart.items.length === 0) {
            router.push("/cart");
        }
    }, [cart, router, mounted]);

    const handlePlaceOrder = async () => {
        if (!cart) return;
        setIsLoading(true);
        try {
            const orderResponse = await api.post("/orders", {
                cartItems: cart.items.map(item => ({
                    productId: item.product._id,
                    quantity: item.quantity
                })),
                shippingAddress: shippingData,
                paymentMethod: method === "cod" ? "COD" : "Online",
                couponCode: coupon?.code,
                giftCardCode: giftCard?.code,
            });

            const orderId = orderResponse.data.order._id;

            const paymentResponse = await api.post("/payments", {
                orderId,
                provider,
                method,
            });

            if (provider === "paymob" && paymentResponse.data.iframeUrl) {
                window.location.href = paymentResponse.data.iframeUrl;
            } else if (provider === "stripe" && paymentResponse.data.clientSecret) {
                toast.info("Stripe Payment Hub Authorized. Redirecting to secure gateway...");
            } else if (provider === "cod") {
                clearCart();
                router.push(`/order/success?id=${String(orderId)}`);
            }
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err.response?.data?.message || "Authorization failed. Check nexus link status.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectAddress = (address: any) => {
        setShippingData({
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
        });
        toast.success("Shipping vector synchronized with address book.");
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
                <div className="space-y-12">
                    <m.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl font-black text-metal tracking-tighter uppercase mb-2">Checkout Node</h1>
                        <p className="text-[10px] font-black text-foreground/30 tracking-[0.3em] uppercase">Phase 3: Final Authorization</p>
                    </m.div>

                    {/* Address Picker */}
                    {addresses.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <MapPin className="text-primary" size={20} />
                                <h2 className="text-sm font-black tracking-[0.2em] uppercase">Select Saved Vector</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {addresses.map((addr: any) => (
                                    <button
                                        key={addr._id}
                                        onClick={() => handleSelectAddress(addr)}
                                        className={`glass-card p-4 text-left transition-all border ${shippingData.street === addr.street ? "border-primary bg-primary/5" : "border-white/5 hover:border-white/10"}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{addr.isDefault ? "Primary Node" : "Archive Node"}</span>
                                            {shippingData.street === addr.street && <Check size={14} className="text-primary" />}
                                        </div>
                                        <p className="text-xs font-bold truncate">{addr.street}</p>
                                        <p className="text-[10px] text-foreground/40">{addr.city}, {addr.country}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Truck className="text-primary" size={20} />
                            <h2 className="text-sm font-black tracking-[0.2em] uppercase">Manual Shipping Vector</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Input label="Street Address" placeholder="Sector 7G, Industrial Zone" value={shippingData.street} onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })} />
                            </div>
                            <Input label="City" placeholder="Neo Cairo" value={shippingData.city} onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })} />
                            <Input label="Postal Code" placeholder="112233" value={shippingData.postalCode} onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-primary" size={20} />
                            <h2 className="text-sm font-black tracking-[0.2em] uppercase">Payment Protocol</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {([
                                { id: "paymob", label: "Paymob", icon: CreditCard },
                                { id: "stripe", label: "Stripe", icon: CreditCard },
                                { id: "cod", label: "COD", icon: Wallet },
                            ] as const).map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        setProvider(p.id);
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

                <div className="lg:pl-8">
                    <div className="glass-card p-10 space-y-10 relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
                        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-primary/10 blur-[120px] rounded-full z-100" />
                        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-secondary/10 blur-[100px] rounded-full z-100" />
                        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-foreground/40">Manifest Items</h3>
                            {cart?.items.map((item, index) => (
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
                                <span>${subtotal.toFixed(2)}</span>
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
                                <span className="text-4xl font-black text-primary text-glow">${total.toFixed(2)}</span>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-white/5">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-foreground/60">Apply Protocol Vouchers</h4>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Input
                                                placeholder="ENTER COUPON..."
                                                value={couponInput}
                                                onChange={(e) => setCouponInput(e.target.value)}
                                                className="bg-white/5 border-white/10"
                                                disabled={!!coupon}
                                            />
                                        </div>
                                        <Button
                                            variant={coupon ? "outline" : "metal"}
                                            size="sm"
                                            className="px-6 text-[10px] font-black"
                                            isLoading={isApplyingCoupon}
                                            onClick={async () => {
                                                if (coupon) {
                                                    setCoupon(null);
                                                    setCouponInput("");
                                                } else {
                                                    if (!couponInput.trim()) return;
                                                    setIsApplyingCoupon(true);
                                                    try {
                                                        const data = await validateCoupon({ code: couponInput, cartTotal: subtotal });
                                                        setCoupon({ code: data.code, discountAmount: data.discountAmount });
                                                        toast.success("Voucher Sequence Validated.");
                                                    } catch (err) {
                                                        toast.error("Voucher sequence rejected.");
                                                    } finally {
                                                        setIsApplyingCoupon(false);
                                                    }
                                                }
                                            }}
                                        >
                                            {coupon ? "REMOVE" : "APPLY"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-foreground/60">Redeem Gift Nexus Card</h4>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Input
                                                placeholder="GIFT CARD CODE..."
                                                value={giftCardInput}
                                                onChange={(e) => setGiftCardInput(e.target.value)}
                                                className="bg-white/5 border-white/10"
                                                disabled={!!giftCard}
                                            />
                                        </div>
                                        <Button
                                            variant={giftCard ? "outline" : "metal"}
                                            size="sm"
                                            className="px-6 text-[10px] font-black"
                                            isLoading={isApplyingGiftCard}
                                            onClick={async () => {
                                                if (giftCard) {
                                                    setGiftCard(null);
                                                    setGiftCardInput("");
                                                } else {
                                                    if (!giftCardInput.trim()) return;
                                                    setIsApplyingGiftCard(true);
                                                    try {
                                                        const data = await validateGiftCard({ code: giftCardInput });
                                                        const balance = data.balance;
                                                        const afterCoupon = subtotal - (coupon?.discountAmount || 0);
                                                        const appliedAmount = Math.min(balance, afterCoupon);
                                                        setGiftCard({ code: data.code, balance, appliedAmount });
                                                        toast.success("Gift Balance Link Established.");
                                                    } catch (err) {
                                                        toast.error("Gift card balance not found.");
                                                    } finally {
                                                        setIsApplyingGiftCard(false);
                                                    }
                                                }
                                            }}
                                        >
                                            {giftCard ? "REMOVE" : "REDEEM"}
                                        </Button>
                                    </div>
                                </div>
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

