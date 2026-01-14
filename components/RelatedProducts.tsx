"use client";
import React from "react";
import { m } from "framer-motion";
import ProductCard from "./ProductCard";
import { useRelatedProducts } from "@/hooks/useProducts";

interface RelatedProductsProps {
    productId: string;
}

const RelatedProducts = ({ productId }: RelatedProductsProps) => {
    const { data: relatedProducts = [], isLoading } = useRelatedProducts(productId);

    if (!isLoading && relatedProducts.length === 0) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-20 border-t border-white/5">
            <m.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-12"
            >
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                    Related <span className="text-primary text-glow">Nodes</span>
                </h2>
                <p className="text-foreground/40 font-bold tracking-widest text-[10px] mt-2">COMPATIBLE VECTOR EXPANSIONS</p>
            </m.div>

            <m.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-4/5 glass-card rounded-4xl animate-pulse bg-white/5" />
                    ))
                ) : (
                    relatedProducts.slice(0, 4).map((product) => (
                        <m.div key={product._id} variants={itemVariants}>
                            <ProductCard product={product} />
                        </m.div>
                    ))
                )}
            </m.div>
        </section>
    );
};

export default RelatedProducts;
