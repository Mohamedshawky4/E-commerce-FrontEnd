"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "./Footer";
import { Toaster } from "sonner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/login");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-float opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full animate-float opacity-50" style={{ animationDelay: '3s' }} />
      </div>

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
