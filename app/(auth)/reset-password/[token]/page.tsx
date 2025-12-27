"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import ThemeToggle from "@/components/ThemeToggle";

const ResetPasswordPage = () => {
    const { token } = useParams();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            setStatus("error");
            return;
        }

        setIsLoading(true);
        setStatus("idle");
        try {
            await api.put(`/users/resetpassword/${token}`, { password });
            setStatus("success");
            setTimeout(() => router.push("/login"), 3000);
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            setErrorMessage(axiosError.response?.data?.message || "Failed to reset password.");
            setStatus("error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-linear-to-br from-background via-background/95 to-background/70 overflow-hidden flex items-center justify-center py-20 px-4">
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
                            New Identity Key
                        </h2>
                        <p className="text-xs text-foreground/60 tracking-widest uppercase mt-4">
                            ESTABLISH YOUR NEW ACCESS CREDENTIALS
                        </p>
                    </div>

                    {status !== "success" ? (
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <Input
                                label="New Security Key"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Input
                                label="Verify New Key"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {status === "error" && (
                                <p className="text-red-500 text-[10px] font-bold tracking-widest uppercase text-center">{errorMessage}</p>
                            )}
                            <Button
                                type="submit"
                                variant="liquid"
                                size="lg"
                                fullWidth
                                isLoading={isLoading}
                                className="font-black tracking-widest"
                            >
                                RECALIBRATE PASSWORD
                            </Button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6 relative z-10"
                        >
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/50">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    className="w-8 h-8 bg-green-500 rounded-full blur-sm"
                                />
                            </div>
                            <p className="text-sm font-bold tracking-tight text-green-500">
                                ACCESS RE-ESTABLISHED
                            </p>
                            <p className="text-xs text-foreground/60 leading-relaxed">
                                Your security key has been updated. Redirecting to nexus access...
                            </p>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
