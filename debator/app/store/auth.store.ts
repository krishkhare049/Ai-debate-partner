import { create } from "zustand";
import { api } from "@/lib/api";

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;

  setAuth: (user: any, token: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  token:
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null,

  loading: true,

  setAuth: (user, token) => {
    localStorage.setItem("token", token);

    set({
      user,
      token,
      loading: false
    });
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      loading: false
    });
  },

  fetchUser: async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        set({ loading: false });
        return;
      }

      const res = await api.get("/auth/me");

      set({
        user: res.data,
        token,
        loading: false
      });

    } catch (error) {
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
        loading: false
      });
    }
  }
}));