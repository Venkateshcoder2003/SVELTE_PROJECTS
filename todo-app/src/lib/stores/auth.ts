// //Importing Svelte's writable store for state management
// import { writable } from "svelte/store";
// //Importing Firebase authentication functions and types
// import {
//   onAuthStateChanged,
//   type User as FirebaseUser,
// } from "firebase/auth";
// import { auth } from "../utils/firebase"; //Importing Firebase auth instance configured in our project
// import type { User, AuthState } from "../types/models";
// import { Logger } from "../utils/logger";
// import { toast } from "svelte-sonner";
// import {
//   signUpUser,
//   signInUser,
//   signOutUser as apiSignOut,
//   sendPasswordReset
// } from "../utils/api_routes";

// //create a instance of Logger class
// const log = Logger.getInstance();

// //Initial authentication state
// const initialState: AuthState = {
//   user: null,
//   loading: true,
//   error: null,
// };

// //Create writable store for authentication state
// export const authStore = writable<AuthState>(initialState);

// //Function to sign up a new user
// export const signUp = async (
//   email: string,
//   password: string
// ): Promise<boolean> => {
//   try {
//     //Update store to show loading state
//     authStore.update((state) => ({ ...state, loading: true, error: null }));

//     //Create new user using API route
//     await signUpUser(email, password);

//     //Update store with successful signup
//     authStore.update((state) => ({
//       ...state,
//       loading: false,
//       error: null,
//     }));

//     log.info("auth", "Sign Up successful!");
//     toast.success("Account Created Successfully");
//     return true; //Signup successful
//   } catch (error: any) {
//     log.error("auth", error.message, error);
//     toast.error("Account creation Failed");
//     //Update store with error
//     authStore.update((state) => ({
//       ...state,
//       loading: false,
//       error: error.message,
//     }));
//     return false; //Signup failed
//   }
// };

// //Function to sign in existing user
// export const signIn = async (
//   email: string,
//   password: string
// ): Promise<boolean> => {
//   try {
//     //Update store to show loading state
//     authStore.update((state) => ({ ...state, loading: true, error: null }));

//     //Sign in user using API route
//     await signInUser(email, password);

//     //Update store with successful signin
//     authStore.update((state) => ({
//       ...state,
//       loading: false,
//       error: null,
//     }));
//     log.info("auth", "Login successful!");
//     toast.success("Login Successful!");
//     return true; //Signin successful
//   } catch (error: any) {
//     log.error("auth", error.message, error);
//     toast.error("Login Failed!");
//     //Update store with error
//     authStore.update((state) => ({
//       ...state,
//       loading: false,
//       error: error.message,
//     }));
//     return false; //Signin failed
//   }
// };

// //Function to sign out current user
// export const signOutUser = async (): Promise<void> => {
//   try {
//     //Sign out user using API route
//     await apiSignOut();

//     //Update store to clear user data
//     authStore.update((state) => ({
//       ...state,
//       user: null,
//       error: null,
//     }));
//     log.info("auth", "Logged Out Successfully!");
//     toast.success("Logged out Successfully");
//   } catch (error: any) {
//     toast.error("Error during Log out");
//     log.error("auth", error.message, error);
//     //Update store with error
//     authStore.update((state) => ({
//       ...state,
//       error: error.message,
//     }));
//   }
// };

// //Function to handle password reset
// export const forgotPassword = async (email: string): Promise<boolean> => {
//   if (!email) {
//     log.error("auth", "Please enter your email address.");
//     toast.error("Please enter your email address.");
//     return false;
//   }
//   try {
//     //Send password reset email using API route
//     await sendPasswordReset(email);
//     log.info(
//       "auth",
//       "Password reset email sent! Please check your inbox or Spam"
//     );
//     toast.success("Password reset email sent! Please check your inbox or Spam");
//     return true;
//   } catch (error: any) {
//     let message = "Failed to send password reset email.";
//     log.error("auth", message, error);
//     toast.error("Failed to send password reset email");
//     return false;
//   }
// };

// //This is a real-time listener that Firebase triggers whenever the user's login state changes
// onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
//   if (firebaseUser) {
//     //If Firebase returns a user object, the user is signed in
//     const user: User = {
//       uid: firebaseUser.uid,
//       email: firebaseUser.email || "",
//       displayName: firebaseUser.displayName || undefined,
//       creationTime: firebaseUser.metadata.creationTime,
//     };

//     authStore.update((state) => ({
//       ...state,
//       user,
//       loading: false,
//     }));
//   } else {
//     //User is signed out, clear user data
//     authStore.update((state) => ({
//       ...state,
//       user: null,
//       loading: false,
//     }));
//   }
// });

// auth.ts - Authentication functions using LCE store pattern
import { Logger } from "../utils/logger";
import { toast } from "svelte-sonner";
import {
  signUpUser,
  signInUser,
  signOutUser as apiSignOut,
  sendPasswordReset,
} from "../utils/auth_routes";
import { setLoading, setError, setContent } from "../utils/auth_lce";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "../utils/firebase";
import type { User } from "../types/models";

// Create an instance of Logger class
const log = Logger.getInstance();

// Function to sign up a new user
export const signUp = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    // Update store to show loading state
    setLoading(true);
    setError(null);

    // Create new user using API route
    await signUpUser(email, password);

    // Update store with successful signup
    setLoading(false);

    log.info("auth", "Sign Up successful!");
    toast.success("Account Created Successfully");
    return true; // Signup successful
  } catch (error: any) {
    log.error("auth", error.message, error);
    toast.error("Account creation Failed");

    // Update store with error
    setLoading(false);
    setError(error.message);
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
    setLoading(true);
    setError(null);

    // Sign in user using API route
    await signInUser(email, password);

    // Update store with successful signin
    setLoading(false);

    log.info("auth", "Login successful!");
    toast.success("Login Successful!");
    return true; // Signin successful
  } catch (error: any) {
    log.error("auth", error.message, error);
    toast.error("Login Failed!");

    // Update store with error
    setLoading(false);
    setError(error.message);
    return false; // Signin failed
  }
};

// Function to sign out current user
export const signOutUser = async (): Promise<void> => {
  try {
    // Sign out user using API route
    await apiSignOut();

    // Update store to clear user data
    setContent(null);
    setError(null);

    log.info("auth", "Logged Out Successfully!");
    toast.success("Logged out Successfully");
  } catch (error: any) {
    toast.error("Error during Log out");
    log.error("auth", error.message, error);

    // Update store with error
    setError(error.message);
  }
};

// Function to handle password reset
export const forgotPassword = async (email: string): Promise<boolean> => {
  if (!email) {
    log.error("auth", "Please enter your email address.");
    toast.error("Please enter your email address.");
    return false;
  }

  try {
    // Send password reset email using API route
    await sendPasswordReset(email);

    log.info(
      "auth",
      "Password reset email sent! Please check your inbox or Spam"
    );
    toast.success("Password reset email sent! Please check your inbox or Spam");
    return true;
  } catch (error: any) {
    const message = "Failed to send password reset email.";
    log.error("auth", message, error);
    toast.error("Failed to send password reset email");
    return false;
  }
};

// Firebase auth state listener
onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
  if (firebaseUser) {
    // If Firebase returns a user object, the user is signed in
    const user: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || undefined,
      creationTime: firebaseUser.metadata.creationTime,
    };

    setContent(user);
    setLoading(false); // Stop loading after user is set
  } else {
    // User is signed out, clear user data
    setContent(null);
    setLoading(false); // Stop loading even when no user
  }
});
