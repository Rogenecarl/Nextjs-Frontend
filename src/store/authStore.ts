// src/store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { UserProps } from "@/types/types";

interface User extends UserProps {
  role: "admin" | "provider" | "user";
}
interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

// Using Zustand's persist middleware to sync with Cookies
// export const useAuthStore = create<AuthState>()(
//     persist(
//         (set) => ({
//             token: null,
//             user: null,
//             setToken: (token) => set({ token }),
//             setUser: (user) => set({ user }),
//             clearAuth: () => set({ token: null, user: null}),
//         }),
//         {
//             name: 'authToken', // name of the item in storage
//             // Use js-cookie for storage instead of default localStorage
//             storage: createJSONStorage(() => ({
//                 getItem: (name) => {
//                     const value = Cookies.get(name);
//                     return value ? JSON.stringify({ state: { token: value } }) : null;
//                 },
//                 setItem: (name, value) => {
//                     const { state } = JSON.parse(value);
//                     Cookies.set(name, state.token, { expires: 3000 });
//                 },
//                 removeItem: (name) => Cookies.remove(name),
//             })),

//             partialize: (state) => ({ token: state.token }), // Only persist the token

//         }
//     )
// );

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: Cookies.get("authToken") || null,
      user: null,
      setToken: (token) => {
        set({ token });
        Cookies.set("authToken", token, { expires: 30 });
      },
      setUser: (user) => set({ user }),
      clearAuth: () => {
        set({ token: null, user: null });
        Cookies.remove("authToken");
      },
    }),
    { name: "auth-store" }
  )
);
