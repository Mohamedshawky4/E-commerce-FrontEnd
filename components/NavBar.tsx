"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Heart, ShoppingCart,
  Menu, X
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Button from "./Button";
import { navLinks } from "@/constants";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/cartStore";
import { useEffect } from "react";

const NavBar = () => {
  const { logout, token, initializeAuth } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeAuth();
  }, [initializeAuth]);

  const cartItemCount = getTotalItems();

  return (
    <nav className="w-full h-20 glass-card fixed top-0 left-0 z-50 flex items-center justify-between px-6 md:px-12 rounded-none border-t-0 border-x-0 border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Left: Logo & Theme */}
      <div className="flex items-center gap-6">
        <ThemeToggle />
        <Link
          href="/"
          className="text-2xl font-black text-metal tracking-tighter hover:text-primary transition-colors duration-300"
        >
          GENESIS<span className="text-primary text-glow">.</span>
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <ul className="hidden md:flex gap-10 text-sm uppercase tracking-[0.2em] font-bold">
        {navLinks.map((link) => (
          <li key={link.name} className="relative group overflow-hidden">
            <Link
              href={link.href}
              className="transition-colors duration-300 group-hover:text-primary py-2 block"
            >
              {link.name}
            </Link>
            <span className="absolute left-0 bottom-0 w-full h-[1px] bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </li>
        ))}
      </ul>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Wishlist */}
        <Link
          href="/wishlist"
          className="p-2.5 rounded-xl border border-border/5 hover:border-border/20 transition-all hover:bg-foreground/5"
        >
          <Heart size={20} className="text-foreground/80" />
        </Link>

        {/* Cart Icon */}
        <Link
          href="/cart"
          className="relative p-2.5 rounded-xl border border-border/5 hover:border-border/20 transition-all hover:bg-foreground/5"
        >
          <ShoppingCart size={20} className="text-foreground/80" />
          {mounted && cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-background text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-md shadow-[0_0_10px_var(--liquid-mesh-1)]">
              {cartItemCount}
            </span>
          )}
        </Link>

        {/* Auth Buttons */}
        <div className="hidden md:flex gap-3">
          {token ? (
            <Button variant="metal" size="sm" onClick={logout}>
              LOGOUT
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="liquid" size="sm">
                ACCESS
              </Button>
            </Link>
          )}
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(true)}>
            <Menu size={24} />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`absolute top-0 left-0 w-full h-screen glass-card rounded-none flex flex-col items-center justify-center gap-10 transition-all duration-500 z-[100] ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <Button variant="ghost" className="absolute top-6 right-6" onClick={() => setIsMenuOpen(false)}>
          <X size={32} />
        </Button>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
            className="text-4xl font-black text-metal hover:text-primary transition-all tracking-tighter"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
