import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB86zfc1cAW2Rxigy-I9_7fDp5MaeTJBac",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cvmaker-7516e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cvmaker-7516e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cvmaker-7516e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "508936360589",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:508936360589:web:f15fa7a96f8150c0a0c8c4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.log("Persistence error:", error);
});

export default app;
