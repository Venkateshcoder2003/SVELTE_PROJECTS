import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyAX7eGs4pexCPUaTDxDU0MQd_t2nKTv_2A",
  authDomain: "to-do-app-e0d20.firebaseapp.com",
  projectId: "to-do-app-e0d20",
  storageBucket: "to-do-app-e0d20.firebasestorage.app",
  messagingSenderId: "357054921830",
  appId: "1:357054921830:web:87e844073b4a7cefc0c1a7",
  measurementId: "G-BWYJJJC8CK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

