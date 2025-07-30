//Importing Svelte's writable store for state management
import { writable } from "svelte/store";
//Importing Firebase authentication functions and types
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../utils/firebase"; //Importing Firebase auth instance configured in our project
import type { User, AuthState } from "../models";
import { toast } from "svelte-sonner";

//Initial authentication state
const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

//Create writable store for authentication state
export const authStore = writable<AuthState>(initialState);

//Function to sign up a new user
export const signUp = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    //Update store to show loading state
    authStore.update((state) => ({ ...state, loading: true, error: null }));

    //Create new user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    //Update store with successful signup
    authStore.update((state) => ({
      ...state,
      loading: false,
      error: null,
    }));

    return true; //Signup successful
  } catch (error: any) {
    //Update store with error
    authStore.update((state) => ({
      ...state,
      loading: false,
      error: error.message,
    }));
    return false; //Signup failed
  }
};

//Function to sign in existing user
export const signIn = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    //Update store to show loading state
    authStore.update((state) => ({ ...state, loading: true, error: null }));

    //Sign in user with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    //Update store with successful signin
    authStore.update((state) => ({
      ...state,
      loading: false,
      error: null,
    }));

    return true; //Signin successful
  } catch (error: any) {
    //Update store with error
    authStore.update((state) => ({
      ...state,
      loading: false,
      error: error.message,
    }));
    return false; //Signin failed
  }
};

//Function to sign out current user
export const signOutUser = async (): Promise<void> => {
  try {
    //Tell Firebase to signOut the user
    await signOut(auth);

    //Update store to clear user data
    authStore.update((state) => ({
      ...state,
      user: null,
      error: null,
    }));
  } catch (error: any) {
    //Update store with error
    authStore.update((state) => ({
      ...state,
      error: error.message,
    }));
  }
};

export const forgotPassword = async (email: string): Promise<boolean> => {
  if (!email) {
    toast.error("Please enter your email address.");
    return false;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success("Password reset email sent! Please check your inbox or Spam.");
    return true;
  } catch (error: any) {

    let message = "Failed to send password reset email.";
    if (error.code === "auth/user-not-found") {
      message = "No account found with that email address.";
    }
    toast.error(message);
    return false;
  }
};

//This is a real-time listener that Firebase triggers whenever the user's login state changes
onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
  if (firebaseUser) {
    //If Firebase returns a user object, the user is signed in
    const user: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || undefined,
      creationTime: firebaseUser.metadata.creationTime,
    };

    authStore.update((state) => ({
      ...state,
      user,
      loading: false,
    }));
  } else {
    //User is signed out, clear user data
    authStore.update((state) => ({
      ...state,
      user: null,
      loading: false,
    }));
  }
});
