"use client";
import React from "react";
import Image from "next/image";
import Button from "../Button";
import { useRouter } from "next/navigation";

const featuredStats = [
  { label: "New Drop", color: "bg-primary text-white" },
  { label: "4.9/5 Reviews", color: "bg-secondary text-foreground font-semibold" },
];

const Hero = () => {
    const router = useRouter();
  return (
    <section className="mt-8 relative w-full min-h-[90vh] md:h-[95vh] max-h-[950px] px-4 sm:px-8 md:px-12 py-12 md:py-0 flex flex-col-reverse md:flex-row items-center justify-center overflow-hidden border-b border-border/40">
      {/* Left Section — Text */}
      <div className=" pl-4 md:pl-12 relative z-20 flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left gap-6 h-full pt-10 md:pt-0 pr-6" >
        {/* Logo */}
        <div className="flex items-center justify-center md:justify-start mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center shadow-lg text-white text-xl md:text-2xl font-black mr-2">
            E
          </div>
          <span className="uppercase tracking-widest font-bold text-primary/90 text-xs md:text-sm">
            E-Shop
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-foreground/95">
          Break Rules—<br />
          <span className="inline-block relative">
            Wear
            <span className="ml-2 text-gradient bg-clip-text text-transparent font-black">
              Future
            </span>
            <span className="block mt-1 w-full h-1 md:h-2 bg-accent rounded-full opacity-40" />
          </span>
        </h1>

        {/* Stats */}
        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
          {featuredStats.map((stat) => (
            <span
              key={stat.label}
              className={`px-3 py-1 text-xs md:text-sm rounded-full font-bold shadow ${stat.color}`}
            >
              {stat.label}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="mt-3 text-base sm:text-lg md:text-xl text-muted font-semibold max-w-md sm:max-w-lg">
          Stunning, authentic goods. Global designers. Easy returns. Luxury for all, delivered fast.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto justify-center md:justify-start">
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push("/products")}
            className="px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-extrabold rounded-xl shadow-lg hover:scale-105 transform transition-all focus:ring-2 focus:ring-primary/30 flex items-center justify-center gap-2"
          >
            Shop the Drop
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h12M13 6l6 6-6 6" />
            </svg>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/products")}
            className="px-8 py-4 text-base sm:text-lg font-medium rounded-xl border-border text-primary hover:bg-accent/10"
          >
            See Collection
          </Button>
        </div>
      </div>

      {/* Right Section — Product Image */}
      <div className="relative flex-1 flex items-center justify-center w-full h-[300px] sm:h-[400px] md:h-full z-10 mt-10 md:mt-0">
       
        {/* Product Image */}
        <div className="relative w-60 sm:w-[320px] md:w-[420px] aspect-3/4 flex items-end justify-center z-20">
          <span className="absolute inset-x-0 top-0 h-1/4 bg-linear-to-b from-primary/10 via-white/0 to-transparent opacity-40 rounded-t-3xl pointer-events-none" />
          <Image
            src="/images/product.jpg"
            alt="Featured Product"
            fill
            className="object-contain rounded-3xl shadow-2xl border border-border/30"
            sizes="(max-width: 768px) 80vw, 40vw"
          />
        </div>

        {/* Floating Offer Card */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[180px] sm:w-[220px] md:block px-4 sm:px-6 py-3 sm:py-4 bg-white shadow-xl rounded-2xl border border-border flex flex-col items-center text-center z-30 animate-float">
          <div className="text-lg sm:text-xl font-extrabold text-primary ">20% OFF</div>
          <div className="text-xs sm:text-sm text-muted">For New Customers</div>
        </div>
      </div>

      {/* Background Gradient + Curve */}
      <div className="absolute left-0 top-0 w-full md:w-1/2 h-full bg-linear-to-r from-primary/3 via-transparent to-transparent pointer-events-none -z-10" />
      <svg
        width="160"
        height="70"
        className="absolute right-6 top-0 z-10 hidden md:block pointer-events-none opacity-20"
      >
        <path d="M0,70 Q85,-40 160,70" fill="none" stroke="var(--accent)" strokeWidth="14" />
      </svg>
    </section>
  );
};

export default Hero;
