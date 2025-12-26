"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Heart, Star } from "lucide-react";
import Button from "./Button";
import { useCartStore } from "@/stores/cartStore";

import { Product } from "@/types/product";

const ProductCard = ({ product }: { product: Product }) => {
    const [error, setError] = useState(false);
    const { addItem } = useCartStore();

    const imageUrl =
        product.images &&
            product.images[0] &&
            /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(product.images[0])
            ? product.images[0]
            : "/images/product.jpg";

    const finalPrice = product.discountedPrice ?? product.price;

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group glass-card overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col h-full"
        >
            {/* Product Image */}
            <div className="relative aspect-square w-full overflow-hidden">
                <Image
                    src={error ? "/images/product.jpg" : imageUrl}
                    alt={product.name}
                    fill
                    onError={() => setError(true)}
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-80"
                />

                {/* Discount Badge */}
                {product.discountPercent && (
                    <div className="absolute top-4 left-4 bg-sale text-white text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_20px_rgba(255,59,48,0.4)] z-10">
                        -{product.discountPercent}%
                    </div>
                )}

                {/* Heart Icon */}
                <button
                    onClick={(e) => e.preventDefault()}
                    className="absolute right-4 top-4 rounded-xl glass-card p-2 text-foreground/50 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-rose-500 hover:border-rose-500/50"
                >
                    <Heart size={18} />
                </button>
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-1 space-y-3">
                <div className="flex justify-between items-start gap-2">
                    <h2 className="text-lg font-bold text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h2>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-foreground/40">
                        <Star size={10} className="text-yellow-500 fill-yellow-500" />
                        <span>{product.averageRating ?? 0}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {product.discountPercent ? (
                        <>
                            <span className="text-xs text-foreground/30 line-through font-medium">
                                ${product.price}
                            </span>
                            <span className="text-xl font-black text-primary text-glow">${finalPrice}</span>
                        </>
                    ) : (
                        <span className="text-xl font-black text-primary text-glow">${product.price}</span>
                    )}
                </div>

                <div className="pt-2">
                    <Button
                        variant="metal"
                        fullWidth
                        size="sm"
                        className="text-[10px] tracking-[0.2em] font-black py-3 rounded-xl"
                        onClick={(e) => {
                            e.preventDefault();
                            addItem(product._id);
                        }}
                    >
                        ADD TO CART
                    </Button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
