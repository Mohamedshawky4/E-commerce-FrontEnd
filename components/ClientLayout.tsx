"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/login");

  return (
    <>
      {!hideNavbar && <NavBar cartItemCount={3} />}
      {children}
    </>
  );
}
