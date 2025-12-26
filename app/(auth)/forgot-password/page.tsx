"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/Input";
import Button from "@/components/Button";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await api.post("/users/forgotpassword", { email });
            setIsSent(true);
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            setError(axiosError.response?.data?.message || "Failed to send reset email.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-linear-to-br from-background via-background/95 to-background/70 overflow-hidden flex items-center justify-center py-20 px-4">
            {/* Background elements (mirroring login page) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
            </div>

            <div className="absolute top-5 left-8 z-50">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-10 space-y-8 relative overflow-hidden">
                    <div className="text-center relative z-10">
                        <h2 className="text-3xl font-black text-metal tracking-tighter uppercase">
                            Recover Access
                        </h2>
                        <p className="text-xs text-foreground/60 tracking-widest uppercase mt-4">
                            IDENTIFY YOUR VECTOR FOR RECALIBRATION
                        </p>
                    </div>

                    {!isSent ? (
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <Input
                                label="Email Vector"
                                type="email"
                                placeholder="name@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {error && (
                                <p className="text-red-500 text-[10px] font-bold tracking-widest uppercase text-center">{error}</p>
                            )}
                            <Button
                                type="submit"
                                variant="liquid"
                                size="lg"
                                fullWidth
                                disabled={isLoading}
                                className="font-black tracking-widest"
                            >
                                {isLoading ? "TRANSMITTING..." : "SEND RECOVERY LINK"}
                            </Button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6 relative z-10"
                        >
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/50">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-8 h-8 bg-primary rounded-full blur-sm"
                                />
                            </div>
                            <p className="text-sm font-bold tracking-tight text-primary">
                                TRANSMISSION SUCCESSFUL
                            </p>
                            <p className="text-xs text-foreground/60 leading-relaxed">
                                Check your email inbox for the recalibration sequence. The link expires in 10 minutes.
                            </p>
                        </motion.div>
                    )}

                    <div className="text-center relative z-10 pt-4">
                        <Link href="/login" className="text-[10px] font-black tracking-[0.3em] text-white/30 hover:text-primary uppercase transition-all">
                            RETURN TO NEXUS
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
