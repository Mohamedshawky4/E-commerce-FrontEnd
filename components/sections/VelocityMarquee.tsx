"use client";
import { useRef } from "react";
import {
    m,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";

interface ParallaxTextProps {
    children: React.ReactNode;
    baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxTextProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        /**
         * This is what changes the direction of the scroll once we
         * switch scrolling directions.
         */
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
            <m.div className="font-black uppercase text-6xl md:text-9xl tracking-tighter flex whitespace-nowrap flex-nowrap gap-16 md:gap-32 opacity-10" style={{ x }}>
                {children}
                {children}
                {children}
                {children}
            </m.div>
        </div>
    );
}

const VelocityMarquee = () => {
    return (
        <section className="py-20 md:py-32 relative z-0 overflow-hidden pointer-events-none select-none">
            <ParallaxText baseVelocity={5}>
                SPECTRA • SONY • APPLE • BOSE • SAMSUNG •
            </ParallaxText>
            <div className="mt-[-20px] md:mt-[-40px] opacity-5">
                <ParallaxText baseVelocity={-5}>
                    FUTURE • INNOVATION • SPEED • POWER • DESIGN •
                </ParallaxText>
            </div>
        </section>
    );
};

export default VelocityMarquee;
