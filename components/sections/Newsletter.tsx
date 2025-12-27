"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "../Button";
import Input from "../Input";
import { toast } from "sonner";
import { Mail, ArrowRight } from "lucide-react";

const Newsletter = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle newsletter subscription logic here
        console.log("Subscribed with:", email);
        setEmail("");
        toast.success("Vector Authorized. Welcome to the Nexus.");
    };

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 liquid-mesh opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto glass-card p-12 md:p-20 text-center border-white/10 overflow-hidden relative">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 0.8, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-3xl glass-card border-primary/20 text-primary"
                    >
                        <Mail size={36} className="text-glow" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-metal tracking-tighter mb-6"
                    >
                        JOIN THE <span className="text-primary text-glow">NEXUS</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-text-muted mb-10 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed"
                    >
                        Authorize your communication vector to receive priority access to future drops and limited cyber-tier editions.
                    </motion.p>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                    >
                        <div className="flex-1 relative group">
                            <input
                                type="email"
                                placeholder="ACCESS_EMAIL@PROTOCOL.COM"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-all font-bold tracking-widest text-xs"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="liquid"
                            rightIcon={<ArrowRight size={18} />}
                            className="rounded-2xl px-10 py-4 font-black tracking-widest"
                        >
                            AUTHORIZE
                        </Button>
                    </motion.form>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
