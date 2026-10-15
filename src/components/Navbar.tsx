"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useComparison } from "@/context/ComparisonContext";
import { useAuth } from "@/context/AuthContext";
import {
  Scale,
  ShieldCheck,
  Menu,
  X,
  Compass,
  PlusCircle,
  LogOut,
  Info,
  Phone,
  Home,
  KeyRound,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { selectedProperties } = useComparison();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const compareCount = selectedProperties.length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-28 sm:w-32 flex items-center">
              <Image
                src="/logo.png"
                alt="RE/MAX ELITE"
                fill
                priority
                className="object-contain object-left group-hover:scale-105 transition-transform"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/?type=sale"
              className="text-sm font-semibold transition-colors hover:text-red-600 text-slate-700 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>For Sale</span>
            </Link>

            <Link
              href="/?type=rent"
              className="text-sm font-semibold transition-colors hover:text-red-600 text-slate-700 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>For Rent</span>
            </Link>

            <Link
              href="/"
              className={`text-sm font-bold transition-colors hover:text-red-600 ${
                pathname === "/" ? "text-red-600" : "text-slate-700"
              }`}
            >
              All Listings
            </Link>

            <Link
              href="/compare"
              className={`text-sm font-semibold transition-colors hover:text-red-600 flex items-center gap-2 ${
                pathname.startsWith("/compare")
                  ? "text-red-600 border-b-2 border-red-600 pb-1"
                  : "text-slate-700"
              }`}
            >
              <Scale className="w-4 h-4 text-blue-700" />
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full shadow-sm animate-pulse">
                  {compareCount}
                </span>
              )}
            </Link>

            <Link
              href="/about"
              className={`text-sm font-semibold transition-colors hover:text-red-600 ${
                pathname === "/about" ? "text-red-600 border-b-2 border-red-600 pb-1" : "text-slate-700"
              }`}
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className={`text-sm font-semibold transition-colors hover:text-red-600 ${
                pathname === "/contact" ? "text-red-600 border-b-2 border-red-600 pb-1" : "text-slate-700"
              }`}
            >
              Contact
            </Link>

            <Link
              href="/admin"
              className={`text-sm font-semibold transition-colors hover:text-red-600 flex items-center gap-1.5 ${
                pathname.startsWith("/admin")
                  ? "text-red-600 border-b-2 border-red-600 pb-1"
                  : "text-slate-700"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Desktop CTA / Auth info */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 rounded-full py-1.5 px-4 border border-slate-200/90 shadow-xs transition-colors">
              <span className="text-xs font-semibold text-slate-800 truncate max-w-[150px]">
                {user ? user.email : "admin@realestate.com"}
              </span>
              {user ? (
                <button
                  onClick={() => logout()}
                  title="Sign out"
                  className="text-slate-400 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link
                  href="/admin"
                  title="Admin login"
                  className="text-slate-400 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 rotate-180" />
                </Link>
              )}
            </div>

            <Link
              href="/admin/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-full shadow-md shadow-red-600/30 hover:shadow-red-600/50 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Listing</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden gap-3">
            <Link
              href="/compare"
              className="relative p-2 text-slate-700 hover:text-red-600"
              aria-label="Compare Tray"
            >
              <Scale className="w-6 h-6 text-blue-700" />
              {compareCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-800 hover:text-red-600 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 space-y-3 animate-in slide-in-from-top-2">
            <Link
              href="/?type=sale"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-900 font-semibold"
            >
              <Home className="w-5 h-5 text-blue-700" />
              <span>Properties For Sale</span>
            </Link>
            <Link
              href="/?type=rent"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold"
            >
              <KeyRound className="w-5 h-5 text-emerald-600" />
              <span>Properties For Rent</span>
            </Link>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-700 font-semibold"
            >
              <Compass className="w-5 h-5 text-red-600" />
              All Properties
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-900 font-semibold"
            >
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-blue-700" />
                Side-by-Side Comparison
              </div>
              {compareCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                  {compareCount}
                </span>
              )}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-700 font-semibold"
            >
              <Info className="w-5 h-5 text-red-600" />
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-900 font-semibold"
            >
              <Phone className="w-5 h-5 text-blue-700" />
              Contact Specialists
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
            >
              <ShieldCheck className="w-5 h-5 text-blue-700" />
              Admin Portal
            </Link>
            <Link
              href="/admin/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-red-600 text-white font-bold"
            >
              <PlusCircle className="w-5 h-5" />
              Create Listing
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
