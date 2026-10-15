import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBKZrjTDlFjA8Wu6aS-Vhd2gzsygkMymic",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "remax-elite-real-estate.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "remax-elite-real-estate",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "remax-elite-real-estate.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "866111421041",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:866111421041:web:e29d326cc8ee44b43cf9d0",
};

export const isFirebaseConfigured = Boolean(
  (process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfig.apiKey) &&
  (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfig.projectId)
);

let app: FirebaseApp | undefined;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (typeof window !== "undefined" || isFirebaseConfigured) {
  try {
    if (isFirebaseConfigured) {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
    }
  } catch (error) {
    console.warn("Firebase initialization warning (using local fallback mode):", error);
  }
}

export { app, auth, db, storage };
