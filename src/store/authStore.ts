// src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface AuthState {
    token: string | null;
    setToken: (token: string) => void;
    clearAuth: () => void;
}

// Using Zustand's persist middleware to sync with Cookies
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            setToken: (token) => set({ token }),
            clearAuth: () => set({ token: null }),
        }),
        {
            name: 'authToken', // name of the item in storage
            // Use js-cookie for storage instead of default localStorage
            storage: createJSONStorage(() => ({
                getItem: (name) => {
                    const value = Cookies.get(name);
                    return value ? JSON.stringify({ state: { token: value } }) : null;
                },
                setItem: (name, value) => {
                    const { state } = JSON.parse(value);
                    Cookies.set(name, state.token, { expires: 30 });
                },
                removeItem: (name) => Cookies.remove(name),
            })),
        }
    )
);