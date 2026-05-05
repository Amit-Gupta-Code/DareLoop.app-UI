import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  handle?: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      isAuthenticated: false,

      setAuth: (user) => {
        set({ user, isAuthenticated: true });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, loading: false });
      },
    }),
    {
      name: "auth",
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated // ✅ persist this too
      }),
    }
  )
);


// // store/authStore.ts
// import { create } from "zustand";
// interface AuthState {
//   user: any;
//   token: string | null;
//   loading: boolean;

//   setAuth: (user: any, token: string) => void;
//   setLoading: (loading: boolean) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   token: localStorage.getItem("access_token"),
//   loading: false,

//   // 1. Validate token shape before trusting it
//   setAuth: (user, token) => {
//     if (typeof token !== "string" || !token.startsWith("ey")) return; // JWT check
//     set({ user, token: token });
//   },

//   setLoading: (loading) => {
//     if (typeof loading !== "boolean") return;
//     set({ loading });
//   },

//   logout: () => {
//     localStorage.removeItem("access_token");
//     set({ user: null, token: null, loading: false });
//   },
// }));