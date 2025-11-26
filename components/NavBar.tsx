"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Heart, ShoppingCart,
  //  Store,
  Menu, X
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Button from "./Button";
import { navLinks } from "@/constants";
import { useAuthStore } from "@/stores/useAuthStore";

interface NavBarProps {
  cartItemCount: number | undefined;
}


const NavBar = ({ cartItemCount }: NavBarProps) => {
  const { initialized, logout, token } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full h-16 bg-surface/65 backdrop-blur-sm flex items-center justify-between px-10 md:px-12 fixed top-0 left-0 z-50 border-b border-border">
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />
        <Link
          href="/"
          className="text-xl font-bold text-gradient-one-time hover:opacity-80 hover:-translate-y-1 transition-all duration-300"
        >
          E-Commerce
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <ul className="hidden md:flex gap-12 text-md font-medium">
        {navLinks.map((link) => (
          <li key={link.name} className="relative group">
            <Link
              href={link.href}
              className="transition-colors duration-200 group-hover:text-primary/50"
            >
              {link.name}
            </Link>
            {/* Hover underline effect */}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
          </li>
        ))}
      </ul>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {/* Wishlist */}
        <Link
          href="/wishlist"
          className="relative p-2 rounded-full hover:bg-muted transition-colors"
        >
          <Heart size={22} />
        </Link>

        {/* Cart Icon */}
        <Link
          href="/cart"
          className="relative p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ShoppingCart size={22} />
          {cartItemCount !== undefined && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {cartItemCount}
            </span>
          )}
        </Link>

        {/* Auth Buttons */}
        <div className="hidden md:flex gap-2">
          {token ? (
            <Button variant="primary" size="sm" className="hover:-translate-y-0.5" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm" className="hover:-translate-y-0.5">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden hover:cursor-pointer">
          <Menu
            size={24}
            onClick={() => setIsMenuOpen(true)}
          />
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`absolute top-0 left-0 w-full h-screen bg-surface/80 backdrop-blur-md flex flex-col items-center justify-center gap-8 transition-all duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <X size={24} onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-10 hover:cursor-pointer" />
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-lg font-medium hover:text-primary transition-colors"
          >
            {link.name}
          </Link>
        ))}
        <div className="flex items-center gap-6">
          <Link href="/login">
            <Button variant="primary" size="md" className="hover:-translate-y-0.5">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
