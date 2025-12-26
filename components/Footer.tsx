import React from "react";
import Link from "next/link";
import {
  // Facebook, Instagram, Twitter, Github,
  Store
} from "lucide-react";
import { socials, links, support } from "@/constants";

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-border glass-card rounded-none py-16 mt-20">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6 md:col-span-2">
          <Link href="/" className="text-3xl font-black text-metal tracking-tighter">
            GENESIS<span className="text-primary text-glow">.</span>
          </Link>
          <p className="text-text-muted max-w-sm leading-relaxed font-medium">
            Defining the next era of digital commerce. We blend cutting-edge technology with high-end aesthetics to bring you the future, today.
          </p>
          <div className="flex gap-4">
            {socials.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:border-primary transition-all group"
              >
                <social.icon size={18} className="text-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-6">
          <h3 className="text-xs font-black tracking-[0.3em] uppercase text-primary">Nexus</h3>
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-sm font-bold text-foreground/60 hover:text-foreground transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-6">
          <h3 className="text-xs font-black tracking-[0.3em] uppercase text-primary">Support</h3>
          <ul className="space-y-4">
            {support.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="text-sm font-bold text-foreground/60 hover:text-foreground transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black tracking-[0.2em] text-foreground/20 uppercase">
        <p>© {new Date().getFullYear()} GENESIS DIGITAL</p>
        <p>FORGED BY ANTIGRAVITY</p>
      </div>
    </footer>
  );
};

export default Footer;
