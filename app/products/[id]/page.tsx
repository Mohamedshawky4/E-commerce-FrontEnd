"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProduct } from '@/hooks/useProduct';
import { useCartStore } from '@/stores/cartStore';
import Button from '@/components/Button';
import { Star, Truck, ShieldCheck, ArrowRight, Minus, Plus, Heart, ChevronRight, Share2, ShoppingCart, Maximize2, X } from 'lucide-react';
import Image from 'next/image';
import { ProductVariant } from '@/types/product';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';

const ProductPage = () => {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id as string);
  const { addItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string>('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full" />
        <div className="absolute inset-0 animate-spin border-t-2 border-primary rounded-full" />
      </div>
      <p className="text-[10px] font-black tracking-[0.4em] text-primary uppercase animate-pulse">Initializing Nexus Nexus Link...</p>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold text-red-500">Error</h1>
      <p className="text-muted-foreground">{error || "Product not found"}</p>
      <Button variant="primary" onClick={() => window.location.href = '/products'}>
        Back to Products
      </Button>
    </div>
  );

  const availableSizes = Array.from(new Set(product.variants?.map(v => v.size).filter(Boolean))) as string[];
  const availableColors = Array.from(new Set(product.variants?.map(v => v.color).filter(Boolean))) as string[];

  const matchedVariant = product.variants?.find(v =>
    (selectedSize ? v.size === selectedSize : true) &&
    (selectedColor ? v.color === selectedColor : true)
  );

  const isOutOfStock = product.stock === 0 || (matchedVariant && matchedVariant.stock === 0);
  const canAddToCart = !isOutOfStock &&
    (availableSizes.length > 0 ? selectedSize !== null : true) &&
    (availableColors.length > 0 ? selectedColor !== null : true);

  const finalPrice = product.discountedPrice ?? product.price;

  const handleAddToCart = () => {
    if (canAddToCart) {
      addItem(product._id, quantity, matchedVariant?._id);
    }
  };

  return (
    <div className="min-h-screen px-6 lg:px-16 py-12">
      <Breadcrumbs />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* Product Images */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-3xl overflow-hidden glass-card group cursor-zoom-in" onClick={() => setIsFullScreen(true)}>
            <Image
              src={mainImage || "/images/product.jpg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                <Maximize2 size={32} className="text-white" />
              </div>
            </div>
            {product.discountPercent && (
              <div className="absolute top-6 left-6 bg-sale text-white text-sm font-black px-4 py-2 rounded-full shadow-2xl z-20">
                -{product.discountPercent}% OFF
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); /* Handle wishlist */ }}
              className="absolute top-6 right-6 p-4 rounded-2xl glass-card text-foreground/50 hover:text-rose-500 transition-colors z-20"
            >
              <Heart size={24} />
            </button>
          </div>

          <AnimatePresence>
            {isFullScreen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
                onClick={() => setIsFullScreen(false)}
              >
                <div className="absolute top-8 right-8 z-[110]">
                  <button
                    onClick={() => setIsFullScreen(false)}
                    className="p-4 rounded-2xl glass-card text-foreground/50 hover:text-primary transition-all hover:rotate-90"
                  >
                    <X size={32} />
                  </button>
                </div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="relative w-full h-full max-w-6xl max-h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={mainImage || "/images/product.jpg"}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>

                {/* Thumbnail strip in Fullscreen */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 px-6 py-4 glass-card border-white/10 rounded-3xl max-w-[90vw] overflow-x-auto scrollbar-hide">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMainImage(img);
                        }}
                        className={clsx(
                          "relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all",
                          mainImage === img ? "border-primary scale-110 shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]" : "border-transparent opacity-40"
                        )}
                      >
                        <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={clsx(
                    "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all",
                    mainImage === img ? "border-primary scale-95 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary text-sm font-black tracking-widest uppercase">{product.brand || 'Premium Collection'}</span>
              <span className="text-foreground/20">|</span>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold">{product.averageRating || 0}</span>
              </div>
            </div>
            <h1 className="text-5xl font-black text-foreground mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black text-primary text-glow">${finalPrice}</span>
              {product.discountPercent && (
                <span className="text-xl text-foreground/30 line-through font-medium">
                  ${product.price}
                </span>
              )}
            </div>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed italic border-l-4 border-primary/20 pl-6">
            "{product.description}"
          </p>

          {/* Variant Selectors */}
          <div className="space-y-8 py-8 border-y border-border/50">
            {availableColors.length > 0 && (
              <div className="space-y-4">
                <label className="text-sm font-black tracking-widest uppercase text-foreground/60">Choose Color</label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={clsx(
                        "px-6 py-3 rounded-xl font-bold transition-all border-2",
                        selectedColor === color
                          ? "bg-primary text-background border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                          : "glass-card hover:border-primary/50 text-foreground"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div className="space-y-4">
                <label className="text-sm font-black tracking-widest uppercase text-foreground/60">Select Size</label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={clsx(
                        "w-14 h-14 rounded-xl font-bold transition-all border-2 flex items-center justify-center",
                        selectedSize === size
                          ? "bg-primary text-background border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                          : "glass-card hover:border-primary/50 text-foreground"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <label className="text-sm font-black tracking-widest uppercase text-foreground/60">Quantity</label>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center glass-card rounded-2xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:text-primary transition-colors hover:bg-white/5 rounded-xl"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-black text-xl">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:text-primary transition-colors hover:bg-white/5 rounded-xl"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="text-sm">
                  {matchedVariant ? (
                    <span className={clsx("font-bold", matchedVariant.stock > 0 ? "text-green-500" : "text-rose-500")}>
                      {matchedVariant.stock > 0 ? `${matchedVariant.stock} units available` : "Sold Out"}
                    </span>
                  ) : (
                    <span className={clsx("font-bold", product.stock > 0 ? "text-green-500" : "text-rose-500")}>
                      {product.stock > 0 ? `${product.stock} units available` : "Out of Stock"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant={canAddToCart ? "metal" : "outline"}
              size="lg"
              fullWidth
              disabled={!canAddToCart}
              onClick={handleAddToCart}
              leftIcon={canAddToCart && !isOutOfStock ? <ShoppingCart size={20} /> : undefined}
              className="h-16 text-xs font-black tracking-[0.3em] uppercase"
            >
              {isOutOfStock ? "STRICTLY OUT OF STOCK" : canAddToCart ? "ADD TO CART" : "SELECT OPTIONS"}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="flex items-center gap-4 p-4 glass-card rounded-2xl">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Truck size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-tighter">Fast Delivery</p>
                <p className="text-[10px] text-muted-foreground">Within 2-3 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 glass-card rounded-2xl">
              <div className="p-3 bg-primary/10 rounded-xl">
                <ShieldCheck size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-tighter">Secure Payment</p>
                <p className="text-[10px] text-muted-foreground">100% encrypted privacy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;