// Import the necessary functions from the Firebase SDKs
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { browser } from "$app/environment";

// Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate configuration
function validateFirebaseConfig() {
  const requiredFields = ["apiKey", "authDomain", "projectId"];
  for (const field of requiredFields) {
    if (!firebaseConfig[field as keyof typeof firebaseConfig]) {
      throw new Error(`Missing Firebase configuration: ${field}`);
    }
  }
}

// Initialize Firebase only on client side or when needed
let app: any;
let auth: any;
let db: any;
let storage: any;

// Initialize Firebase app
try {
  validateFirebaseConfig();
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Create a mock app for SSR to prevent crashes
  if (!browser) {
    app = null;
  } else {
    throw error;
  }
}

// Initialize services only if app exists
if (app) {
  try {
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error("Firebase services initialization error:", error);
  }
}

export { auth, db, storage };
