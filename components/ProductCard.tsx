"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Heart, Star } from "lucide-react";
import Button from "./Button";

import { Product } from "@/types/product";

const ProductCard = ({ product }: { product: Product }) => {
  const [error, setError] = useState(false);

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
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 
      bg-white/40 dark:bg-white/5 backdrop-blur-xl 
      shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 mb-4"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={error ? "/images/product.jpg" : imageUrl}
          alt={product.name}
          fill
          onError={() => setError(true)}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Discount Badge */}
        {product.discountPercent && (
          <span className="absolute top-3 left-3 bg-red-500/90 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md backdrop-blur-sm">
            -{product.discountPercent}%
          </span>
        )}

        {/* Heart Icon */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 rounded-full bg-white/70 dark:bg-black/30 backdrop-blur-md p-2 text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-red-500 shadow-sm"
        >
          <Heart size={18} />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-between grow p-4 sm:p-5">
        {/* Category */}
        <div className="mb-1 flex flex-wrap gap-1">
          {product.categories?.map((category) => (
            <span
              key={category._id}
              className="text-[11px] text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-white/10 rounded-md px-1.5 py-0.5"
            >
              {category.name}
            </span>
          ))}
        </div>

        {/* Product Name */}
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
          {product.name}
        </h2>

        {/* Rating */}
        <div className="mt-1 flex items-center gap-1 text-yellow-500 text-sm">
          <Star size={14} fill="currentColor" />
          <span className="text-gray-600 dark:text-gray-300">
            {product.averageRating ?? 0}/5
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          {product.discountPercent ? (
            <>
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ${product.price}
              </span>
              <span className="font-bold text-primary">${finalPrice}</span>
            </>
          ) : (
            <span className="font-bold text-primary">${product.price}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm md:text-base rounded-xl backdrop-blur-md hover:scale-[1.02] transition-all"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
