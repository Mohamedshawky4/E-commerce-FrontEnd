"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

const faqs = [
    {
        question: "What is the return policy?",
        answer: "We offer a 30-day return window for all products. Items must be in their original condition and packaging. Return shipping is free for all orders over $50."
    },
    {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business day delivery. You'll receive a tracking number as soon as your order ships."
    },
    {
        question: "Are the products authentic?",
        answer: "Yes, we are a certified retailer for all the brands we carry. Every product comes with a manufacturer's warranty and authenticity guarantee."
    },
    {
        question: "Do you ship internationally?",
        answer: "Currently we ship to North America and Europe. We are working on expanding our shipping network to other regions soon."
    }
];

const HomeFAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 px-6 md:px-12 bg-black/2 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10 opacity-50" />

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-foreground to-foreground/50">
                        Common Questions
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`
                                group border rounded-xl overflow-hidden transition-all duration-500
                                ${openIndex === index
                                    ? 'bg-primary/5 border-primary/20 shadow-[0_0_30px_-5px_var(--primary)] shadow-primary/10'
                                    : 'bg-card/30 border-white/5 hover:border-white/10 hover:bg-card/50'}
                            `}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className={`text-lg font-bold pr-8 transition-colors duration-300 ${openIndex === index ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                                    {faq.question}
                                </span>
                                <div className={`
                                    p-2 rounded-full transition-all duration-300
                                    ${openIndex === index ? 'bg-primary text-primary-foreground rotate-180' : 'bg-secondary text-muted-foreground group-hover:text-foreground'}
                                `}>
                                    <Minus size={18} className={`transition-all ${openIndex === index ? 'opacity-100' : 'opacity-0 absolute'}`} />
                                    <Plus size={18} className={`transition-all ${openIndex === index ? 'opacity-0 absolute' : 'opacity-100'}`} />
                                </div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <m.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    >
                                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeFAQ;
