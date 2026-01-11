"use client";
import clsx from "clsx";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputSize = "sm" | "md" | "lg";
type InputType = "text" | "email" | "password" | "number" | "search" | "tel";
type InputVariant = "default" | "outline" | "ghost" | "disabled";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: InputType;
  label?: string;
  name?: string;
  className?: string;
  inputSize?: InputSize;
  variant?: InputVariant;
  disabled?: boolean;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  type = "text",
  label,
  name,
  className,
  inputSize = "md",
  variant = "default",
  disabled = false,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const baseStyles =
    "w-full rounded-xl border bg-background text-foreground transition-colors duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

  const sizeStyles = {
    sm: "text-sm py-1.5 px-2.5",
    md: "text-base py-2.5 px-3",
    lg: "text-lg py-3.5 px-4.5",
  };

  const variantStyles = {
    default: "border-input hover:border-primary/60",
    outline:
      "border-2 border-primary bg-transparent text-primary placeholder:text-primary/70 focus:ring-primary/40 hover:bg-primary/5",
    ghost:
      "border-transparent bg-transparent hover:bg-accent focus:ring-accent focus:bg-accent/30",
    disabled: "opacity-60 cursor-not-allowed border-muted bg-muted/40",
  };

  const isPassword = type === "password";
  const currentType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1 relative">
      {label && (
        <label
          htmlFor={name}
          className="px-1 font-medium leading-6 text-xs uppercase tracking-widest text-muted-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={currentType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled || variant === "disabled"}
          className={clsx(
            baseStyles,
            sizeStyles[inputSize],
            variantStyles[variant],
            isPassword && "pr-10", // add padding for eye icon
            error && "border-red-500 ring-red-500/10 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-primary focus:outline-none"
          >
            {showPassword ? (
              <EyeOff size={18} strokeWidth={2} />
            ) : (
              <Eye size={18} strokeWidth={2} />
            )}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-500 px-1">{error}</span>}
    </div>
  );
};

export default Input;
