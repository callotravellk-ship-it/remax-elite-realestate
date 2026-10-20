"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  PlusCircle,
  LogOut,
  Lock,
  Mail,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading, login, logout, isFirebaseActive } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (!res.success) {
      setAuthError(res.error || "Authentication failed");
    }
  };

  const handleDemoLogin = async () => {
    setAuthError(null);
    setSubmitting(true);
    await login("admin@realestate.com", "admin123456");
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Verifying security session...</p>
        </div>
      </div>
    );
  }

  // If not logged in, render the Secure Admin Login Screen
  if (!user) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-slate-100">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="relative h-14 w-36 mx-auto mb-2">
              <Image
                src="/logo.png"
                alt="RE/MAX ELITE"
                fill
                priority
                className="object-contain block dark:hidden"
              />
              <Image
                src="/logo-dark.png"
                alt="RE/MAX ELITE"
                fill
                priority
                className="object-contain hidden dark:block"
              />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Broker & Admin Portal
            </h1>
            <p className="text-xs text-slate-500">
              Secured with Firebase Authentication & Role Verification
            </p>
          </div>

          {/* Firebase status pill */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-700">Auth Engine:</span>
              <span className={isFirebaseActive ? "text-emerald-700" : "text-blue-900"}>
                {isFirebaseActive ? "● Live Firebase Auth" : "● Demo Evaluation Mode"}
              </span>
            </div>
            {!isFirebaseActive && (
              <p className="text-[11px] text-slate-500">
                To link production Firebase, configure environment variables in <code className="bg-slate-200 px-1 rounded">.env.local</code>.
              </p>
            )}
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@realestate.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/30 disabled:opacity-50"
            >
              {submitting ? "Signing In..." : "Sign In to Admin Portal"}
            </button>
          </form>

          {/* Quick Demo Sign In Button */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold transition-colors"
            >
              ⚡ Instant 1-Click Demo Admin Login
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              Credentials: <code className="text-slate-700 font-bold">admin@realestate.com</code> / <code className="text-slate-700 font-bold">admin123456</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard Layout
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Sub-Header */}
      <div className="bg-slate-950 text-slate-200 border-b-2 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-28">
                <Image
                  src="/logo-dark.png"
                  alt="RE/MAX ELITE"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xs text-white uppercase tracking-wider hidden sm:inline">
                Broker Portal
              </span>
            </div>

            <nav className="flex items-center gap-3 text-xs font-bold">
              <Link
                href="/admin"
                className={`py-1.5 px-3 rounded-lg transition-colors ${
                  pathname === "/admin"
                    ? "bg-red-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Listings
              </Link>
              <Link
                href="/admin/new"
                className={`py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1.5 ${
                  pathname === "/admin/new"
                    ? "bg-red-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add Listing
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400 hidden sm:inline">
              Logged in as <strong className="text-slate-200">{user.email}</strong>
            </span>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
