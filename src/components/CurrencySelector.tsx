"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocalization, CurrencyCode, CURRENCY_LABELS } from "@/context/LocalizationContext";
import { Globe, ChevronDown, Check } from "lucide-react";

interface CurrencySelectorProps {
  compact?: boolean;
  className?: string;
}

export default function CurrencySelector({ compact = false, className = "" }: CurrencySelectorProps) {
  const { currency, setCurrency, rates } = useLocalization();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currencies: CurrencyCode[] = ["LKR", "USD", "GBP", "AUD"];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 hover:border-red-500 dark:hover:border-red-500 transition-all shadow-xs"
        aria-label="Select currency"
      >
        <span className="text-sm leading-none">{CURRENCY_LABELS[currency].flag}</span>
        <span className="font-extrabold">{currency}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-slate-950/50 p-2 z-50 animate-in fade-in zoom-in-95">
          <div className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1">
            Diaspora Currency Converter
          </div>

          <div className="space-y-1">
            {currencies.map((code) => {
              const info = CURRENCY_LABELS[code];
              const isSelected = currency === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setCurrency(code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{info.flag}</span>
                    <span className="font-bold">{code}</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {code === "LKR" ? "(Base Rs.)" : `≈ Rs. ${rates[code]}`}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-red-600 dark:text-red-400 stroke-[2.5]" />}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-2 py-1 text-[10px] text-slate-400 text-center">
            Rates indicative for Sri Lankan diaspora
          </div>
        </div>
      )}
    </div>
  );
}
