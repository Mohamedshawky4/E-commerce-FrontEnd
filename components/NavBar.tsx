"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Heart, ShoppingCart,
  Menu, X, LogOut, Zap
} from "lucide-react";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import Button from "./Button";
import SearchBar from "./SearchBar";
import { navLinks } from "@/constants";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useEffect } from "react";

const NavBar = () => {
  const { logout, token, initializeAuth } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const { items, fetchWishlist } = useWishlistStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token, fetchWishlist]);

  const cartItemCount = getTotalItems();

  return (
    <nav className="w-full h-20 glass-card fixed top-0 left-0 z-50 flex items-center justify-between px-6 md:px-12 rounded-none border-t-0 border-x-0 border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Left: Logo & Theme */}
      <div className="flex items-center gap-6 flex-shrink-0">
        <ThemeToggle />
        <Link
          href="/"
          className="flex items-center gap-3 group"
        >
          <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-white/10 flex items-center justify-center p-1 group-hover:border-primary/50 transition-all duration-500">
            <Image
              src="/logo-Photoroom.png"
              alt="SPECTRA Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="hidden lg:block text-2xl font-black text-metal tracking-tighter group-hover:text-primary transition-colors duration-300">
            SPECTRA<span className="text-primary text-glow">.</span>
          </span>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <SearchBar />
      </div>

      {/* Center/Right: Navigation Links & Actions */}
      <div className="flex items-center gap-4">
        <ul className="hidden xl:flex gap-8 text-[10px] uppercase tracking-[0.3em] font-black mr-4 border-r border-white/10 pr-8">
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
            className="relative p-2.5 rounded-xl border border-border/5 hover:border-border/20 transition-all hover:bg-foreground/5"
          >
            <Heart size={20} className="text-foreground/80" />
            {mounted && items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-md shadow-[0_0_10px_rgba(244,63,94,0.4)]">
                {items.length}
              </span>
            )}
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
              <Button variant="metal" size="sm" onClick={logout} leftIcon={<LogOut size={14} />}>
                LOGOUT
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="liquid" size="sm" leftIcon={<Zap size={14} />}>
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
