"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ToggleButton from "./ToggleButton";
import Input from "./Input";
import Button from "./Button";
import { useAuthStore } from "../stores/useAuthStore";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Link from "next/link";
import { toast } from "sonner";

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
}

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState<Partial<AuthFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuthStore();
  const router = useRouter();

  const handleToggle = (selectedIndex: number) => {
    setIsLogin(selectedIndex === 0);
    setErrors({});
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    });
  };

  const handleInputChange = (field: keyof AuthFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthFormData> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Register-specific validation
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      if (isLogin) {
        // Login API call
        const response = await api.post("/users/login", {
          email: formData.email,
          password: formData.password,
        });
        const { token, refreshToken, user } = response.data;
        setUser(user.email, token, refreshToken);
        toast.success("Identity Verified. Access Granted.");
        router.push("/");
      } else {
        // Registration API call
        try {
          const response = await api.post("/users/register", {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          });
          const { token, refreshToken, user } = response.data;
          setUser(user.email, token, refreshToken);
          toast.success("Nexus Identity Created Successfully.");
          router.push("/");
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;

          if (err.response && err.response.data && err.response.data.message) {
            toast.error(`Registration failed: ${err.response.data.message}`);
          } else {
            toast.error("Registration failed. Please try again.");
          }
        }
      }

    } catch (error) {

      toast.error("Authentication failed. Please try again.");

    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Simulate Google OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful Google authentication
      const mockToken = "google-jwt-token-" + Date.now();
      const mockRefreshToken = "google-refresh-token-" + Date.now();
      const mockEmail = "user@gmail.com";
      setUser(mockEmail, mockToken, mockRefreshToken);


    } catch (error) {
      console.error("Google Sign In error:", error);
      toast.error("Google Sign In failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: {
      opacity: 0,
      x: isLogin ? -60 : 60,
      scale: 0.9,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)"
    },
    exit: {
      opacity: 0,
      x: isLogin ? 60 : -60,
      scale: 0.9,
      filter: "blur(10px)"
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const
      }
    }
  };


  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md mx-auto"
    >
      {/* Toggle Button - Stays outside AnimatePresence for stability */}
      <motion.div
        variants={itemVariants}
        className="flex justify-center mb-5"
      >
        <div className="relative">
          <ToggleButton
            arrayOfLabels={["Login", "Register"]}
            onToggle={handleToggle}
            selectedIndex={isLogin ? 0 : 1}
          />
          {/* Subtle glow effect behind toggle */}
          <div className="absolute inset-0 bg-primary/60 rounded-full blur-xl scale-110 opacity-30 -z-10 pointer-events-none" />
        </div>
      </motion.div>

      {/* Form Container with Glass Effect and Animations */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "register"}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: 0.4,
              ease: "easeOut" as const
            }}
            onSubmit={handleSubmit}
            className="relative space-y-6 glass-card py-10 px-10 border-white/10 overflow-hidden"
          >
            {/* Title */}
            <motion.div
              variants={itemVariants}
              className="text-center relative z-10"
            >
              <h2 className="text-3xl font-black text-metal tracking-tighter">
                {isLogin ? "IDENTITY ACCESS" : "CREATE NEXUS"}
              </h2>
              <div className="w-12 h-1 bg-primary mx-auto mt-2 rounded-full opacity-50" />
            </motion.div>

            {/* Form Fields */}
            <div className="space-y-6 relative z-10">
              {!isLogin && (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <Input
                    label="Full Name"
                    name="name"
                    type="text"
                    placeholder="OPERATOR NAME"
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-[10px] font-bold tracking-widest mt-1 uppercase">{errors.name}</p>
                  )}
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <Input
                  label="Email Vector"
                  name="email"
                  type="email"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] font-bold tracking-widest mt-1 uppercase">{errors.email}</p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  label="Security Key"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                />
                {errors.password && (
                  <p className="text-red-500 text-[10px] font-bold tracking-widest mt-1 uppercase">{errors.password}</p>
                )}
              </motion.div>

              {!isLogin && (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <Input
                    label="Verify Key"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange("confirmPassword")}
                    className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-[10px] font-bold tracking-widest mt-1 uppercase">{errors.confirmPassword}</p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Forgot Password Link */}
            {isLogin && (
              <motion.div variants={itemVariants} className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-black tracking-widest uppercase text-primary/60 hover:text-primary transition-colors"
                >
                  Lost Access?
                </Link>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="relative z-10">
              <Button
                type="submit"
                variant="liquid"
                size="lg"
                fullWidth
                isLoading={isLoading}
                className="py-4 font-black tracking-[0.2em]"
              >
                {isLogin ? "INITIALIZE" : "REGISTER"}
              </Button>
            </motion.div>

            {/* Divider */}
            {isLogin && (
              <motion.div variants={itemVariants} className="relative flex items-center justify-center gap-4 text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">
                <span className="flex-1 h-px bg-white/10" />
                <span>OR</span>
                <span className="flex-1 h-px bg-white/10" />
              </motion.div>
            )}

            {/* Google Sign In */}
            {isLogin && (
              <motion.div variants={itemVariants} className="relative z-10">
                <Button
                  type="button"
                  variant="metal"
                  size="lg"
                  fullWidth
                  onClick={handleGoogleSignIn}
                  isLoading={isLoading}
                  leftIcon={
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" opacity="0.8" />
                      <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity="0.6" />
                      <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" opacity="0.4" />
                      <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" opacity="0.6" />
                    </svg>
                  }
                  className="py-4"
                >
                  <span className="font-black tracking-[0.2em]">NODE.GOOGLE</span>
                </Button>
              </motion.div>
            )}

          </motion.form>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AuthForm;
