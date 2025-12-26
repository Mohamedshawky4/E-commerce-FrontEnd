import { create } from "zustand";

interface AuthState {
  email: string | null;
  token: string | null;
  refreshToken: string | null;
  initialized: boolean;
  setUser: (email: string, token: string, refreshToken: string) => void;
  setToken: (token: string) => void;
  setTokens: (token: string, refreshToken: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: null,
  token: null,
  refreshToken: null,
  initialized: false,

  setUser: (email, token, refreshToken) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userEmail", email);
    set({ email, token, refreshToken });
  },

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  setTokens: (token, refreshToken) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    set({ token, refreshToken });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    set({ email: null, token: null, refreshToken: null });
  },

  initializeAuth: () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const email = localStorage.getItem("userEmail");
    set({
      email: email ?? null,
      token: token ?? null,
      refreshToken: refreshToken ?? null,
      initialized: true
    });
  },
}));
