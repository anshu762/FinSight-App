import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { type UserProfile } from '../api/types';

const TOKEN_KEY = 'finsight_auth_token';
const USER_KEY = 'finsight_auth_user';

export interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isHydrated: boolean;
  isLoading: boolean;
  hydrate: () => Promise<void>;
  login: (token: string, user: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userUpdates: Partial<UserProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isHydrated: false,
  isLoading: false,

  hydrate: async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      const storedUserJson = await SecureStore.getItemAsync(USER_KEY);

      const user = storedUserJson ? (JSON.parse(storedUserJson) as UserProfile) : null;

      set({
        token: storedToken,
        user,
        isHydrated: true,
      });
    } catch {
      set({
        token: null,
        user: null,
        isHydrated: true,
      });
    }
  },

  login: async (token: string, user: UserProfile) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch {
      // SecureStore error fallback
    }

    set({ token, user });
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch {
      // SecureStore error fallback
    }

    set({ token: null, user: null });
  },

  updateUser: async (userUpdates: Partial<UserProfile>) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...userUpdates };
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));
    } catch {
      // SecureStore error fallback
    }

    set({ user: updatedUser });
  },
}));
