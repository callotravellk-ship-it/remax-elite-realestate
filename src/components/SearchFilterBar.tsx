"use client";

import React, { useState } from "react";
import {
  PropertyFilterState,
  POPULAR_AMENITIES,
  SRI_LANKA_DISTRICTS,
  SRI_LANKA_TOWNS_BY_DISTRICT,
  PROXIMITY_OPTIONS,
} from "@/types/property";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  Building,
  Check,
  MapPin,
  ShieldCheck,
  FileCheck,
  Milestone,
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

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, district: e.target.value, town: "" });
  };

  const handleTownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, town: e.target.value });
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
    const current = filters.amenities || [];
    const exists = current.includes(amenity);
    const updated = exists
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    onChange({ ...filters, amenities: updated });
  };

  const toggleProximity = (prox: string) => {
    const current = filters.proximity || [];
    const exists = current.includes(prox);
    const updated = exists
      ? current.filter((p) => p !== prox)
      : [...current, prox];
    onChange({ ...filters, proximity: updated });
  };

  const toggleVerifiedOnly = () => {
    onChange({ ...filters, verifiedOnly: !filters.verifiedOnly });
  };

  const toggleClearDeedOnly = () => {
    onChange({ ...filters, clearDeedOnly: !filters.clearDeedOnly });
  };

  const resetFilters = () => {
    onChange({
      searchQuery: "",
      propertyType: "",
      listingType: "All",
      district: "",
      town: "",
      minPrice: 0,
      maxPrice: 1000000000,
      minBedrooms: 0,
      minBathrooms: 0,
      minSqft: 0,
      amenities: [],
      proximity: [],
      verifiedOnly: false,
      clearDeedOnly: false,
      sortBy: "newest",
    });
  };

  const isRental = filters.listingType === "For Rent";
  const hasPriceFilter = isRental
    ? filters.minPrice > 0 || filters.maxPrice < 5000000
    : filters.minPrice > 0 || filters.maxPrice < 1000000000;

  const activeCount =
    (filters.amenities?.length || 0) +
    (filters.proximity?.length || 0) +
    (filters.district ? 1 : 0) +
    (filters.town ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.clearDeedOnly ? 1 : 0) +
    (filters.minBedrooms > 0 ? 1 : 0);

  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.propertyType !== "" ||
    filters.listingType !== "All" ||
    Boolean(filters.district) ||
    Boolean(filters.town) ||
    Boolean(filters.verifiedOnly) ||
    Boolean(filters.clearDeedOnly) ||
    (filters.proximity && filters.proximity.length > 0) ||
    hasPriceFilter ||
    filters.minBedrooms > 0 ||
    filters.minBathrooms > 0 ||
    filters.minSqft > 0 ||
    (filters.amenities && filters.amenities.length > 0);

  // Available towns based on selected district or default Colombo
  const availableTowns = filters.district
    ? SRI_LANKA_TOWNS_BY_DISTRICT[filters.district] || []
    : SRI_LANKA_TOWNS_BY_DISTRICT["Colombo"] || [];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-slate-950/50 p-4 sm:p-6 mb-8 transition-all border-t-4 border-t-red-600">
      {/* Top Listing Type & Trust Toggles Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden sm:inline-block">
            Listing Type:
          </span>
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => handleListingTypeClick("All")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filters.listingType === "All" || !filters.listingType
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Listings
            </button>
            <button
              type="button"
              onClick={() => handleListingTypeClick("For Sale")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                filters.listingType === "For Sale"
                  ? "bg-blue-900 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              For Sale
            </button>
            <button
              type="button"
              onClick={() => handleListingTypeClick("For Rent")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                filters.listingType === "For Rent"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
              For Rent
            </button>
          </div>

          {/* Trust Filters: Clear Deed & Verified */}
          <div className="flex items-center gap-1.5 ml-0 sm:ml-2">
            <button
              type="button"
              onClick={toggleClearDeedOnly}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                filters.clearDeedOnly
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Clear Deed Only</span>
              {filters.clearDeedOnly && <Check className="w-3 h-3 stroke-[3]" />}
            </button>

            <button
              type="button"
              onClick={toggleVerifiedOnly}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                filters.verifiedOnly
                  ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                  : "bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-900/60 hover:bg-blue-100"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Verified Only</span>
              {filters.verifiedOnly && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Viewing: <span className="font-bold text-slate-900 dark:text-slate-200">{filters.listingType || "All Properties"}</span>
        </div>
      </div>

      {/* Primary Bar: Search, District, Type, Sort, Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="relative md:col-span-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search title, street, or town..."
            value={filters.searchQuery}
            onChange={handleTextChange}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* District Selector (Location-Centric) */}
        <div className="relative md:col-span-2">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 pointer-events-none" />
          <select
            value={filters.district || ""}
            onChange={handleDistrictChange}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white appearance-none cursor-pointer"
          >
            <option value="" className="dark:bg-slate-800 dark:text-white">All Districts</option>
            {SRI_LANKA_DISTRICTS.map((dist) => (
              <option key={dist} value={dist} className="dark:bg-slate-800 dark:text-white">
                {dist} District
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        </div>

        {/* Property Type Dropdown */}
        <div className="relative md:col-span-2">
          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <select
            value={filters.propertyType}
            onChange={handleTypeChange}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white appearance-none cursor-pointer"
          >
            <option value="" className="dark:bg-slate-800 dark:text-white">All Types</option>
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
              showAdvanced || activeCount > 0
                ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-900/60 text-red-900 dark:text-red-300"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>More Filters</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      {showAdvanced && (
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-5 animate-in fade-in">
          {/* Town / Suburb & Bedrooms & Price Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Town / Neighborhood Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Town / Neighborhood
              </label>
              <div className="relative">
                <select
                  value={filters.town || ""}
                  onChange={handleTownChange}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-600 font-semibold appearance-none cursor-pointer"
                >
                  <option value="">All Towns in {filters.district || "Sri Lanka"}</option>
                  {availableTowns.map((town) => (
                    <option key={town} value={town}>
                      {town}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

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
            <div>
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
                        ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {bedCount === 0 ? "Any" : `${bedCount}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location-Centric Proximity to Essential Infrastructure */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Milestone className="w-4 h-4 text-red-600" />
                Proximity to Essential Infrastructure
              </label>
              <span className="text-[11px] text-slate-400">Schools, Hospitals, Expressways & Transport</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PROXIMITY_OPTIONS.map((prox) => {
                const selected = (filters.proximity || []).includes(prox);
                return (
                  <button
                    key={prox}
                    type="button"
                    onClick={() => toggleProximity(prox)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      selected
                        ? "bg-blue-900 text-white border-blue-900 shadow-xs font-semibold"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{prox}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desired Amenities Multi-Select Badges */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Desired Amenities & Features
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_AMENITIES.map((amenity) => {
                const selected = (filters.amenities || []).includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selected
                        ? "bg-red-600 text-white border-red-600 shadow-xs font-semibold"
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
        <div className="flex items-center gap-2">
          <span>
            Showing <span className="font-bold text-slate-900 dark:text-slate-100">{totalResults}</span>{" "}
            exclusive properties
          </span>
          {filters.district && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
              in {filters.district}
            </span>
          )}
          {filters.town && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
              • {filters.town}
            </span>
          )}
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
