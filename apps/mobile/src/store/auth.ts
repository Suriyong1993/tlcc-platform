import { create } from 'zustand';
import { getItem, setItem, deleteItemAsync } from 'expo-secure-store';
import api from '../lib/api';

interface User { id: string; email: string; username: string; role: string; profile?: any }

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  initialized: false,

  checkAuth: async () => {
    try {
      const token = await getItem('accessToken');
      if (token) {
        set({ token });
        const { data } = await api.get('/users/me');
        set({ user: data });
      }
    } catch {
      await deleteItemAsync('accessToken');
    } finally {
      set({ initialized: true });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await setItem('accessToken', data.accessToken);
      await setItem('refreshToken', data.refreshToken);
      const { data: user } = await api.get('/users/me');
      set({ user, token: data.accessToken });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email: string, username: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/register', { email, username, password });
      await setItem('accessToken', data.accessToken);
      await setItem('refreshToken', data.refreshToken);
      const { data: user } = await api.get('/users/me');
      set({ user, token: data.accessToken });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await deleteItemAsync('accessToken');
    await deleteItemAsync('refreshToken');
    set({ user: null, token: null });
  },

  fetchProfile: async () => {
    try {
      const { data } = await api.get('/users/me');
      set({ user: data });
    } catch { /* ignore */ }
  },
}));
