"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme, isMounted } = useTheme();

  // Prevent hydration mismatch by rendering a neutral placeholder until mounted
  if (!isMounted) {
    return (
      <div
        className={`w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 focus:outline-hidden focus:ring-2 focus:ring-red-500/50 ${
        isDark
          ? "bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800 hover:border-slate-600 shadow-sm"
          : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900 shadow-xs"
      } ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 hover:-rotate-12 text-slate-700" />
      )}
    </button>
  );
}
