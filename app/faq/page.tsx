"use client";

import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, ShieldCheck, Truck } from "lucide-react";

const faqs = [
    {
        category: "Delivery Node",
        icon: <Truck size={18} />,
        questions: [
            {
                q: "What protocols do you use for shipping?",
                a: "We authorize tier-1 logistics partners (FedEx, DHL) to ensure your asset arrives within 3-5 standard business cycles."
            },
            {
                q: "Can I track my shipment node in real-time?",
                a: "Yes. Every order generates a unique tracking hash that integrates with our neural tracking map."
            }
        ]
    },
    {
        category: "Security & Encryption",
        icon: <ShieldCheck size={18} />,
        questions: [
            {
                q: "Are my payment transactions secure?",
                a: "All transactions are shielded with 256-bit AES encryption through our Stripe and Paymob nexus gateways."
            },
            {
                q: "Do you store personalized data?",
                a: "Data is anonymized and stored in encrypted shards. We prioritize your digital privacy above all else."
            }
        ]
    },
    {
        category: "Returns & Exchanges",
        icon: <MessageCircle size={18} />,
        questions: [
            {
                q: "What is the return protocol?",
                a: "You have a 14-day window to initiate a return toggle if the asset remains in its original factory state."
            },
            {
                q: "How fast are refunds processed?",
                a: "Once the asset is verified in our intake vault, the refund sequence is completed within 48 hours."
            }
        ]
    }
];

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <m.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl glass-card border-primary/20 text-primary mb-8"
                    >
                        <HelpCircle size={40} className="text-glow" />
                    </m.div>
                    <h1 className="text-5xl md:text-7xl font-black text-metal tracking-tighter uppercase mb-4">
                        QUERY<span className="text-primary text-glow">RECORDS</span>
                    </h1>
                    <p className="text-foreground/50 font-medium">Standard operational procedures and resolution nodes.</p>
                </div>

                <div className="space-y-12">
                    {faqs.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-6">
                            <div className="flex items-center gap-3 text-primary text-[10px] font-black tracking-widest uppercase pb-2 border-b border-primary/10">
                                {group.icon}
                                <span>{group.category}</span>
                            </div>
                            <div className="space-y-4">
                                {group.questions.map((item, qIdx) => {
                                    const id = `${groupIdx}-${qIdx}`;
                                    const isOpen = openIndex === id;

                                    return (
                                        <div
                                            key={qIdx}
                                            className="glass-card rounded-2xl border-white/5 overflow-hidden transition-all duration-300"
                                        >
                                            <button
                                                onClick={() => toggle(id)}
                                                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/2 transition-colors"
                                            >
                                                <span className="font-bold text-foreground/80">{item.q}</span>
                                                <ChevronDown
                                                    size={18}
                                                    className={`text-primary transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
                                                />
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <m.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-6 pt-0 text-foreground/40 leading-relaxed font-medium">
                                                            {item.a}
                                                        </div>
                                                    </m.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 p-12 glass-card rounded-[2.5rem] text-center border-primary/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
                    <h3 className="text-xl font-bold text-white mb-2 uppercase">Still stuck in the void?</h3>
                    <p className="text-foreground/40 mb-8 font-medium">Initialize a direct connection with our support operatives.</p>
                    <button
                        onClick={() => window.location.href = '/contact'}
                        className="px-8 py-3 rounded-xl bg-primary text-background font-black text-xs tracking-[0.2em] uppercase hover:scale-105 transition-transform"
                    >
                        OPEN TICKET
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
