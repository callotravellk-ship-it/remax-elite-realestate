"use client";

import React, { useState } from "react";
import { PropertyFilterState, POPULAR_AMENITIES } from "@/types/property";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  Building,
  DollarSign,
  Check,
} from "lucide-react";

interface SearchFilterBarProps {
  filters: PropertyFilterState;
  onChange: (filters: PropertyFilterState) => void;
  totalResults: number;
}

export default function SearchFilterBar({
  filters,
  onChange,
  totalResults,
}: SearchFilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, searchQuery: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, propertyType: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filters,
      sortBy: e.target.value as PropertyFilterState["sortBy"],
    });
  };

  const handleBedroomsClick = (beds: number) => {
    onChange({ ...filters, minBedrooms: beds });
  };

  const handleListingTypeClick = (type: "All" | "For Sale" | "For Rent") => {
    let newMinPrice = filters.minPrice;
    let newMaxPrice = filters.maxPrice;

    if (type === "For Rent") {
      if (newMinPrice > 5000000) newMinPrice = 0;
      if (newMaxPrice > 5000000) newMaxPrice = 5000000;
    } else if (type === "For Sale") {
      if (newMaxPrice <= 5000000) newMaxPrice = 1000000000;
    } else {
      if (newMaxPrice <= 5000000) newMaxPrice = 1000000000;
    }

    onChange({
      ...filters,
      listingType: type,
      minPrice: newMinPrice,
      maxPrice: newMaxPrice,
    });
  };

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities;
    const exists = current.includes(amenity);
    const updated = exists
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    onChange({ ...filters, amenities: updated });
  };

  const resetFilters = () => {
    onChange({
      searchQuery: "",
      propertyType: "",
      listingType: "All",
      minPrice: 0,
      maxPrice: 1000000000,
      minBedrooms: 0,
      minBathrooms: 0,
      minSqft: 0,
      amenities: [],
      sortBy: "newest",
    });
  };

  const isRental = filters.listingType === "For Rent";
  const hasPriceFilter = isRental
    ? filters.minPrice > 0 || filters.maxPrice < 5000000
    : filters.minPrice > 0 || filters.maxPrice < 1000000000;

  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.propertyType !== "" ||
    filters.listingType !== "All" ||
    hasPriceFilter ||
    filters.minBedrooms > 0 ||
    filters.minBathrooms > 0 ||
    filters.minSqft > 0 ||
    filters.amenities.length > 0;

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-slate-950/50 p-4 sm:p-6 mb-8 transition-all border-t-4 border-t-red-600">
      {/* Top Listing Type Tabs: All, For Sale, For Rent */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden sm:inline-block">
            Listing Type:
          </span>
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => handleListingTypeClick("All")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filters.listingType === "All" || !filters.listingType
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Listings
            </button>
            <button
              type="button"
              onClick={() => handleListingTypeClick("For Sale")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                filters.listingType === "For Sale"
                  ? "bg-blue-900 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              For Sale
            </button>
            <button
              type="button"
              onClick={() => handleListingTypeClick("For Rent")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                filters.listingType === "For Rent"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
              For Rent
            </button>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Viewing: <span className="font-bold text-slate-900 dark:text-slate-200">{filters.listingType || "All Properties"}</span>
        </div>
      </div>

      {/* Primary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="relative md:col-span-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by city, neighborhood, or keywords..."
            value={filters.searchQuery}
            onChange={handleTextChange}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Property Type Dropdown */}
        <div className="relative md:col-span-3">
          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <select
            value={filters.propertyType}
            onChange={handleTypeChange}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white appearance-none cursor-pointer"
          >
            <option value="" className="dark:bg-slate-800 dark:text-white">All Property Types</option>
            <option value="Luxury Apartment" className="dark:bg-slate-800 dark:text-white">Luxury Apartment</option>
            <option value="House / Bungalow" className="dark:bg-slate-800 dark:text-white">House / Bungalow</option>
            <option value="Colonial Villa" className="dark:bg-slate-800 dark:text-white">Colonial Villa</option>
            <option value="Penthouse" className="dark:bg-slate-800 dark:text-white">Penthouse</option>
            <option value="Commercial Property" className="dark:bg-slate-800 dark:text-white">Commercial Property</option>
            <option value="Residential Land" className="dark:bg-slate-800 dark:text-white">Residential Land</option>
            <option value="Beachfront Villa" className="dark:bg-slate-800 dark:text-white">Beachfront Villa</option>
            <option value="Studio / Bedsit" className="dark:bg-slate-800 dark:text-white">Studio / Bedsit</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative md:col-span-2">
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white appearance-none cursor-pointer"
          >
            <option value="newest" className="dark:bg-slate-800 dark:text-white">Newest First</option>
            <option value="price_asc" className="dark:bg-slate-800 dark:text-white">Price: Low to High</option>
            <option value="price_desc" className="dark:bg-slate-800 dark:text-white">Price: High to Low</option>
            <option value="sqft_desc" className="dark:bg-slate-800 dark:text-white">SqFt: Largest First</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center gap-2 md:col-span-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-semibold rounded-xl border transition-all ${
              showAdvanced || filters.amenities.length > 0 || filters.minBedrooms > 0
                ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-900/60 text-red-900 dark:text-red-300"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>Filters</span>
            {filters.amenities.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center">
                {filters.amenities.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Drawer */}
      {showAdvanced && (
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-5 animate-in fade-in">
          {/* Price Range & Bedrooms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Min Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {filters.listingType === "For Rent"
                  ? "Min Monthly Rent (Rs.)"
                  : "Minimum Price (Rs.)"}
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 dark:text-slate-500">
                  Rs.
                </span>
                <input
                  type="number"
                  step={filters.listingType === "For Rent" ? "25000" : "5000000"}
                  min="0"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    onChange({ ...filters, minPrice: Number(e.target.value) || 0 })
                  }
                  placeholder={
                    filters.listingType === "For Rent"
                      ? "e.g. 150,000"
                      : "e.g. 50,000,000"
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-600 font-semibold"
                />
              </div>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {filters.listingType === "For Rent"
                  ? "Max Monthly Rent (Rs.)"
                  : "Maximum Price (Rs.)"}
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 dark:text-slate-500">
                  Rs.
                </span>
                <input
                  type="number"
                  step={filters.listingType === "For Rent" ? "50000" : "5000000"}
                  min="0"
                  value={
                    filters.listingType === "For Rent"
                      ? filters.maxPrice === 5000000
                        ? ""
                        : filters.maxPrice
                      : filters.maxPrice === 1000000000
                      ? ""
                      : filters.maxPrice
                  }
                  onChange={(e) => {
                    const fallback =
                      filters.listingType === "For Rent" ? 5000000 : 1000000000;
                    onChange({
                      ...filters,
                      maxPrice: Number(e.target.value) || fallback,
                    });
                  }}
                  placeholder={
                    filters.listingType === "For Rent"
                      ? "e.g. 1,000,000"
                      : "e.g. 500,000,000"
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-600 font-semibold"
                />
              </div>
            </div>

            {/* Bedrooms selector */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Bedrooms (Min)
              </label>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4, 5].map((bedCount) => (
                  <button
                    key={bedCount}
                    type="button"
                    onClick={() => handleBedroomsClick(bedCount)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      filters.minBedrooms === bedCount
                        ? "bg-blue-900 text-white border-blue-900 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {bedCount === 0 ? "Any" : `${bedCount}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities Multi-Select Badges */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Desired Amenities & Features
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_AMENITIES.map((amenity) => {
                const selected = filters.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selected
                        ? "bg-red-600 text-white border-red-600 shadow-sm font-semibold"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {selected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Results and Reset Row */}
      <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div>
          Showing <span className="font-bold text-slate-900 dark:text-slate-100">{totalResults}</span>{" "}
          exclusive properties
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
