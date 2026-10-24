"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CurrencyCode = "LKR" | "USD" | "GBP" | "AUD";
export type LandUnit = "Perches" | "Acres" | "SqFt";

export interface ExchangeRates {
  LKR: number;
  USD: number;
  GBP: number;
  AUD: number;
}

// Indicative rates calibrated with Central Bank of Sri Lanka (CBSL) market rates
export const DEFAULT_RATES: ExchangeRates = {
  LKR: 1,
  USD: 305.0, // 1 USD = 305 LKR
  GBP: 400.0, // 1 GBP = 400 LKR
  AUD: 205.0, // 1 AUD = 205 LKR
};

export const CURRENCY_LABELS: Record<CurrencyCode, { label: string; symbol: string; flag: string }> = {
  LKR: { label: "LKR (Rs.)", symbol: "Rs. ", flag: "🇱🇰" },
  USD: { label: "USD ($)", symbol: "$", flag: "🇺🇸" },
  GBP: { label: "GBP (£)", symbol: "£", flag: "🇬🇧" },
  AUD: { label: "AUD (A$)", symbol: "A$", flag: "🇦🇺" },
};

interface LocalizationContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  landUnit: LandUnit;
  setLandUnit: (u: LandUnit) => void;
  rates: ExchangeRates;
  convertPrice: (priceInLkr: number) => { amount: number; symbol: string; code: CurrencyCode };
  formatPrice: (
    priceInLkr: number,
    listingType?: "For Sale" | "For Rent",
    compact?: boolean
  ) => string;
  formatLandArea: (
    lotSizePerches?: number,
    squareFeet?: number
  ) => { formatted: string; rawValue: number; unit: LandUnit };
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("LKR");
  const [landUnit, setLandUnitState] = useState<LandUnit>("Perches");
  const [rates] = useState<ExchangeRates>(DEFAULT_RATES);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem("remax_currency") as CurrencyCode | null;
      if (savedCurrency && (savedCurrency === "LKR" || savedCurrency === "USD" || savedCurrency === "GBP" || savedCurrency === "AUD")) {
        setCurrencyState(savedCurrency);
      }
      const savedUnit = localStorage.getItem("remax_land_unit") as LandUnit | null;
      if (savedUnit && (savedUnit === "Perches" || savedUnit === "Acres" || savedUnit === "SqFt")) {
        setLandUnitState(savedUnit);
      }
    } catch (_) {}
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem("remax_currency", c);
    } catch (_) {}
  };

  const setLandUnit = (u: LandUnit) => {
    setLandUnitState(u);
    try {
      localStorage.setItem("remax_land_unit", u);
    } catch (_) {}
  };

  const convertPrice = (priceInLkr: number) => {
    const rate = rates[currency];
    const amount = currency === "LKR" ? priceInLkr : priceInLkr / rate;
    const symbol = CURRENCY_LABELS[currency].symbol;
    return { amount, symbol, code: currency };
  };

  const formatPrice = (
    priceInLkr: number,
    listingType?: "For Sale" | "For Rent",
    compact: boolean = false
  ): string => {
    if (priceInLkr === undefined || priceInLkr === null || isNaN(priceInLkr)) {
      return "Rs. 0";
    }

    const { amount, symbol, code } = convertPrice(priceInLkr);
    const suffix = listingType === "For Rent" ? " /mo" : "";

    if (code === "LKR") {
      if (compact) {
        if (amount >= 1000000000) return `Rs. ${(amount / 1000000000).toFixed(2)} Billion${suffix}`;
        if (amount >= 1000000) return `Rs. ${(amount / 1000000).toFixed(1)} Million${suffix}`;
        if (amount >= 100000) return `Rs. ${(amount / 100000).toFixed(1)} Lakhs${suffix}`;
        return `Rs. ${amount.toLocaleString("en-LK")}${suffix}`;
      }
      return `Rs. ${Math.round(amount).toLocaleString("en-LK")}${suffix}`;
    }

    // Diaspora currencies (USD, GBP, AUD)
    if (compact) {
      if (amount >= 1000000) {
        return `${symbol}${(amount / 1000000).toFixed(2)}M ${code}${suffix}`;
      }
      if (amount >= 1000) {
        return `${symbol}${Math.round(amount / 1000)}k ${code}${suffix}`;
      }
      return `${symbol}${Math.round(amount).toLocaleString()} ${code}${suffix}`;
    }

    return `${symbol}${Math.round(amount).toLocaleString()} ${code}${suffix}`;
  };

  const formatLandArea = (
    lotSizePerches?: number,
    squareFeet?: number
  ): { formatted: string; rawValue: number; unit: LandUnit } => {
    // 1 Perch = 272.25 sqft
    // 1 Acre = 160 Perches = 43,560 sqft
    const perches = lotSizePerches && lotSizePerches > 0
      ? lotSizePerches
      : squareFeet && squareFeet > 0
      ? squareFeet / 272.25
      : 0;

    const totalSqft = squareFeet && squareFeet > 0
      ? squareFeet
      : perches > 0
      ? perches * 272.25
      : 0;

    if (landUnit === "Perches") {
      if (perches === 0 && totalSqft > 0) {
        return { formatted: `${Math.round(totalSqft).toLocaleString()} sqft`, rawValue: totalSqft, unit: "SqFt" };
      }
      const val = Number(perches.toFixed(perches % 1 === 0 ? 0 : 2));
      return {
        formatted: `${val} ${val === 1 ? "Perch" : "Perches"}`,
        rawValue: val,
        unit: "Perches",
      };
    }

    if (landUnit === "Acres") {
      const acres = perches / 160;
      const val = Number(acres.toFixed(acres >= 1 ? 2 : 3));
      return {
        formatted: `${val} ${val === 1 ? "Acre" : "Acres"}`,
        rawValue: val,
        unit: "Acres",
      };
    }

    // SqFt
    const val = Math.round(totalSqft);
    return {
      formatted: `${val.toLocaleString()} sqft`,
      rawValue: val,
      unit: "SqFt",
    };
  };

  return (
    <LocalizationContext.Provider
      value={{
        currency,
        setCurrency,
        landUnit,
        setLandUnit,
        rates,
        convertPrice,
        formatPrice,
        formatLandArea,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within a LocalizationProvider");
  }
  return context;
}
