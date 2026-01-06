"use client";

import React from "react";
import { m } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Fashion Blogger",
        content: "The quality of the clothes is absolutely amazing. I've never felt more confident in an outfit before!",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Verified Buyer",
        content: "Fast shipping and excellent customer service. The product arrived exactly as described. Highly recommended!",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
        id: 3,
        name: "Emily Davis",
        role: "Designer",
        content: "I love the attention to detail in every piece. It's rare to find such high-quality craftsmanship at this price point.",
        rating: 4,
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    },
];

const Testimonials = () => {
    return (
        <section className="py-20 bg-surface">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what our community has to say about their experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <m.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-background p-8 rounded-2xl border border-border hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={`${i < testimonial.rating
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-foreground/80 mb-6 leading-relaxed">
                                "{testimonial.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </div>
                        </m.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
