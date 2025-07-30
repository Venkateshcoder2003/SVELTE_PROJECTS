//Import the necessary functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
//Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX7eGs4pexCPUaTDxDU0MQd_t2nKTv_2A",
  authDomain: "to-do-app-e0d20.firebaseapp.com",
  projectId: "to-do-app-e0d20",
  storageBucket: "to-do-app-e0d20.firebasestorage.app",
  messagingSenderId: "357054921830",
  appId: "1:357054921830:web:87e844073b4a7cefc0c1a7",
  measurementId: "G-BWYJJJC8CK",
};

//Initialize the Firebase app with configuration
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); //The Authentication service
export const db = getFirestore(app); //The Firestore Database service
export const storage = getStorage(app); //The Cloud Storage service
