// stores/lce.ts - Loading, Content, Error pattern for auth store
import { writable } from "svelte/store";
import type { User, AuthState } from "../schema/auth_schema";

// Initial authentication state
const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

// Create writable store for authentication state
export const authStore = writable<AuthState>(initialState);

// LCE Store action functions
export const setLoading = (loading: boolean) => {
  authStore.update((state) => ({ ...state, loading }));
};

export const setError = (error: string | null) => {
  authStore.update((state) => ({ ...state, error }));
};

export const setContent = (user: User | null) => {
  authStore.update((state) => ({ ...state, user }));
};
