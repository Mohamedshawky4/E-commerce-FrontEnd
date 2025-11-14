"use client";
import React from "react";
import { motion } from "framer-motion";

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
return ( <section className="relative  px-8 sm:px-16 md:px-20">
{/* Subtle gradient divider */} <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />


  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.8 }}
    className={`flex flex-wrap justify-center gap-10 mx-auto py-16 ${className}`}
  >
    {features.map((feature, index) => (
      <div
        key={index}
        className="text-center group max-w-xs flex-1 basis-[300px] md:basis-[30%]"
      >
        <div
          className={`w-16 h-16 mx-auto mb-4 bg-linear-to-br from-${feature.color}/20 to-${feature.color}/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          {feature.icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
        <p className="text-muted-foreground text-sm">{feature.description}</p>
      </div>
    ))}
  </motion.div>
</section>


);
};

export default FeatureGrid;
