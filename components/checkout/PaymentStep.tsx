"use client";
import React from "react";
import { m } from "framer-motion";
import { CreditCard, Wallet, Building2, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";

type PaymentProvider = "paymob" | "stripe" | "cod";

interface PaymentOption {
  id: PaymentProvider;
  label: string;
  description: string;
  badge?: string;
  icon: React.ReactNode;
  processingTime: string;
}

interface PaymentStepProps {
  provider: PaymentProvider;
  setProvider: (p: PaymentProvider) => void;
  setMethod: (m: "card" | "wallet" | "cod") => void;
  onNext: () => void;
  onBack: () => void;
}

const paymentOptions: PaymentOption[] = [
  {
    id: "paymob",
    label: "Paymob",
    description: "Pay securely with your card via Paymob gateway",
    badge: "Popular",
    icon: <CreditCard size={28} strokeWidth={1.5} />,
    processingTime: "Instant",
  },
  {
    id: "stripe",
    label: "Stripe",
    description: "International payments with Stripe's global network",
    badge: "International",
    icon: <Building2 size={28} strokeWidth={1.5} />,
    processingTime: "Instant",
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay with cash when your order arrives",
    icon: <Wallet size={28} strokeWidth={1.5} />,
    processingTime: "On delivery",
  },
];

const PaymentStep: React.FC<PaymentStepProps> = ({
  provider,
  setProvider,
  setMethod,
  onNext,
  onBack,
}) => {
  const handleSelect = (option: PaymentOption) => {
    setProvider(option.id);
    setMethod(option.id === "cod" ? "cod" : "card");
  };

  return (
    <m.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-foreground tracking-tight mb-1">
          Payment Method
        </h2>
        <p className="text-sm text-foreground/40">Choose how you'd like to pay for your order</p>
      </div>

      {/* Payment Options */}
      <div className="space-y-3">
        {paymentOptions.map((option, i) => {
          const isSelected = provider === option.id;
          return (
            <m.button
              key={option.id}
              onClick={() => handleSelect(option)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden ${
                isSelected
                  ? "border-primary bg-primary/8"
                  : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              {/* Shimmer on selected */}
              {isSelected && (
                <m.div
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  style={{
                    background: "linear-gradient(90deg, transparent, var(--primary), transparent)",
                  }}
                />
              )}

              <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isSelected ? "bg-primary/15 text-primary" : "bg-white/5 text-foreground/40"
                  }`}
                >
                  {option.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`text-sm font-black transition-colors duration-300 ${
                        isSelected ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {option.label}
                    </span>
                    {option.badge && (
                      <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/40 leading-relaxed">{option.description}</p>
                  <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mt-1">
                    Processing: {option.processingTime}
                  </p>
                </div>

                {/* Selected check */}
                <AnimatePresence>
                  {isSelected && (
                    <m.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="shrink-0"
                    >
                      <CheckCircle2 size={22} className="text-primary" />
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </m.button>
          );
        })}
      </div>

      {/* Security Badge */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/3 border border-white/8">
        <div className="flex items-center gap-2 shrink-0">
          <Lock size={14} className="text-primary" />
          <ShieldCheck size={14} className="text-primary" />
        </div>
        <p className="text-xs text-foreground/40 leading-relaxed">
          All transactions are encrypted with <span className="text-foreground/60 font-semibold">256-bit SSL</span> security.
          Your payment information is never stored on our servers.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <m.button
          onClick={onBack}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-4 rounded-2xl border-2 border-white/10 text-foreground/60 font-black text-sm tracking-widest uppercase
            hover:border-white/20 hover:text-foreground/80 transition-all duration-300"
        >
          ← Back
        </m.button>
        <m.button
          onClick={onNext}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="flex-[2] py-4 rounded-2xl bg-primary text-background font-black text-sm tracking-widest uppercase
            shadow-[0_0_25px_rgba(14,165,233,0.25)] hover:shadow-[0_0_35px_rgba(14,165,233,0.4)]
            dark:shadow-[0_0_25px_rgba(0,242,255,0.2)] dark:hover:shadow-[0_0_35px_rgba(0,242,255,0.4)]
            transition-all duration-300"
        >
          Review Order →
        </m.button>
      </div>
    </m.div>
  );
};

export default PaymentStep;
