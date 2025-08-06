import { Logger } from "../utils/logger";
import { toast } from "svelte-sonner";
import {
  signUpUser,
  signInUser,
  signOutUser as apiSignOut,
  sendPasswordReset,
} from "./auth_api";
import { setLoading, setError, setContent } from "./auth_lce";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "../utils/firebase";
import type { User } from "../schema/auth_schema";

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

    log.info("auth_actions", "Sign Up successful!");
    toast.success("Account Created Successfully");
    return true; // Signup successful
  } catch (error: any) {
    log.error("auth_actions", error.message, error);
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

    log.info("auth_actions", "Login successful!");
    toast.success("Login Successful!");
    return true; // Signin successful
  } catch (error: any) {
    log.error("auth_actions", error.message, error);
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

    log.info("auth_actions", "Logged Out Successfully!");
    toast.success("Logged out Successfully");
  } catch (error: any) {
    toast.error("Error during Log out");
    log.error("auth_actions", error.message, error);
    // Update store with error
    setError(error.message);
  }
};

// Function to handle password reset
export const forgotPassword = async (email: string): Promise<boolean> => {
  if (!email) {
    log.error("auth_actions", "Please enter your email address.");
    toast.error("Please enter your email address.");
    return false;
  }

  try {
    // Send password reset email using API route
    await sendPasswordReset(email);

    log.info(
      "auth_actions",
      "Password reset email sent! Please check your inbox or Spam"
    );
    toast.success("Password reset email sent! Please check your inbox or Spam");
    return true;
  } catch (error: any) {
    const message = "Failed to send password reset email.";
    log.error("auth_actions", message, error);
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
