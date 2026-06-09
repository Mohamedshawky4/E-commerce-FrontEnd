"use client";
import React from "react";
import { m, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  id: number;
  label: string;
  icon: React.ReactNode;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between relative">
        {/* Background connector line */}
        <div className="absolute top-5 left-0 right-0 h-px bg-white/10 z-0" />

        {/* Animated progress fill */}
        <m.div
          className="absolute top-5 left-0 h-px bg-primary z-0 origin-left"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: (currentStep - 1) / (steps.length - 1),
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ right: 0 }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
              {/* Circle */}
              <m.div
                animate={{
                  backgroundColor: isCompleted || isActive ? "var(--primary)" : "transparent",
                  borderColor: isCompleted || isActive ? "var(--primary)" : "rgba(255,255,255,0.15)",
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center relative"
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <m.div
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.25, type: "spring", stiffness: 300 }}
                    >
                      <Check size={16} className="text-background font-black" strokeWidth={3} />
                    </m.div>
                  ) : isActive ? (
                    <m.div
                      key="active"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <span className="text-[11px] font-black text-background">{step.id}</span>
                    </m.div>
                  ) : (
                    <m.div
                      key="inactive"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <span className="text-[11px] font-black text-foreground/30">{step.id}</span>
                    </m.div>
                  )}
                </AnimatePresence>

                {/* Active pulse ring */}
                {isActive && (
                  <m.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </m.div>

              {/* Label */}
              <m.span
                animate={{
                  color: isActive
                    ? "var(--primary)"
                    : isCompleted
                    ? "var(--foreground)"
                    : "rgba(var(--foreground), 0.3)",
                  opacity: isActive ? 1 : isCompleted ? 0.7 : 0.35,
                }}
                transition={{ duration: 0.3 }}
                className="text-[10px] font-black tracking-[0.15em] uppercase whitespace-nowrap"
              >
                {step.label}
              </m.span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
