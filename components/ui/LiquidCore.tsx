"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useSpring, useMotionValue } from "framer-motion";

const LiquidCore = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

        x.set(mouseX * 40); // Max 40px movement
        y.set(mouseY * 40);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full h-full relative group flex items-center justify-center perspective-1000"
        >
            {/* Background Glow */}
            <motion.div
                style={{ x: springX, y: springY, scale: 1.2 }}
                className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full opacity-50 transition-opacity group-hover:opacity-80"
            />

            {/* Main Luxury Asset */}
            <motion.div
                style={{
                    x: springX,
                    y: springY,
                    rotateX: useSpring(useMotionValue(0), springConfig),
                    rotateY: useSpring(useMotionValue(0), springConfig),
                }}
                className="relative w-full h-full max-w-[550px] aspect-square rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,242,255,0.15)] border border-white/10"
            >
                <Image
                    src="/images/liquid_core.png"
                    alt="Genesis Liquid Core"
                    fill
                    className="object-cover scale-110"
                    priority
                />

                {/* Floating Micro-UI Elements */}
                <div className="absolute inset-x-8 bottom-8 flex justify-between items-end">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black tracking-widest text-primary uppercase opacity-60">Status</div>
                        <div className="text-xl font-black text-white tracking-widest">STABLE.01</div>
                    </div>
                    <div className="p-4 rounded-2xl glass-card border-white/5 bg-white/5 backdrop-blur-2xl">
                        <div className="w-12 h-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
                    </div>
                </div>

                {/* Glass Glare Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
            </motion.div>

            {/* Kinetic Secondary Ring */}
            <motion.div
                style={{
                    x: useSpring(x, { ...springConfig, stiffness: 50 }),
                    y: useSpring(y, { ...springConfig, stiffness: 50 }),
                    rotate: 360
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute w-[650px] h-[650px] border border-primary/10 rounded-full border-dashed pointer-events-none"
            />
        </div>
    );
};

export default LiquidCore;
