"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import SearchFilterBar from "@/components/SearchFilterBar";
import { Property, PropertyFilterState, ListingType } from "@/types/property";
import { getProperties } from "@/lib/propertyService";
import {
  Scale,
  Sparkles,
  ArrowRight,
  Building2,
  CheckCircle2,
  MapPin,
  Compass,
  Search,
  KeyRound,
  Home,
} from "lucide-react";

const initialFilters: PropertyFilterState = {
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
};

function UrlTypeWatcher({
  onSelectType,
}: {
  onSelectType: (type: "All" | "For Sale" | "For Rent") => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam === "sale" || typeParam === "for-sale") {
      onSelectType("For Sale");
    } else if (typeParam === "rent" || typeParam === "for-rent") {
      onSelectType("For Rent");
    } else if (typeParam === "all") {
      onSelectType("All");
    }
  }, [searchParams, onSelectType]);

  return null;
}

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<PropertyFilterState>(initialFilters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (err) {
        console.error("Error loading properties:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((item) => {
        // Listing Type filter (For Sale vs For Rent)
        if (filters.listingType && filters.listingType !== "All") {
          if (item.listingType !== filters.listingType) {
            return false;
          }
        }

        // Search query
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchCity = item.address.city.toLowerCase().includes(query);
          const matchNeighborhood = item.address.neighborhood?.toLowerCase().includes(query);
          const matchType = item.propertyType.toLowerCase().includes(query);
          const matchListingType = item.listingType?.toLowerCase().includes(query);
          if (!matchTitle && !matchCity && !matchNeighborhood && !matchType && !matchListingType) {
            return false;
          }
        }

        // Property type
        if (filters.propertyType && item.propertyType !== filters.propertyType) {
          return false;
        }

        // Price range
        if (filters.minPrice > 0 && item.price < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice < 1000000000 && item.price > filters.maxPrice) {
          return false;
        }

        // Bedrooms
        if (filters.minBedrooms > 0 && item.bedrooms < filters.minBedrooms) {
          return false;
        }

        // Amenities
        if (filters.amenities.length > 0) {
          const hasAll = filters.amenities.every((amenity) =>
            item.amenities.includes(amenity)
          );
          if (!hasAll) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "price_asc") {
          return a.price - b.price;
        }
        if (filters.sortBy === "price_desc") {
          return b.price - a.price;
        }
        if (filters.sortBy === "sqft_desc") {
          return b.squareFeet - a.squareFeet;
        }
        // newest
        return (
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
        );
      });
  }, [properties, filters]);

  const handleListingTypeSelect = useCallback((type: "All" | "For Sale" | "For Rent") => {
    setFilters((prev) => {
      if (prev.listingType === type) return prev;
      let newMin = prev.minPrice;
      let newMax = prev.maxPrice;
      if (type === "For Rent") {
        if (newMin > 5000000) newMin = 0;
        if (newMax > 5000000) newMax = 5000000;
      } else if (type === "For Sale") {
        if (newMax <= 5000000) newMax = 1000000000;
      }
      return {
        ...prev,
        listingType: type,
        minPrice: newMin,
        maxPrice: newMax,
      };
    });
  }, []);

  const handleQuickKeywordClick = (keyword: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: keyword,
    }));
    const el = document.getElementById("listings");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      <Suspense fallback={null}>
        <UrlTypeWatcher onSelectType={handleListingTypeSelect} />
      </Suspense>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-[580px] lg:min-h-[620px] flex items-center pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Full-bleed background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Luxury Real Estate Colombo Sri Lanka"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center lg:object-right"
          />
          {/* Dark gradient overlay on the left to guarantee high contrast for text */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/30" />
          {/* Subtle top & bottom vignette to blend seamlessly */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Badges, and Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-white/15 backdrop-blur-md text-slate-200 text-xs font-semibold tracking-wider uppercase shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Remax Elite Sri Lanka · Best Real Estate Agency in Colombo</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white">
              Real Estate in Sri Lanka.{" "}
              <br className="hidden sm:inline" />
              <span className="text-[#FF5A5F]">Property</span> for Sale & Rent in{" "}
              <br className="hidden sm:inline" />
              <span className="text-sky-300">Colombo</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Explore houses, luxury apartments, furnished rentals, beachfront villas, and commercial spaces across Sri Lanka.
            </p>

            {/* Quick Action / Filter Switcher Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleListingTypeSelect("For Sale");
                  document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-105 ${
                  filters.listingType === "For Sale"
                    ? "bg-red-600 text-white shadow-red-600/40"
                    : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20"
                }`}
              >
                <Home className="w-4 h-4 text-white" />
                <span>Properties For Sale</span>
              </button>

              <button
                onClick={() => {
                  handleListingTypeSelect("For Rent");
                  document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-105 ${
                  filters.listingType === "For Rent"
                    ? "bg-emerald-600 text-white shadow-emerald-600/40"
                    : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20"
                }`}
              >
                <KeyRound className="w-4 h-4 text-emerald-300" />
                <span>Properties For Rent</span>
              </button>

              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 font-bold text-sm shadow-md transition-all hover:scale-105"
              >
                <Scale className="w-4 h-4 text-red-400" />
                <span>Launch Compare Matrix</span>
              </Link>
            </div>

            {/* Feature Highlights Banner */}
            <div className="pt-4 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-3xl border-t border-white/10 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">Verified Property Listings</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">Islandwide Property Search</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">Price per Sqft Comparison</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">Side-by-Side Property Comparison</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Floating Glassmorphic Stat Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 items-start lg:items-end justify-center">
            {/* Card 1: Luxury Homes */}
            <div className="w-full max-w-xs sm:max-w-sm bg-slate-900/50 backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] flex items-center gap-4 transition-all hover:bg-slate-900/65 hover:border-white/30 hover:scale-[1.02]">
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.5)] shrink-0 flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black text-white tracking-tight">1,200+</div>
                <div className="text-xs font-semibold text-slate-300 tracking-wider uppercase">Luxury Homes</div>
              </div>
            </div>

            {/* Card 2: Apartments */}
            <div className="w-full max-w-xs sm:max-w-sm bg-slate-900/50 backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] flex items-center gap-4 transition-all hover:bg-slate-900/65 hover:border-white/30 hover:scale-[1.02]">
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-[0_0_20px_rgba(14,165,233,0.5)] shrink-0 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black text-white tracking-tight">2,500+</div>
                <div className="text-xs font-semibold text-slate-300 tracking-wider uppercase">Apartments</div>
              </div>
            </div>

            {/* Card 3: Colombo Prime Locations */}
            <div className="w-full max-w-xs sm:max-w-sm bg-slate-900/50 backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] flex items-center gap-4 transition-all hover:bg-slate-900/65 hover:border-white/30 hover:scale-[1.02]">
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 shadow-[0_0_20px_rgba(244,63,94,0.5)] shrink-0 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black text-white tracking-tight">Colombo</div>
                <div className="text-xs font-semibold text-slate-300 tracking-wider uppercase">Prime Locations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Listings */}
      <section id="listings" className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        {/* Search & Filter Component */}
        <SearchFilterBar
          filters={filters}
          onChange={setFilters}
          totalResults={filteredProperties.length}
        />

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4"
              >
                <div className="w-full aspect-[16/10] bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-10 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          /* Property Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, idx) => (
              <PropertyCard
                key={property.id}
                property={property}
                priority={idx < 3}
              />
            ))}
          </div>
        ) : (
          /* Empty Results State */
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No properties found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
              We couldn&apos;t find any properties matching your current filter criteria. Try adjusting your price range, bedroom requirements, or amenities.
            </p>
            <button
              onClick={() => setFilters(initialFilters)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Bottom Comparison Callout Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-300 text-xs font-bold">
              <Scale className="w-3.5 h-3.5 text-red-400" />
              RE/MAX Comparison Engine
            </div>
            <h3 className="text-2xl font-black">Comparing multiple luxury properties?</h3>
            <p className="text-slate-300 text-sm max-w-xl">
              Click &quot;Add to Compare&quot; on any listing cards to review specs, pricing differences, price per square foot, and amenity checklists in our comparative matrix.
            </p>
          </div>
          <Link
            href="/compare"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-105"
          >
            <span>Open Comparison Page</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Popular Sri Lanka & Colombo Real Estate Searches (SEO & Quick Filters) */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Search Hub</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Popular Searches in Colombo & Sri Lanka
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Quickly explore top properties, residential developments, and commercial listings represented by Remax Elite Sri Lanka.
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-400">
              Click any search query to filter
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
            {/* Column 1: Broad Sri Lanka */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                Sri Lanka Real Estate
              </h3>
              <ul className="space-y-1.5 text-xs">
                {[
                  "real estate in Sri Lanka",
                  "property for sale in Sri Lanka",
                  "houses for sale in Sri Lanka",
                  "apartments for sale in Sri Lanka",
                  "land for sale in Sri Lanka",
                  "commercial property for sale in Sri Lanka",
                  "new developments for sale in Sri Lanka",
                  "real estate agents in Sri Lanka",
                  "top real estate companies in Sri Lanka",
                ].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleQuickKeywordClick(item)}
                      className="text-slate-600 hover:text-red-600 hover:underline transition-colors text-left flex items-center gap-1.5 py-0.5"
                    >
                      <Search className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Colombo Specific */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-700" />
                Colombo Properties
              </h3>
              <ul className="space-y-1.5 text-xs">
                {[
                  "real estate in Colombo",
                  "property for sale in Colombo",
                  "apartments for sale in Colombo",
                  "houses for sale in Colombo",
                  "commercial properties for sale in Colombo",
                  "land for sale in Colombo",
                  "luxury apartments for sale in Colombo",
                  "new developments for sale in Colombo",
                  "bungalows for sale in Colombo",
                  "hotels for sale in Colombo",
                  "villas for sale in Colombo",
                  "studio/bedsit for sale in Colombo",
                ].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleQuickKeywordClick(item)}
                      className="text-slate-600 hover:text-red-600 hover:underline transition-colors text-left flex items-center gap-1.5 py-0.5"
                    >
                      <Search className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Rentals & Leasing */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-red-600" />
                Colombo Rentals & Leases
              </h3>
              <ul className="space-y-1.5 text-xs">
                {[
                  "apartment rentals in Colombo",
                  "house rentals in Colombo",
                  "commercial property rentals in Colombo",
                  "holiday & short-term rental in Colombo",
                  "room & annex rentals in Colombo",
                  "real estate agencies Colombo",
                  "property rentals Colombo",
                  "furnished apartments for rent in Colombo",
                  "rent house in Colombo",
                ].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleQuickKeywordClick(item)}
                      className="text-slate-600 hover:text-red-600 hover:underline transition-colors text-left flex items-center gap-1.5 py-0.5"
                    >
                      <Search className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Long-Tail & Remax Elite Brand */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                Brand & Luxury High-Yield
              </h3>
              <ul className="space-y-1.5 text-xs">
                {[
                  "Remax Elite Sri Lanka",
                  "Remax Elite Colombo",
                  "Remax Elite real estate",
                  "buy property in Colombo Sri Lanka",
                  "invest in Sri Lanka real estate",
                  "best real estate agency in Colombo",
                  "luxury real estate Sri Lanka",
                  "beachfront property for sale Sri Lanka",
                ].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleQuickKeywordClick(item)}
                      className="text-slate-600 hover:text-red-600 hover:underline transition-colors text-left flex items-center gap-1.5 py-0.5 font-medium"
                    >
                      <Search className="w-3 h-3 text-red-500 shrink-0" />
                      <span>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
