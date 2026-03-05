import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    nombres: string;
    apellidos: string;
    apodo: string;
    rol: 'PLAYER' | 'ADMIN' | 'MODERATOR';
  } | null;
  setAuth: (user: any) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: !!localStorage.getItem('accessToken'),
      user: null,
      
      setAuth: (user) => set({
        isAuthenticated: true,
        user
      }),
      
      clearAuth: () => set({
        isAuthenticated: false,
        user: null
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);