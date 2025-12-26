"use client";
import React from "react";
import clsx from "clsx";
import { motion, HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger" | "success" | "secondary" | "metal" | "liquid";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "variant"> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:cursor-pointer active:scale-95";

    const variants: Record<ButtonVariant, string> = {
      primary:
        "bg-primary text-background font-bold shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] dark:shadow-[0_0_15px_rgba(0,242,255,0.3)] dark:hover:shadow-[0_0_25px_rgba(0,242,255,0.5)]",
      metal:
        "metal-button text-foreground",
      liquid:
        "relative overflow-hidden bg-surface text-primary border border-primary/30 liquid-flow",
      outline:
        "border border-border text-foreground hover:bg-foreground/5",
      ghost:
        "text-foreground hover:bg-foreground/5",
      success:
        "bg-emerald-500 text-white hover:opacity-90",
      danger:
        "bg-rose-500 text-white hover:opacity-90",
      secondary:
        "glass-card text-foreground hover:bg-foreground/5",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "text-sm px-3 py-1.5",
      md: "text-base px-5 py-2.5",
      lg: "text-lg px-8 py-3.5",
    };

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        ref={ref as any}
        className={clsx(baseStyles, variants[variant], sizes[size], fullWidth && "w-full", className)}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {variant === "liquid" && (
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at 0% 0%, var(--primary) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 100%, var(--primary) 0%, transparent 50%)",
                "radial-gradient(circle at 0% 100%, var(--primary) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 0%, var(--primary) 0%, transparent 50%)",
                "radial-gradient(circle at 0% 0%, var(--primary) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
