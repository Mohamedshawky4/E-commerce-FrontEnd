"use client";
import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  Minus, Plus, Tag, Gift, ShieldCheck, Truck, Calendar, Loader2, AlertCircle,
  CreditCard, Wallet, Building2
} from "lucide-react";
import Image from "next/image";
import Input from "@/components/Input";
import { CartItem } from "@/hooks/useCart";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface Coupon {
  code: string;
  discountAmount: number;
}

interface GiftCardState {
  code: string;
  balance: number;
  appliedAmount: number;
}

interface ReviewStepProps {
  cartItems: CartItem[];
  subtotal: number;
  total: number;
  provider: "paymob" | "stripe" | "cod";
  coupon: Coupon | null;
  setCoupon: (c: Coupon | null) => void;
  couponInput: string;
  setCouponInput: (v: string) => void;
  giftCard: GiftCardState | null;
  setGiftCard: (g: GiftCardState | null) => void;
  giftCardInput: string;
  setGiftCardInput: (v: string) => void;
  isApplyingCoupon: boolean;
  setIsApplyingCoupon: (v: boolean) => void;
  isApplyingGiftCard: boolean;
  setIsApplyingGiftCard: (v: boolean) => void;
  validateCoupon: (args: { code: string; cartTotal: number }) => Promise<any>;
  validateGiftCard: (args: { code: string }) => Promise<any>;
  onUpdateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  onRemoveItem: (productId: string, variantId?: string) => void;
  onPlaceOrder: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const SHIPPING_FEE = 50;
const DELIVERY_DAYS_MIN = 3;
const DELIVERY_DAYS_MAX = 5;

function getDeliveryRange(): string {
  const today = new Date();
  const addBusinessDays = (date: Date, days: number) => {
    let count = 0;
    const result = new Date(date);
    while (count < days) {
      result.setDate(result.getDate() + 1);
      if (result.getDay() !== 0 && result.getDay() !== 6) count++;
    }
    return result;
  };
  const minDate = addBusinessDays(today, DELIVERY_DAYS_MIN);
  const maxDate = addBusinessDays(today, DELIVERY_DAYS_MAX);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return `${fmt(minDate)} – ${fmt(maxDate)}`;
}

const providerLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  paymob: { label: "Paymob", icon: <CreditCard size={14} /> },
  stripe: { label: "Stripe", icon: <Building2 size={14} /> },
  cod: { label: "Cash on Delivery", icon: <Wallet size={14} /> },
};

