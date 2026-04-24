import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthTokens } from '@/types';
import { authApi } from '@/api/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: AuthTokens['player'] | null;
  /**
   * Alias para compatibilidad con componentes que esperan `player`.
   */
  player: AuthTokens['player'] | null;
  refreshToken: string | null;
  setAuth: (payload: AuthTokens | AuthTokens['player'] | null) => void;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: typeof window !== 'undefined' && window.localStorage ? !!localStorage.getItem('accessToken') : false,
      user: null,
      player: null,
      refreshToken: null,
      
      setAuth: (payload) => {
        if (!payload) {
          set({
            isAuthenticated: false,
            user: null,
            player: null,
            refreshToken: null,
          });
          return;
        }

        const looksLikeTokens =
          typeof payload === 'object' &&
          'accessToken' in payload &&
          'refreshToken' in payload &&
          'player' in payload;

        if (looksLikeTokens) {
          const tokens = payload;
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('accessToken', tokens.accessToken);
          }
          set({
            isAuthenticated: true,
            user: tokens.player,
            player: tokens.player,
            refreshToken: tokens.refreshToken,
          });
          return;
        }

        // Compat: si solo recibimos el jugador, igual lo guardamos.
        const p = payload;
        set({
          isAuthenticated: true,
          user: p,
          player: p,
        });
      },

      logout: async () => {
        const refreshToken = useAuthStore.getState().refreshToken;
        try {
          if (refreshToken) await authApi.logout(refreshToken);
        } catch {
          // Ignorar: si falla el backend, igual limpiamos sesión local.
        } finally {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('accessToken');
          }
          set({
            isAuthenticated: false,
            user: null,
            player: null,
            refreshToken: null,
          });
        }
      },
      
      clearAuth: () => set({
        isAuthenticated: false,
        user: null,
        player: null,
        refreshToken: null,
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);