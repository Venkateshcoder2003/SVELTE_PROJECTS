import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../utils/firebase";

// A utility function to create a new user
export const signUpUser = async (
  email: string,
  password: string
): Promise<void> => {
  await createUserWithEmailAndPassword(auth, email, password);
};

// A utility function to sign in an existing user
export const signInUser = async (
  email: string,
  password: string
): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
};

// A utility function to sign out the current user
export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

// A utility function to send a password reset email
export const sendPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};
