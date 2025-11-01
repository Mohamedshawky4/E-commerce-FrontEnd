import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Github, Store } from "lucide-react";
import { socials, links, support } from "@/constants";

const Footer = () => {
  return (
    <footer className="w-full bg-surface/80 backdrop-blur-md mt-20">
      {/* Subtle gradient divider */} <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
        {/* Logo + Description */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Store className="text-primary" size={22} />
            <p className="text-xl font-bold text-gradient">E-Commerce</p>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Your one-stop shop for modern, stylish, and affordable products.  
            Discover quality items made for you.
          </p>

          {/* Socials */}
          <div className="flex gap-4 mt-4">
            {socials.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="p-2 rounded-lg hover:bg-primary transition-colors group"
              >
                <social.icon size={22} className="w-5 h-5 text-primary group-hover:text-background transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-primary">Quick Links</h3>
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-primary">Support</h3>
          <ul className="flex flex-col gap-2">
            {support.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border text-center py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} <span className="text-primary font-medium">E-Commerce</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
