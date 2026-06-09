"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { MapPin, CreditCard, ClipboardList, ArrowLeft } from "lucide-react";

import api from "@/lib/axios";
import {
  useCart,
  useClearCart,
  selectCartTotals,
  useApplyCoupon,
  useApplyGiftCard,
  useUpdateCartQuantity,
  useRemoveFromCart,
} from "@/hooks/useCart";
import { useUserAddresses } from "@/hooks/useUser";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Address } from "@/types/user";

import StepIndicator from "@/components/checkout/StepIndicator";
import ShippingStep from "@/components/checkout/ShippingStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import ReviewStep from "@/components/checkout/ReviewStep";

// ─── Types ──────────────────────────────────────────────────────────────────
interface ShippingData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const STEPS = [
  { id: 1, label: "Shipping", icon: <MapPin size={16} /> },
  { id: 2, label: "Payment", icon: <CreditCard size={16} /> },
  { id: 3, label: "Review", icon: <ClipboardList size={16} /> },
];

// ─── Component ───────────────────────────────────────────────────────────────
const CheckoutPage = () => {
  const router = useRouter();

  // Cart
  const { data: cart } = useCart();
  const { mutate: clearCart } = useClearCart();
  const { mutateAsync: validateCoupon } = useApplyCoupon();
  const { mutateAsync: validateGiftCard } = useApplyGiftCard();
  const { mutate: updateQty } = useUpdateCartQuantity();
  const { mutate: removeItem } = useRemoveFromCart();

  // Addresses
  const { data: addresses = [] } = useUserAddresses();

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Shipping
  const [shippingData, setShippingData] = useState<ShippingData>({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Egypt",
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Payment
  const [method, setMethod] = useState<"card" | "wallet" | "cod">("card");
  const [provider, setProvider] = useState<"paymob" | "stripe" | "cod">("paymob");

  // Discounts
  const [coupon, setCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [giftCard, setGiftCard] = useState<{
    code: string;
    balance: number;
    appliedAmount: number;
  } | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [giftCardInput, setGiftCardInput] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isApplyingGiftCard, setIsApplyingGiftCard] = useState(false);

  const { subtotal, total } = selectCartTotals(cart, coupon, giftCard);

  // Hydration guard
  useEffect(() => setMounted(true), []);

  // Redirect if cart is empty
  useEffect(() => {
    if (mounted && cart && cart.items.length === 0) {
      router.push("/cart");
    }
  }, [cart, router, mounted]);

  const goNext = () => {
    setDirection("forward");
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => {
    if (currentStep === 1) {
      router.back();
    } else {
      setDirection("back");
      setCurrentStep((s) => Math.max(s - 1, 1));
    }
  };

  // ─── Place Order ──────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!cart) return;
    setIsLoading(true);
    try {
      const orderResponse = await api.post("/orders", {
        cartItems: cart.items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          variantId: item.variantId,
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
        toast.info("Redirecting to Stripe secure gateway…");
      } else if (provider === "cod") {
        clearCart();
        router.push(`/order/success?id=${String(orderId)}`);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Quantity helpers (passed down to ReviewStep) ─────────────────────────
  const handleUpdateQuantity = (
    productId: string,
    quantity: number,
    variantId?: string
  ) => {
    updateQty({ productId, quantity, variantId });
  };

  const handleRemoveItem = (productId: string, variantId?: string) => {
    removeItem({ productId, variantId });
  };

  if (!mounted) return null;

  // ─── Slide variants ───────────────────────────────────────────────────────
  const slideVariants = {
    enter: (dir: string) => ({
      x: dir === "forward" ? 60 : -60,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: string) => ({
      x: dir === "forward" ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-10 max-w-5xl">

          {/* Back button */}
          <m.button
            onClick={goBack}
            whileHover={{ x: -3 }}
            transition={{ duration: 0.15 }}
            className="mb-8 flex items-center gap-2 text-[10px] font-black tracking-widest text-foreground/35
              hover:text-primary transition-colors uppercase"
          >
            <ArrowLeft size={14} />
            {currentStep === 1 ? "Back to Cart" : "Previous Step"}
          </m.button>

          {/* Step Indicator */}
          <StepIndicator steps={STEPS} currentStep={currentStep} />

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 xl:gap-16 items-start">

            {/* Left: Step content */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                {currentStep === 1 && (
                  <m.div
                    key="step-1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ShippingStep
                      shippingData={shippingData}
                      setShippingData={setShippingData}
                      addresses={addresses as Address[]}
                      selectedAddressId={selectedAddressId}
                      setSelectedAddressId={setSelectedAddressId}
                      onNext={goNext}
                    />
                  </m.div>
                )}

                {currentStep === 2 && (
                  <m.div
                    key="step-2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <PaymentStep
                      provider={provider}
                      setProvider={setProvider}
                      setMethod={setMethod}
                      onNext={goNext}
                      onBack={goBack}
                    />
                  </m.div>
                )}

                {currentStep === 3 && (
                  <m.div
                    key="step-3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ReviewStep
                      cartItems={cart?.items ?? []}
                      subtotal={subtotal}
                      total={total}
                      provider={provider}
                      coupon={coupon}
                      setCoupon={setCoupon}
                      couponInput={couponInput}
                      setCouponInput={setCouponInput}
                      giftCard={giftCard}
                      setGiftCard={setGiftCard}
                      giftCardInput={giftCardInput}
                      setGiftCardInput={setGiftCardInput}
                      isApplyingCoupon={isApplyingCoupon}
                      setIsApplyingCoupon={setIsApplyingCoupon}
                      isApplyingGiftCard={isApplyingGiftCard}
                      setIsApplyingGiftCard={setIsApplyingGiftCard}
                      validateCoupon={validateCoupon}
                      validateGiftCard={validateGiftCard}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemoveItem={handleRemoveItem}
                      onPlaceOrder={handlePlaceOrder}
                      onBack={goBack}
                      isLoading={isLoading}
                    />
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Persistent mini order summary (steps 1 & 2 only) */}
            {currentStep < 3 && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="glass-card p-6 space-y-5 sticky top-8"
              >
                {/* Glow */}
                <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-primary/8 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/8 blur-[60px] rounded-full pointer-events-none" />

                <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-foreground/40">
                  Order Summary
                </h3>

                {/* Items list */}
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
                  {cart?.items.map((item, index) => (
                    <div
                      key={item._id || `${item.product._id}-${index}`}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 relative">
                        <img
                          src={item.product.images?.[0] || "/images/product.jpg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate text-foreground">{item.product.name}</p>
                        <p className="text-[10px] text-foreground/40">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-black text-foreground shrink-0">
                        ${((item.product.discountedPrice ?? item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="pt-4 border-t border-white/8 space-y-2">
                  <div className="flex justify-between text-xs text-foreground/40">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-foreground/40">
                    <span>Shipping</span>
                    <span>$50.00</span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between text-xs text-emerald-400">
                      <span>Coupon</span>
                      <span>− ${coupon.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {giftCard && (
                    <div className="flex justify-between text-xs text-emerald-400">
                      <span>Gift Card</span>
                      <span>− ${giftCard.appliedAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-white/8">
                    <span className="text-xs font-black text-foreground/50 uppercase tracking-widest">Total</span>
                    <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </m.div>
            )}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
};

export default CheckoutPage;
