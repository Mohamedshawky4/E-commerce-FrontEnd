"use client";

import React, { useState, useEffect } from 'react';

const LazyBackground = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Only mount background effects after the initial client paint
        const timer = setTimeout(() => setMounted(true), 100);
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
