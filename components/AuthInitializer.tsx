
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
