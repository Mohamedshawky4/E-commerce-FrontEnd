import { create } from "zustand";

interface AuthState {
  email: string | null;
  token: string | null;
  initialized: boolean; // 👈 NEW: track when we’ve checked localStorage
  setUser: (email: string, token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: null,
  token: null,
  initialized: false, // 👈 starts false

  setUser: (email, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);
    set({ email, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    set({ email: null, token: null });
  },

  initializeAuth: () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    set({ email: email ?? null, token: token ?? null, initialized: true }); // 👈 mark done
  },
}));
