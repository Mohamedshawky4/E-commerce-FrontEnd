"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "./Footer";
import { Toaster } from "sonner";
import LazyBackground from "./LazyBackground";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/login");

  return (
    <div className="flex flex-col min-h-screen">
      <LazyBackground />

      {!hideNavbar && <NavBar />}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={!hideNavbar ? "pt-20" : ""}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Toaster
        position="top-right"
        richColors
        theme="dark"
        toastOptions={{
          className: "glass-card border-white/10 text-foreground font-medium",
        }}
      />
      <Footer />
    </div>
  );
}
