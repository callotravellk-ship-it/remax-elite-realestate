"use client";

import React from "react";
import { useLocalization, LandUnit } from "@/context/LocalizationContext";

interface LandUnitToggleProps {
  className?: string;
}

export default function LandUnitToggle({ className = "" }: LandUnitToggleProps) {
  const { landUnit, setLandUnit } = useLocalization();

  const units: { code: LandUnit; label: string; tip: string }[] = [
    { code: "Perches", label: "Perches (P)", tip: "1P = 272.25 sqft" },
    { code: "Acres", label: "Acres (Ac)", tip: "1 Ac = 160 Perches" },
    { code: "SqFt", label: "Sq Ft", tip: "Square Feet" },
  ];

  return (
    <div className={`inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1 ${className}`}>
      {units.map((u) => {
        const isActive = landUnit === u.code;
        return (
          <button
            key={u.code}
            type="button"
            onClick={() => setLandUnit(u.code)}
            title={u.tip}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              isActive
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {u.label}
          </button>
        );
      })}
    </div>
  );
}
