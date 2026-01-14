"use client";

import React from "react";
import { m } from "framer-motion";
import { Mail, MessageSquare, Phone, Send } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input";

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-20">
                    {/* Left: Info */}
                    <div className="space-y-12">
                        <m.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-6xl md:text-8xl font-black text-metal tracking-tighter uppercase mb-6">
                                CONTACT<span className="text-primary text-glow">NEXUS</span>
                            </h1>
                            <p className="text-foreground/50 text-lg leading-relaxed max-w-md font-medium">
                                Have a technical query or need to verify a signal? Our specialized team is synchronized for your assistance.
                            </p>
                        </m.div>

                        <div className="space-y-8">
                            {[
                                {
                                    icon: Mail,
                                    label: "Digital Vector",
                                    value: "support@spectra-nexus.digital",
                                    sub: "Response within 2 standard cycles",
                                    color: "primary"
                                },
                                {
                                    icon: Phone,
                                    label: "Voice Frequency",
                                    value: "+1 (888) SPECTRA",
                                    sub: "Mon-Fri / 0900 - 1800 EST",
                                    color: "blue"
                                },
                                {
                                    icon: MessageSquare,
                                    label: "Physical Shard",
                                    value: "77 Digital Plaza, Silicon Valley, CA",
                                    sub: "Headquarters Node",
                                    color: "emerald"
                                }
                            ].map((item, i) => (
                                <m.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-6 items-start"
                                >
                                    <div className="p-4 rounded-2xl glass-card border-white/5 bg-white/2">
                                        <item.icon size={24} className={item.color === 'primary' ? 'text-primary' : item.color === 'blue' ? 'text-blue-500' : 'text-emerald-500'} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black tracking-widest text-primary uppercase mb-1">{item.label}</p>
                                        <p className="text-lg font-bold text-white mb-1">{item.value}</p>
                                        <p className="text-xs text-foreground/30">{item.sub}</p>
                                    </div>
                                </m.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Form */}
                    <m.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="glass-card p-8 md:p-12 border-white/5 bg-white/1 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] -mr-32 -mt-32" />

                        <form className="space-y-8 relative z-10">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-foreground/40 uppercase ml-2">Identify Name</label>
                                    <Input placeholder="Enter your designation" variant="outline" className="h-14" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-foreground/40 uppercase ml-2">Return Address</label>
                                    <Input placeholder="email@protocol.com" variant="outline" className="h-14" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-foreground/40 uppercase ml-2">Transmission Subject</label>
                                <Input placeholder="Brief identifier" variant="outline" className="h-14" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-foreground/40 uppercase ml-2">Your Signal</label>
                                <textarea
                                    rows={5}
                                    placeholder="Draft your transmission here..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:text-foreground/20 text-sm"
                                />
                            </div>
                            <Button
                                fullWidth
                                variant="liquid"
                                className="h-16 text-[10px] font-black tracking-[0.4em]"
                                rightIcon={<Send size={18} />}
                            >
                                AUTHORIZE TRANSMISSION
                            </Button>
                        </form>
                    </m.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
