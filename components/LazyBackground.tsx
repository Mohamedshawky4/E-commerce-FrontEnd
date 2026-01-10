"use client";

import React, { useState, useEffect } from 'react';

const LazyBackground = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Significantly defer background to prioritize LCP and main content
        const mountBackground = () => setMounted(true);

        let timer: ReturnType<typeof setTimeout>;
        if ('requestIdleCallback' in window) {
            (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
                timer = setTimeout(mountBackground, 800);
            });
        } else {
            timer = setTimeout(mountBackground, 1500);
        }

        return () => clearTimeout(timer);
    }, []);


    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-float opacity-50" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full animate-float opacity-50" style={{ animationDelay: '3s' }} />
        </div>
    );
};

export default LazyBackground;
