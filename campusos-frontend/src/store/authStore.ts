import { create } from 'zustand';
import { User, AuthResponse } from '../types';
import { authApi } from '../api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  setAuth: (response: AuthResponse) => void;
  setUser: (user: User) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: (() => {
    try {
      const stored = localStorage.getItem('campusos_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('campusos_access_token'),
  refreshToken: localStorage.getItem('campusos_refresh_token'),
  isAuthenticated: !!localStorage.getItem('campusos_access_token'),
  isLoading: !!localStorage.getItem('campusos_access_token'),

  setAuth: (response: AuthResponse, emailFallback?: string) => {
    localStorage.setItem('campusos_access_token', response.accessToken);
    localStorage.setItem('campusos_refresh_token', response.refreshToken);

    const rawRole = (response.user?.role || response.role || 'STUDENT') as string;
    const normalizedRole = rawRole.startsWith('ROLE_') ? rawRole : `ROLE_${rawRole}`;

    const user: User = response.user
      ? { ...response.user, role: normalizedRole as any }
      : {
          id: response.userId || 1,
          email: emailFallback || 'admin@campusos.edu',
          role: normalizedRole as any,
          fullName: response.fullName || 'Campus Member',
          active: true,
        };

    localStorage.setItem('campusos_user', JSON.stringify(user));
    set({
      user,
      token: response.accessToken,
      refreshToken: response.refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  setUser: (user: User) => {
    localStorage.setItem('campusos_user', JSON.stringify(user));
    set({ user });
  },

  login: async (credentials: { email: string; password: string }) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(credentials);
      get().setAuth(response, credentials.email);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('campusos_access_token');
    localStorage.removeItem('campusos_refresh_token');
    localStorage.removeItem('campusos_user');
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initAuth: async () => {
    const token = localStorage.getItem('campusos_access_token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const user = await authApi.getCurrentUser();
      localStorage.setItem('campusos_user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      // Token might be expired or invalid
      console.warn('Initial session validation failed', err);
      // Let refresh interceptor or user session proceed if possible
      set({ isLoading: false });
    }
  },
}));
