"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useComparison } from "@/context/ComparisonContext";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Home,
  Building2,
  List,
  BarChart3,
  Users,
  Mail,
  Settings,
  User,
  LogOut,
  Plus,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedProperties } = useComparison();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const compareCount = selectedProperties.length;

  const handleNavTypeClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    type: "sale" | "rent" | "all"
  ) => {
    if (pathname === "/") {
      e.preventDefault();
      const targetQuery = type === "all" ? "" : `?type=${type}`;
      router.push(`/${targetQuery}#listings`, { scroll: false });

      const el = document.getElementById("listings");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleMobileNavTypeClick = (type: "sale" | "rent" | "all") => {
    setMobileMenuOpen(false);
    if (pathname === "/") {
      const targetQuery = type === "all" ? "" : `?type=${type}`;
      router.push(`/${targetQuery}#listings`, { scroll: false });
      setTimeout(() => {
        const el = document.getElementById("listings");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with actual RE/MAX ELITE branding */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative h-10 flex items-center">
              {/* Light Mode Logo */}
              <Image
                src="/logo.png"
                alt="RE/MAX ELITE"
                width={140}
                height={70}
                priority
                className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105 block dark:hidden"
              />
              {/* Dark Mode Logo */}
              <Image
                src="/logo-dark.png"
                alt="RE/MAX ELITE"
                width={160}
                height={65}
                priority
                className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105 hidden dark:block"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
            {/* For Sale */}
            <Link
              href="/?type=sale#listings"
              onClick={(e) => handleNavTypeClick(e, "sale")}
              className="text-sm font-semibold transition-colors hover:text-red-600 dark:hover:text-red-400 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Home className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              <span>For Sale</span>
            </Link>

            {/* For Rent */}
            <Link
              href="/?type=rent#listings"
              onClick={(e) => handleNavTypeClick(e, "rent")}
              className="text-sm font-semibold transition-colors hover:text-red-600 dark:hover:text-red-400 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>For Rent</span>
            </Link>

            {/* All Listings (Active tab styling with red pill and underline) */}
            <Link
              href="/#listings"
              onClick={(e) => handleNavTypeClick(e, "all")}
              className={`text-sm flex items-center gap-1.5 transition-all relative ${
                pathname === "/"
                  ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-bold px-3.5 py-1.5 rounded-xl shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-semibold px-2 py-1.5"
              }`}
            >
              <List className="w-4 h-4" />
              <span>All Listings</span>
              {pathname === "/" && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-red-600 rounded-full" />
              )}
            </Link>

            {/* Compare */}
            <Link
              href="/compare"
              className={`text-sm font-semibold transition-colors hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 relative ${
                pathname.startsWith("/compare")
                  ? "text-red-600 dark:text-red-400 font-bold"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold text-white bg-red-600 rounded-full shadow-xs">
                  {compareCount}
                </span>
              )}
              {pathname.startsWith("/compare") && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-red-600 rounded-full" />
              )}
            </Link>

            {/* About Us */}
            <Link
              href="/about"
              className={`text-sm font-semibold transition-colors hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 relative ${
                pathname === "/about" ? "text-red-600 dark:text-red-400 font-bold" : "text-slate-700 dark:text-slate-300"
              }`}
            >
              <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>About Us</span>
              {pathname === "/about" && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-red-600 rounded-full" />
              )}
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className={`text-sm font-semibold transition-colors hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 relative ${
                pathname === "/contact" ? "text-red-600 dark:text-red-400 font-bold" : "text-slate-700 dark:text-slate-300"
              }`}
            >
              <Mail className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Contact</span>
              {pathname === "/contact" && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-red-600 rounded-full" />
              )}
            </Link>
          </nav>

          {/* Desktop CTA & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle (Right before Post Listing) */}
            <ThemeToggle />

            {/* Post Listing Pill Button */}
            <Link
              href="/admin/new"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-extrabold uppercase tracking-wide text-white bg-[#E02424] hover:bg-red-700 rounded-full shadow-md shadow-red-600/30 hover:shadow-red-600/50 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>POST LISTING</span>
            </Link>
          </div>

          {/* Mobile Menu Button & Mobile Theme Toggle */}
          <div className="flex items-center lg:hidden gap-2">
            <ThemeToggle />
            <Link
              href="/compare"
              className="relative p-2 text-slate-700 dark:text-slate-300 hover:text-red-600"
              aria-label="Compare Tray"
            >
              <BarChart3 className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              {compareCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-800 dark:text-slate-200 hover:text-red-600 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 space-y-2 animate-in slide-in-from-top-2">
            <Link
              href="/?type=sale#listings"
              onClick={() => handleMobileNavTypeClick("sale")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold"
            >
              <Home className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>For Sale</span>
            </Link>
            <Link
              href="/?type=rent#listings"
              onClick={() => handleMobileNavTypeClick("rent")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold"
            >
              <Building2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>For Rent</span>
            </Link>
            <Link
              href="/#listings"
              onClick={() => handleMobileNavTypeClick("all")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/50 font-bold"
            >
              <List className="w-5 h-5 text-red-600" />
              <span>All Listings</span>
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span>Compare</span>
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold"
            >
              <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span>About Us</span>
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold"
            >
              <Mail className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span>Contact</span>
            </Link>
            <div className="pt-2">
              <Link
                href="/admin/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#E02424] text-white font-extrabold uppercase text-xs shadow-md shadow-red-600/30"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>POST LISTING</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