const ReviewStep: React.FC<ReviewStepProps> = ({
  cartItems,
  subtotal,
  total,
  provider,
  coupon,
  setCoupon,
  couponInput,
  setCouponInput,
  giftCard,
  setGiftCard,
  giftCardInput,
  setGiftCardInput,
  isApplyingCoupon,
  setIsApplyingCoupon,
  isApplyingGiftCard,
  setIsApplyingGiftCard,
  validateCoupon,
  validateGiftCard,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onBack,
  isLoading,
}) => {
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const deliveryRange = getDeliveryRange();

  const handleQtyChange = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    const itemKey = item._id || item.product._id;
    setUpdatingItemId(itemKey);
    try {
      if (newQty <= 0) {
        onRemoveItem(item.product._id, item.variantId);
      } else {
        onUpdateQuantity(item.product._id, newQty, item.variantId);
      }
    } finally {
      setTimeout(() => setUpdatingItemId(null), 300);
    }
  };

  const handleApplyCoupon = async () => {
    if (coupon) {
      setCoupon(null);
      setCouponInput("");
      return;
    }
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    try {
      const data = await validateCoupon({ code: couponInput, cartTotal: subtotal });
      setCoupon({ code: data.code, discountAmount: data.discountAmount });
      toast.success(`Coupon applied! You saved $${data.discountAmount.toFixed(2)}`);
    } catch {
      toast.error("Invalid or expired coupon code.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleApplyGiftCard = async () => {
    if (giftCard) {
      setGiftCard(null);
      setGiftCardInput("");
      return;
    }
    if (!giftCardInput.trim()) return;
    setIsApplyingGiftCard(true);
    try {
      const data = await validateGiftCard({ code: giftCardInput });
      const balance = data.balance;
      const afterCoupon = subtotal - (coupon?.discountAmount || 0);
      const appliedAmount = Math.min(balance, afterCoupon);
      setGiftCard({ code: data.code, balance, appliedAmount });
      toast.success(`Gift card applied! $${appliedAmount.toFixed(2)} credited.`);
    } catch {
      toast.error("Invalid gift card code.");
    } finally {
      setIsApplyingGiftCard(false);
    }
  };

  const pInfo = providerLabels[provider] ?? providerLabels.cod;

  return (
    <m.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-foreground tracking-tight mb-1">
          Review Your Order
        </h2>
        <p className="text-sm text-foreground/40">Confirm everything looks right before placing your order</p>
      </div>

      {/* Delivery Estimate */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/8 border border-primary/20">
        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <Calendar size={16} className="text-primary" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-0.5">
            Estimated Delivery
          </p>
          <p className="text-sm font-black text-primary">{deliveryRange}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Truck size={13} className="text-foreground/30" />
          <span className="text-[10px] text-foreground/30 font-bold uppercase tracking-wider">
            Standard
          </span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-foreground/40 mb-3">
          Order Items ({cartItems.length})
        </h3>
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <AnimatePresence initial={false}>
            {cartItems.map((item, index) => {
              const itemKey = item._id || `${item.product._id}-${item.variantId || index}`;
              const isUpdating = updatingItemId === itemKey;
              const itemTotal = (item.product.discountedPrice ?? item.product.price) * item.quantity;
              const originalTotal = item.product.price * item.quantity;

              return (
                <m.div
                  key={itemKey}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: isUpdating ? 0.6 : 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/6 group"
                >
                  {/* Product Image */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0 relative">
                    <Image
                      src={item.product.images?.[0] || "/images/product.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{item.product.name}</p>
                    {(item as any).variantSnapshot && (
                      <p className="text-[10px] text-foreground/40 mt-0.5">
                        {(item as any).variantSnapshot.color && `${(item as any).variantSnapshot.color}`}
                        {(item as any).variantSnapshot.size && ` / ${(item as any).variantSnapshot.size}`}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-1">
                      {item.product.discountPercent > 0 ? (
                        <>
                          <span className="text-xs font-black text-primary">
                            ${itemTotal.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-foreground/30 line-through">
                            ${originalTotal.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-black text-foreground">
                          ${itemTotal.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1 shrink-0">
                    <m.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQtyChange(item, -1)}
                      disabled={isUpdating}
                      className="w-7 h-7 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center
                        text-foreground/60 hover:text-foreground hover:bg-white/15 transition-all duration-200 disabled:opacity-40"
                    >
                      <Minus size={11} strokeWidth={3} />
                    </m.button>

                    <div className="w-8 text-center">
                      <AnimatePresence mode="wait">
                        <m.span
                          key={item.quantity}
                          initial={{ y: -8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 8, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="text-sm font-black text-foreground block"
                        >
                          {item.quantity}
                        </m.span>
                      </AnimatePresence>
                    </div>

                    <m.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQtyChange(item, +1)}
                      disabled={isUpdating}
                      className="w-7 h-7 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center
                        text-foreground/60 hover:text-primary hover:bg-primary/15 hover:border-primary/30 transition-all duration-200 disabled:opacity-40"
                    >
                      <Plus size={11} strokeWidth={3} />
                    </m.button>
                  </div>
                </m.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Discount Codes */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-foreground/40">
          Discount Codes
        </h3>

        {/* Coupon */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none" />
            <input
              placeholder="Coupon code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              disabled={!!coupon}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
              className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-foreground
                placeholder:text-foreground/25 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40
                disabled:opacity-50 transition-all"
            />
          </div>
          <button
            onClick={handleApplyCoupon}
            disabled={isApplyingCoupon}
            className={`px-4 py-2.5 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${
              coupon
                ? "bg-white/8 border border-white/10 text-foreground/50 hover:text-red-400 hover:border-red-400/30"
                : "bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25"
            }`}
          >
            {isApplyingCoupon ? <Loader2 size={14} className="animate-spin" /> : coupon ? "Remove" : "Apply"}
          </button>
        </div>

        {/* Gift Card */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Gift size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none" />
            <input
              placeholder="Gift card code"
              value={giftCardInput}
              onChange={(e) => setGiftCardInput(e.target.value.toUpperCase())}
              disabled={!!giftCard}
              onKeyDown={(e) => e.key === "Enter" && handleApplyGiftCard()}
              className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-foreground
                placeholder:text-foreground/25 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/40
                disabled:opacity-50 transition-all"
            />
          </div>
          <button
            onClick={handleApplyGiftCard}
            disabled={isApplyingGiftCard}
            className={`px-4 py-2.5 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${
              giftCard
                ? "bg-white/8 border border-white/10 text-foreground/50 hover:text-red-400 hover:border-red-400/30"
                : "bg-secondary/15 border border-secondary/30 text-secondary hover:bg-secondary/25"
            }`}
          >
            {isApplyingGiftCard ? <Loader2 size={14} className="animate-spin" /> : giftCard ? "Remove" : "Redeem"}
          </button>
        </div>
      </div>

      {/* Order Totals */}
      <div className="rounded-2xl bg-white/3 border border-white/8 p-5 space-y-3">
        {/* Payment method badge */}
        <div className="flex items-center justify-between pb-3 border-b border-white/8">
          <span className="text-[10px] text-foreground/40 font-black uppercase tracking-widest">
            Payment via
          </span>
          <div className="flex items-center gap-1.5 text-foreground/70">
            {pInfo.icon}
            <span className="text-xs font-black">{pInfo.label}</span>
          </div>
        </div>

        <div className="flex justify-between text-xs text-foreground/50">
          <span>Subtotal</span>
          <span className="font-bold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-foreground/50">
          <span>Shipping</span>
          <span className="font-bold">${SHIPPING_FEE.toFixed(2)}</span>
        </div>

        <AnimatePresence>
          {coupon && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-between text-xs text-emerald-400"
            >
              <span>Coupon ({coupon.code})</span>
              <span className="font-bold">− ${coupon.discountAmount.toFixed(2)}</span>
            </m.div>
          )}
          {giftCard && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-between text-xs text-emerald-400"
            >
              <span>Gift Card ({giftCard.code})</span>
              <span className="font-bold">− ${giftCard.appliedAmount.toFixed(2)}</span>
            </m.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center pt-3 border-t border-white/8">
          <span className="text-sm font-black text-foreground/60 uppercase tracking-wider">Total</span>
          <m.span
            key={total}
            initial={{ scale: 1.1, color: "var(--primary)" }}
            animate={{ scale: 1, color: "var(--primary)" }}
            transition={{ duration: 0.25 }}
            className="text-3xl font-black text-primary"
          >
            ${total.toFixed(2)}
          </m.span>
        </div>
      </div>

      {/* Legal note */}
      <p className="text-[10px] text-foreground/25 text-center leading-relaxed">
        By placing your order, you agree to our{" "}
        <span className="text-foreground/40 underline underline-offset-2 cursor-pointer hover:text-primary transition-colors">
          Terms of Service
        </span>{" "}
        and{" "}
        <span className="text-foreground/40 underline underline-offset-2 cursor-pointer hover:text-primary transition-colors">
          Privacy Policy
        </span>
        .
      </p>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <m.button
          onClick={onBack}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          className="flex-1 py-4 rounded-2xl border-2 border-white/10 text-foreground/60 font-black text-sm tracking-widest uppercase
            hover:border-white/20 hover:text-foreground/80 transition-all duration-300 disabled:opacity-40"
        >
          ← Back
        </m.button>
        <m.button
          onClick={onPlaceOrder}
          whileHover={!isLoading ? { scale: 1.01 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          disabled={isLoading}
          className="flex-[2] py-4 rounded-2xl bg-primary text-background font-black text-sm tracking-widest uppercase
            shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:shadow-[0_0_45px_rgba(14,165,233,0.5)]
            dark:shadow-[0_0_30px_rgba(0,242,255,0.2)] dark:hover:shadow-[0_0_45px_rgba(0,242,255,0.4)]
            transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Placing Order…
            </>
          ) : (
            <>
              <ShieldCheck size={16} />
              Place Order
            </>
          )}
        </m.button>
      </div>
    </m.div>
  );
};

export default ReviewStep;
