import { writable } from "svelte/store";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import type { User, AuthState } from "../types";

// Initial authentication state
const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

// Create writable store for authentication state
export const authStore = writable<AuthState>(initialState);

// Function to sign up a new user
export const signUp = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    // Update store to show loading state
    authStore.update((state) => ({ ...state, loading: true, error: null }));

    // Create new user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update store with successful signup
    authStore.update((state) => ({
      ...state,
      loading: false,
      error: null,
    }));

    return true; // Signup successful
  } catch (error: any) {
    // Update store with error
    authStore.update((state) => ({
      ...state,
      loading: false,
      error: error.message,
    }));
    return false; // Signup failed
  }
};

// Function to sign in existing user
export const signIn = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    // Update store to show loading state
    authStore.update((state) => ({ ...state, loading: true, error: null }));

    // Sign in user with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update store with successful signin
    authStore.update((state) => ({
      ...state,
      loading: false,
      error: null,
    }));

    return true; // Signin successful
  } catch (error: any) {
    // Update store with error
    authStore.update((state) => ({
      ...state,
      loading: false,
      error: error.message,
    }));
    return false; // Signin failed
  }
};

// Function to sign out current user
export const signOutUser = async (): Promise<void> => {
  try {
    // Sign out user from Firebase Auth
    await signOut(auth);

    // Update store to clear user data
    authStore.update((state) => ({
      ...state,
      user: null,
      error: null,
    }));
  } catch (error: any) {
    // Update store with error
    authStore.update((state) => ({
      ...state,
      error: error.message,
    }));
  }
};

// Listen for authentication state changes
onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
  if (firebaseUser) {
    // User is signed in, update store with user data
    const user: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || undefined,
    };

    authStore.update((state) => ({
      ...state,
      user,
      loading: false,
    }));
  } else {
    // User is signed out, clear user data
    authStore.update((state) => ({
      ...state,
      user: null,
      loading: false,
    }));
  }
});
