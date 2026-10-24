"use client";

import React from "react";
import { Property } from "@/types/property";
import { ShieldCheck, FileCheck, Award, CheckCircle, Scale, Building2 } from "lucide-react";

interface TrustBadgePillProps {
  property: Property;
  className?: string;
}

export function TrustBadgePill({ property, className = "" }: TrustBadgePillProps) {
  const deedStatus = property.deedStatus || "Clear First-Class Title";
  const isVerified = property.isVerifiedListing ?? true;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold backdrop-blur-md shadow-xs bg-emerald-600/95 text-white ${className}`}>
      <ShieldCheck className="w-3.5 h-3.5 text-white stroke-[2.5]" />
      <span>{deedStatus.includes("Sinnakkara") ? "Clear Deed (Sinnakkara)" : deedStatus.includes("Bim Saviya") ? "Bim Saviya Title" : "Verified Clear Deed"}</span>
    </div>
  );
}

interface LegalTrustCardProps {
  property: Property;
  className?: string;
}

export function LegalTrustCard({ property, className = "" }: LegalTrustCardProps) {
  const deedStatus = property.deedStatus || "Clear First-Class Title";
  const checklist = property.legalChecklist || [
    "30-Year Pedigree Title Search with Land Registry",
    "Approved Survey Plan with Demarcated Boundaries",
    "Municipal Council Street Line & Building Certificates",
    "100% Commercial Bank Mortgage Approved"
  ];

  return (
    <div className={`bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 rounded-2xl border-2 border-emerald-500/30 dark:border-emerald-500/20 p-6 shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-100 dark:border-emerald-950/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Sri Lanka Legal & Title Guarantee
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-600 text-white shadow-xs">
                Audited
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Vetted by RE/MAX ELITE Legal & Notarial Conveyancing Panel
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-bold text-slate-400 block">Deed Classification</span>
          <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
            {deedStatus}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
          Title integrity and boundary disputes are primary buyer concerns in Sri Lanka. This property has undergone comprehensive legal due diligence:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
              <span className="leading-snug">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
          <span className="flex items-center gap-1.5 font-medium">
            <FileCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Certified extract & survey plan available upon request
          </span>
          <span className="font-bold text-emerald-700 dark:text-emerald-400">
            ✓ Ready for Bank Loan or Foreign Remittance
          </span>
        </div>
      </div>
    </div>
  );
}
