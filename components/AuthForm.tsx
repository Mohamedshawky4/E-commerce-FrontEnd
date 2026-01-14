"use client";

import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import ToggleButton from "./ToggleButton";
import Input from "./Input";
import Button from "./Button";
import { useAuthStore } from "../stores/useAuthStore";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const authSchema = z.object({
    name: z.string().optional(),
    email: z.string().email("Please enter a valid mission vector (email)."),
    password: z.string().min(6, "Security key must be at least 6 characters."),
    confirmPassword: z.string().optional(),
}).refine((data) => {
    if (data.confirmPassword && data.password !== data.confirmPassword) {
        return false;
    }
    return true;
}, {
    message: "Security keys do not match.",
    path: ["confirmPassword"],
});

type AuthSchemaType = z.infer<typeof authSchema>;

interface AuthFormProps {
    initialMode?: "login" | "register";
}

const AuthForm: React.FC<AuthFormProps> = ({ initialMode = "login" }) => {
    const [isLogin, setIsLogin] = useState(initialMode === "login");
    const { setUser } = useAuthStore();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isLoading: isSubmitting },
        reset,
        setValue,
    } = useForm<AuthSchemaType>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
        },
    });

    const [isApiLoading, setIsApiLoading] = useState(false);
    const isLoading = isSubmitting || isApiLoading;

    const handleToggle = (selectedIndex: number) => {
        setIsLogin(selectedIndex === 0);
        reset();
    };

    const onSubmit = async (data: AuthSchemaType) => {
        setIsApiLoading(true);

        try {
            if (isLogin) {
                const response = await api.post("/users/login", {
                    email: data.email,
                    password: data.password,
                });
                const { token, refreshToken, user } = response.data;
                setUser(user.email, token, refreshToken);
                toast.success("Identity Verified. Access Granted.");
                router.push("/");
            } else {
                try {
                    const response = await api.post("/users/register", {
                        name: data.name,
                        email: data.email,
                        password: data.password,
                    });
                    const { token, refreshToken, user } = response.data;
                    setUser(user.email, token, refreshToken);
                    toast.success("Nexus Identity Created Successfully.");
                    router.push("/");
                } catch (error) {
                    const err = error as AxiosError<{ message?: string }>;
                    toast.error(err.response?.data?.message || "Registration failed. Please try again.");
                }
            }
        } catch (error) {
            toast.error("Authentication failed. Please check your credentials.");
        } finally {
            setIsApiLoading(false);
        }
    };

    const handleGoogleSignIn = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsApiLoading(true);
            try {
                const response = await api.post("/users/google-login", {
                    accessToken: tokenResponse.access_token,
                });
                const { token, refreshToken, user } = response.data;
                setUser(user.email, token, refreshToken);
                toast.success("Identity Verified via Google Nexus.");
                router.push("/");
            } catch (error) {
                console.error(error);
                toast.error("Google Authentication failed.");
            } finally {
                setIsApiLoading(false);
            }
        },
        onError: () => {
            toast.error("Google Login Failed");
        }
    });

    // ... rest of the component animations and JSX stay identical but use register() and errors from hook-form
    // I'll need to update the JSX part too, so I'll do it in a combined block below if possible, 
    // but the tool works best with contiguous blocks. I will replace the whole component body.

    const formVariants = {
        hidden: { opacity: 0, x: isLogin ? -60 : 60, scale: 0.9, filter: "blur(10px)" },
        visible: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
        exit: { opacity: 0, x: isLogin ? 60 : -60, scale: 0.9, filter: "blur(10px)" },
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.6, ease: "easeOut" as const, staggerChildren: 0.08, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } }
    };

    return (
        <m.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md mx-auto">
            <m.div variants={itemVariants} className="flex justify-center mb-5">
                <div className="relative">
                    <ToggleButton arrayOfLabels={["Login", "Register"]} onToggle={handleToggle} selectedIndex={isLogin ? 0 : 1} />
                    <div className="absolute inset-0 bg-primary/60 rounded-full blur-xl scale-110 opacity-30 -z-10 pointer-events-none" />
                </div>
            </m.div>

            <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <m.form
                        key={isLogin ? "login" : "register"}
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="relative space-y-6 glass-card py-10 px-10 border-white/10 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-primary/10 blur-[120px] rounded-full z-0" />
                        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-secondary/10 blur-[100px] rounded-full z-0" />

                        <m.div variants={itemVariants} className="text-center relative z-10">
                            <h2 className="text-3xl font-black text-metal tracking-tighter">
                                {isLogin ? "IDENTITY ACCESS" : "CREATE NEXUS"}
                            </h2>
                            <div className="w-12 h-1 bg-primary mx-auto mt-2 rounded-full opacity-50" />
                        </m.div>

                        <div className="space-y-6 relative z-10">
                            {!isLogin && (
                                <m.div variants={itemVariants} initial="hidden" animate="visible" exit="hidden">
                                    <Input
                                        label="Full Name"
                                        placeholder="OPERATOR NAME"
                                        {...register("name")}
                                        className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-[10px] font-bold tracking-widest mt-1 uppercase">{errors.name.message}</p>
                                    )}
                                </m.div>
                            )}

                            <m.div variants={itemVariants}>
                                <Input
                                    label="Email Vector"
                                    type="email"
                                    placeholder="name@domain.com"
                                    {...register("email")}
                                    className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-[10px] font-bold tracking-widest mt-1 uppercase">{errors.email.message}</p>
                                )}
                            </m.div>

                            <m.div variants={itemVariants}>
                                <Input
                                    label="Security Key"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                    className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-[10px] font-bold tracking-widest mt-1 uppercase">{errors.password.message}</p>
                                )}
                            </m.div>

                            {!isLogin && (
                                <m.div variants={itemVariants} initial="hidden" animate="visible" exit="hidden">
                                    <Input
                                        label="Verify Key"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register("confirmPassword")}
                                        className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-[10px] font-bold tracking-widest mt-1 uppercase">{errors.confirmPassword.message}</p>
                                    )}
                                </m.div>
                            )}
                        </div>

                        {isLogin && (
                            <m.div variants={itemVariants} className="text-right">
                                <Link href="/forgot-password" className="text-[10px] font-black tracking-widest uppercase text-primary/60 hover:text-primary transition-colors">
                                    Lost Access?
                                </Link>
                            </m.div>
                        )}

                        <m.div variants={itemVariants} className="relative z-10">
                            <Button type="submit" variant="liquid" size="lg" fullWidth isLoading={isLoading} className="py-4 font-black tracking-[0.2em]">
                                {isLogin ? "INITIALIZE" : "REGISTER"}
                            </Button>
                        </m.div>

                        {isLogin && (
                            <m.div variants={itemVariants} className="relative flex items-center justify-center gap-4 text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">
                                <span className="flex-1 h-px bg-white/10" />
                                <span>OR</span>
                                <span className="flex-1 h-px bg-white/10" />
                            </m.div>
                        )}

                        {isLogin && (
                            <m.div variants={itemVariants} className="relative z-10">
                                <Button
                                    type="button"
                                    variant="metal"
                                    size="lg"
                                    fullWidth
                                    onClick={() => handleGoogleSignIn()}
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
                            </m.div>
                        )}
                    </m.form>
                </AnimatePresence>
            </div>
        </m.div>
    );
};

export default AuthForm;
