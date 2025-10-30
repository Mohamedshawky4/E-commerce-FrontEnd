"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./Button";

const featuredStats = [
  { label: "New Drop", color: "bg-primary text-white" },
  { label: "4.9/5 Reviews", color: "bg-secondary text-foreground font-semibold" },
];

const heroCategories = [
  { label: "Men", color: "bg-primary/10 text-primary" },
  { label: "Women", color: "bg-accent/10 text-accent" },
  { label: "Tech", color: "bg-secondary/10 text-secondary" },
  { label: "Home", color: "bg-success/10 text-success" },
  { label: "Gifts", color: "bg-pink-100 text-pink-500" },
];

const pressMini = [
  { name: "Vogue", svg: <svg width="54" height="18" viewBox="0 0 54 18"><rect width="54" height="18" rx="3" fill="#F3F4F6"/><text x="50%" y="56%" textAnchor="middle" fill="#888" fontSize="10" fontFamily="sans-serif">VOGUE</text></svg> },
  { name: "GQ", svg: <svg width="36" height="18" viewBox="0 0 36 18"><rect width="36" height="18" rx="3" fill="#F3F4F6"/><text x="50%" y="57%" textAnchor="middle" fill="#888" fontSize="9" fontFamily="sans-serif">GQ</text></svg> },
  { name: "Forbes", svg: <svg width="52" height="18" viewBox="0 0 52 18"><rect width="52" height="18" rx="3" fill="#F3F4F6"/><text x="50%" y="56%" textAnchor="middle" fill="#888" fontSize="10" fontFamily="sans-serif">Forbes</text></svg> },
];

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-10">
      {/* Background full bleed */}
      <div className="absolute inset-0 -z-20">
        <Image src="/images/product.jpg" alt="Hero BG" fill priority className="object-cover object-center brightness-90"/>
        {/* Dark overlay & spotlight vignette */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/20 to-accent/10"/>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/90 to-transparent"/>
      </div>
      {/* Vertical floating nav/chips */}
      <nav className="absolute top-24 left-5 space-y-2 hidden lg:flex flex-col z-30">
        {heroCategories.map(cat => (
          <button
            key={cat.label}
            className={`px-5 py-2 rounded-full font-semibold shadow backdrop-blur-md hover:scale-105 transition text-base border border-border ${cat.color}`}
          >{cat.label}</button>
        ))}
      </nav>
      {/* Text/CTA Floating Card */}
      <div className="relative z-40 max-w-xl w-full ml-0 md:ml-12 mt-16 md:mt-0 bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-border/40 rounded-2xl p-10 shadow-2xl flex flex-col gap-7 items-start animate-fadein">
        <div className="uppercase text-primary font-semibold tracking-wider text-xs">WORLD-CLASS BRANDS</div>
        <h1 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight text-foreground mb-2">
          <span className="inline-block">Redefine Your 
            <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-br from-primary via-accent to-secondary drop-shadow-lg" style={{ WebkitTextStroke: '2px #34b3ff' }}>Style</span>
          </span>
        </h1>
        <p className="text-lg text-muted font-semibold max-w-md">
          Embrace quality, exclusivity, and a new kind of shopping journey—all in one place. Unveil the next drop today.
        </p>
        <Button
          variant="primary"
          size="lg"
          className="px-10 py-5 text-lg font-extrabold rounded-xl shadow-lg hover:scale-105 transform transition-all focus:ring-2 focus:ring-primary/30 group flex items-center gap-3"
        >
          Shop Now
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9h8M11 5l4 4-4 4"/></svg>
          </span>
        </Button>
        <div className="flex gap-4 mt-3 items-center opacity-70">
          <span className="text-xs tracking-wider uppercase font-bold text-muted">Trusted by:</span>
          {pressMini.map(p => <span key={p.name} className="inline-block">{p.svg}</span>)}
        </div>
      </div>
      {/* Product image visual overlay w/ spotlight shadow */}
      <div className="absolute right-0 bottom-0 z-30 flex flex-col items-end justify-end pr-4 md:pr-24 pb-6 md:pb-12">
        <div className="relative w-[220px] h-[320px] md:w-[340px] md:h-[460px] flex items-end justify-center">
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-48 h-8 rounded-full bg-primary/20 blur-xl opacity-50 z-10"/>
          <Image src="/images/product.jpg" alt="Featured Product" fill className="object-contain rounded-2xl shadow-2xl border border-border/40" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
