"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter((segment) => segment !== "");

    if (pathSegments.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <ol className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase">
                <li className="flex items-center">
                    <Link
                        href="/"
                        className="text-foreground/40 hover:text-primary transition-colors flex items-center gap-1"
                    >
                        <Home size={12} />
                        <span>NEXUS</span>
                    </Link>
                </li>

                {pathSegments.map((segment, index) => {
                    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathSegments.length - 1;
                    const label = decodeURIComponent(segment).replace(/-/g, " ");

                    return (
                        <li key={href} className="flex items-center gap-2">
                            <ChevronRight size={12} className="text-foreground/20" />
                            {isLast ? (
                                <span className="text-primary text-glow">{label}</span>
                            ) : (
                                <Link
                                    href={href}
                                    className="text-foreground/40 hover:text-primary transition-colors"
                                >
                                    {label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
