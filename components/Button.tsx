"use client";
import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  onClick,
  className = "",
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:cursor-pointer";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "gradient-primary text-surface hover:opacity-90 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed ",
    outline:
      "border border-border text-text hover:bg-surface focus:ring-border disabled:opacity-50 disabled:cursor-not-allowed",
    ghost:
      "text-text hover:bg-surface/50 focus:ring-border disabled:opacity-50 disabled:cursor-not-allowed",
    success:
      "bg-success text-surface hover:opacity-90 focus:ring-success disabled:opacity-50 disabled:cursor-not-allowed",
    danger:
      "bg-error text-surface hover:opacity-90 focus:ring-error disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </button>
  );
}
