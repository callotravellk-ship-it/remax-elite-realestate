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
        const errorMsg = err instanceof Error ? err.message : "Failed to sign in with Firebase";
        return { success: false, error: errorMsg };
      }
    }

    // Demo authentication fallback
    if (email === "admin@realestate.com" && pass === "admin123456") {
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
