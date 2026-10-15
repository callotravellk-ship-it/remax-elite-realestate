"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

interface AdminUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  isDemo?: boolean;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isFirebaseActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DEMO_STORAGE_KEY = "estate_admin_demo_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase Auth is configured and ready
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          });
        } else {
          // Check for demo session if fallback
          checkDemoSession();
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      checkDemoSession();
      setLoading(false);
    }
  }, []);

  const checkDemoSession = () => {
    try {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    // If using the local demo/fallback credentials, allow instant access
    if (email.trim().toLowerCase() === "admin@realestate.com" && pass === "admin123456") {
      const demoUser: AdminUser = {
        uid: "demo-admin-uid-1",
        email: "admin@realestate.com",
        displayName: "Executive Admin",
        isDemo: true,
      };
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      setLoading(false);
      return { success: true };
    }

    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        setUser({
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName,
        });
        setLoading(false);
        return { success: true };
      } catch (err: unknown) {
        setLoading(false);
        const rawMsg = err instanceof Error ? err.message : "Failed to sign in with Firebase";

        if (rawMsg.includes("auth/configuration-not-found")) {
          return {
            success: false,
            error: "Firebase Authentication is not enabled yet in your Firebase Console for project 'remax-elite-real-estate'. Go to Firebase Console → Build → Authentication → click 'Get Started' and enable 'Email/Password' under the Sign-in method tab. Or use password 'admin123456' with admin@realestate.com for instant access.",
          };
        }
        if (rawMsg.includes("auth/operation-not-allowed")) {
          return {
            success: false,
            error: "Email/Password sign-in provider is disabled in Firebase. Enable it under Firebase Console → Authentication → Sign-in method.",
          };
        }
        if (rawMsg.includes("auth/user-not-found") || rawMsg.includes("auth/invalid-credential")) {
          return {
            success: false,
            error: "User not found or invalid password in Firebase. Add this admin email in Firebase Console → Authentication → Users tab.",
          };
        }

        return { success: false, error: rawMsg };
      }
    }

    setLoading(false);
    return {
      success: false,
      error: "Invalid credentials. Use admin@realestate.com / admin123456 or configure your Firebase Auth keys.",
    };
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error("Firebase sign out error:", e);
      }
    }
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isFirebaseActive: isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
