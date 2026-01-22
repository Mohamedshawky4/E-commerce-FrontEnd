"use client";
import React from "react";
import { m } from "framer-motion";


interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface FeatureGridProps {
  features: Feature[];
  className?: string;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ features, className }) => {
  return (<section className="relative  px-8 sm:px-16 md:px-20">
    {/* Subtle gradient divider */} <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />


    <m.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className={`flex flex-wrap justify-center gap-12 mx-auto py-24 ${className}`}
    >
      {features.map((feature, index) => (
        <div
          key={index}
          className="text-center group max-w-xs flex-1 basis-[300px] md:basis-[28%] glass-card p-10 border-white/5 hover:border-primary/20 transition-all duration-500 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)]"
        >
          <div
            className={`w-20 h-20 mx-auto mb-8 bg-primary/5 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 border border-primary/10 shadow-inner`}
          >
            {feature.icon}
          </div>
          <h3 className="text-xl font-black uppercase tracking-widest mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
          <p className="text-text-muted text-sm leading-relaxed font-medium">{feature.description}</p>
        </div>
      ))}
    </m.div>
  </section>


  );
};

export default FeatureGrid;
