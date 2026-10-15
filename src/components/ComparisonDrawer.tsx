"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useComparison } from "@/context/ComparisonContext";
import { formatLKR, formatPropertyPrice } from "@/lib/formatters";
import {
  Scale,
  X,
  ChevronUp,
  ChevronDown,
  Trash2,
  ArrowRight,
  Plus,
} from "lucide-react";

export default function ComparisonDrawer() {
  const {
    selectedProperties,
    removeFromCompare,
    clearCompare,
    maxProperties,
    getCompareUrl,
  } = useComparison();

  const [isCollapsed, setIsCollapsed] = useState(false);

  // If no properties are selected, don't show the tray
  if (selectedProperties.length === 0) {
    return null;
  }

  const compareUrl = getCompareUrl();
  const emptySlotsCount = Math.max(0, maxProperties - selectedProperties.length);

  return (
    <aside aria-label="Property Comparison Drawer" className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
      {/* Outer wrapper to handle positioning */}
      <div className="w-full max-w-5xl mx-auto px-4 pb-3 pointer-events-auto transition-all duration-300">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-white">
          {/* Header bar / Minimize Toggle */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/80">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold tracking-tight text-white">
                RE/MAX Comparison Tray
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold shadow-sm">
                {selectedProperties.length} of {maxProperties} Selected
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={clearCompare}
                className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors px-2 py-1 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                title={isCollapsed ? "Expand Drawer" : "Collapse Drawer"}
              >
                {isCollapsed ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Drawer Body (collapsible) */}
          {!isCollapsed && (
            <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Properties Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto flex-1">
                {selectedProperties.map((property) => {
                  const thumb =
                    property.images?.[0] ||
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80";

                  const formattedPrice = formatPropertyPrice(property.price, property.listingType);

                  return (
                    <div
                      key={property.id}
                      className="relative flex items-center gap-3 p-2 bg-slate-800/90 rounded-xl border border-slate-700 group hover:border-red-500/60 transition-all"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-700">
                        <Image
                          src={thumb}
                          alt={property.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1 pr-4">
                        <div className="flex items-center gap-1">
                          {property.listingType === "For Rent" && (
                            <span className="text-[9px] font-black uppercase px-1 rounded bg-emerald-600 text-white">
                              Rent
                            </span>
                          )}
                          <p className="text-xs font-semibold text-slate-100 truncate">
                            {property.title}
                          </p>
                        </div>
                        <p className="text-xs font-black text-red-400">
                          {formattedPrice}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {property.bedrooms}bd • {property.bathrooms}ba • {property.squareFeet}sqft
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCompare(property.id)}
                        className="absolute top-1.5 right-1.5 p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}

                {/* Empty placeholder slots */}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="hidden sm:flex items-center justify-center gap-2 p-2 border border-dashed border-slate-700 rounded-xl text-slate-500 text-xs text-center"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-400" />
                    <span>Slot Available</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="w-full md:w-auto shrink-0 flex items-center gap-2">
                <Link
                  href={compareUrl}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-red-900/40 hover:shadow-red-900/60 transition-all group"
                >
                  <Scale className="w-4 h-4 text-white" />
                  <span>Compare Now</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
