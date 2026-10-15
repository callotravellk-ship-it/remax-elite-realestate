"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Property, POPULAR_AMENITIES } from "@/types/property";
import { useComparison } from "@/context/ComparisonContext";
import { getProperties } from "@/lib/propertyService";
import { formatLKR, formatPropertyPrice } from "@/lib/formatters";
import {
  Scale,
  X,
  Plus,
  Check,
  Minus,
  Share2,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  DollarSign,
  Maximize2,
  Bed,
  Bath,
  Calendar,
  Car,
  Tag,
  MapPin,
} from "lucide-react";

interface CompareViewProps {
  initialProperties: Property[];
  urlIds: string[];
}

export default function CompareView({
  initialProperties,
  urlIds,
}: CompareViewProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const {
    selectedProperties,
    removeFromCompare,
    addToCompare,
    clearCompare,
    maxProperties,
    syncFromIds,
  } = useComparison();

  const [allProperties, setAllProperties] = useState<Property[]>(initialProperties);
  const [highlightDifferencesOnly, setHighlightDifferencesOnly] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Synchronize state with URL search params or fallback to comparison context
  useEffect(() => {
    if (urlIds.length > 0 && selectedProperties.length === 0) {
      syncFromIds(urlIds);
    }
  }, [urlIds, selectedProperties.length, syncFromIds]);

  // Load all properties for the "Add Property" modal picker
  useEffect(() => {
    async function loadAll() {
      try {
        const data = await getProperties();
        setAllProperties(data);
      } catch (e) {
        console.error("Failed to load all properties:", e);
      }
    }
    loadAll();
  }, []);

  // Sync active properties to compare: either from context or initial props
  const activeProperties = useMemo(() => {
    if (selectedProperties.length > 0) return selectedProperties;
    return initialProperties;
  }, [selectedProperties, initialProperties]);

  // Keep URL in sync when items are removed/added
  const handleRemove = (id: string) => {
    removeFromCompare(id);
    const remaining = activeProperties.filter((p) => p.id !== id);
    if (remaining.length > 0) {
      const newIds = remaining.map((p) => encodeURIComponent(p.id)).join(",");
      startTransition(() => {
        router.replace(`/compare?ids=${newIds}`, { scroll: false });
      });
    } else {
      startTransition(() => {
        router.replace("/compare", { scroll: false });
      });
    }
  };

  const handleAdd = (property: Property) => {
    addToCompare(property);
    const newItems = [...activeProperties, property];
    const newIds = newItems.map((p) => encodeURIComponent(p.id)).join(",");
    startTransition(() => {
      router.replace(`/compare?ids=${newIds}`, { scroll: false });
    });
    setIsAddModalOpen(false);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const ids = activeProperties.map((p) => encodeURIComponent(p.id)).join(",");
      const shareUrl = `${window.location.origin}/compare?ids=${ids}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Compute best value highlights
  const bestValue = useMemo(() => {
    if (activeProperties.length < 2) return null;
    const lowestPrice = Math.min(...activeProperties.map((p) => p.price));
    const lowestPpsqft = Math.min(
      ...activeProperties.map((p) => p.pricePerSqft || Math.round(p.price / p.squareFeet))
    );
    const largestSqft = Math.max(...activeProperties.map((p) => p.squareFeet));
    return { lowestPrice, lowestPpsqft, largestSqft };
  }, [activeProperties]);

  // Aggregate all unique amenities present across these properties
  const allAmenitiesList = useMemo(() => {
    const set = new Set<string>();
    POPULAR_AMENITIES.forEach((a) => set.add(a));
    activeProperties.forEach((p) => {
      p.amenities?.forEach((a) => set.add(a));
    });
    return Array.from(set);
  }, [activeProperties]);

  // Check if a row differs across properties
  const isRowDifferent = (getValue: (p: Property) => unknown) => {
    if (activeProperties.length <= 1) return false;
    const first = getValue(activeProperties[0]);
    return activeProperties.some((p) => getValue(p) !== first);
  };

  if (activeProperties.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto mb-6">
          <Scale className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Comparison Matrix is Empty
        </h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto mt-2 mb-8 leading-relaxed">
          You haven&apos;t selected any properties to compare yet. Browse our listings and click &quot;Add to Compare&quot; on up to 4 homes to view a side-by-side analysis.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Available Listings</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Listings
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Scale className="w-8 h-8 text-red-600" />
            RE/MAX Side-by-Side Property Comparison
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Analyzing {activeProperties.length} of {maxProperties} properties across pricing, architectural specifications, and amenities.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Share Link Button */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-all"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-blue-700" />
                <span>Share Comparison</span>
              </>
            )}
          </button>

          {/* Clear Comparison */}
          <button
            onClick={() => {
              clearCompare();
              startTransition(() => {
                router.replace("/compare", { scroll: false });
              });
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Control Bar: Filter Differences toggle & Add Property CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-100 p-3.5 rounded-2xl border border-slate-200 mb-6">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700">
          <input
            type="checkbox"
            checked={highlightDifferencesOnly}
            onChange={(e) => setHighlightDifferencesOnly(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
          />
          <span>Highlight differences only</span>
        </label>

        {activeProperties.length < maxProperties && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>Add Property ({activeProperties.length}/{maxProperties})</span>
          </button>
        )}
      </div>

      {/* Comparison Table / Matrix Container */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
          {/* Header Row: Property Cards */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="w-48 p-4 text-xs font-black uppercase tracking-wider text-slate-500 align-top">
                Property Overview
              </th>
              {activeProperties.map((property) => {
                const formattedPrice = formatPropertyPrice(property.price, property.listingType);

                const ppsqft =
                  property.pricePerSqft ||
                  Math.round(property.price / property.squareFeet);

                const isBestPrice =
                  bestValue && property.price === bestValue.lowestPrice;
                const isBestPpsqft =
                  bestValue && ppsqft === bestValue.lowestPpsqft;

                return (
                  <th
                    key={property.id}
                    className="p-4 align-top border-l border-slate-200"
                  >
                    <div className="relative flex flex-col space-y-3">
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(property.id)}
                        className="absolute -top-1 -right-1 p-1 rounded-full bg-slate-200 hover:bg-red-100 hover:text-red-600 text-slate-600 transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Thumbnail */}
                      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-200">
                        <Image
                          src={
                            property.images?.[0] ||
                            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                          }
                          alt={property.title}
                          fill
                          sizes="280px"
                          className="object-cover"
                        />
                      </div>

                      {/* Title, Category & Tagline */}
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs ${
                              property.listingType === "For Rent"
                                ? "bg-emerald-600 text-white"
                                : "bg-blue-900 text-white"
                            }`}
                          >
                            {property.listingType || "For Sale"}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            {property.propertyType}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mt-1 line-clamp-1">
                          {property.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {property.address.city}, {property.address.state}
                        </p>
                      </div>

                      {/* Price & Badges */}
                      <div>
                        <div className="text-xl font-black text-slate-900">
                          {formattedPrice}
                        </div>
                        <div className="text-xs text-slate-500 font-semibold">
                          {property.listingType === "For Rent"
                            ? property.securityDeposit
                              ? `Deposit: ${formatLKR(property.securityDeposit)}`
                              : "Monthly Rental"
                            : `Rs. ${ppsqft.toLocaleString()}/sqft`}
                        </div>

                        {/* Value highlight badges */}
                        <div className="flex flex-col gap-1 mt-2">
                          {isBestPrice && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-md w-fit border border-red-200">
                              <Sparkles className="w-3 h-3 text-red-600" /> Lowest Price
                            </span>
                          )}
                          {isBestPpsqft && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md w-fit border border-blue-200">
                              <Sparkles className="w-3 h-3 text-blue-600" /> Best Price/SqFt
                            </span>
                          )}
                        </div>
                      </div>

                      {/* View Link */}
                      <Link
                        href={`/properties/${property.id}`}
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        <span>View Listing</span>
                        <ExternalLink className="w-3 h-3 text-red-400" />
                      </Link>
                    </div>
                  </th>
                );
              })}

              {/* Slot Placeholder if < max */}
              {activeProperties.length < maxProperties && (
                <th className="p-4 align-top border-l border-slate-200 bg-slate-50/40">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full h-full min-h-[260px] border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-red-600 hover:border-red-500 transition-colors p-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold">Add Property</span>
                    <span className="text-[11px] text-slate-400">
                      Slot {activeProperties.length + 1} of {maxProperties}
                    </span>
                  </button>
                </th>
              )}
            </tr>
          </thead>

          {/* Section: Specifications */}
          <tbody className="divide-y divide-slate-100 text-xs">
            <tr className="bg-slate-100 font-black text-slate-800">
              <td colSpan={maxProperties + 1} className="py-2.5 px-4 uppercase tracking-wider text-[11px]">
                Architectural Specifications
              </td>
            </tr>

            {/* Listing Category */}
            {(!highlightDifferencesOnly || isRowDifferent((p) => p.listingType)) && (
              <tr className="hover:bg-slate-50/60">
                <td className="p-4 font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-700" /> Listing Category
                </td>
                {activeProperties.map((p) => (
                  <td key={p.id} className="p-4 border-l border-slate-200">
                    <span
                      className={`inline-block px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-md ${
                        p.listingType === "For Rent"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-blue-100 text-blue-900 border border-blue-200"
                      }`}
                    >
                      {p.listingType || "For Sale"}
                    </span>
                  </td>
                ))}
              </tr>
            )}

            {/* Price / Rent */}
            {(!highlightDifferencesOnly || isRowDifferent((p) => p.price)) && (
              <tr className="hover:bg-slate-50/60">
                <td className="p-4 font-bold text-slate-700 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-blue-700" /> Price / Monthly Rent
                </td>
                {activeProperties.map((p) => (
                  <td key={p.id} className="p-4 font-black text-slate-900 border-l border-slate-200">
                    <div>{formatPropertyPrice(p.price, p.listingType)}</div>
                    {p.listingType === "For Rent" && p.securityDeposit ? (
                      <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                        Deposit: {formatLKR(p.securityDeposit)}
                      </div>
                    ) : null}
                  </td>
                ))}
              </tr>
            )}

            {/* Price per SqFt */}
            {(!highlightDifferencesOnly ||
              isRowDifferent((p) => p.pricePerSqft || Math.round(p.price / p.squareFeet))) && (
              <tr className="hover:bg-slate-50/60">
                <td className="p-4 font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-700" /> Price / SqFt
                </td>
                {activeProperties.map((p) => {
                  const ppsq = p.pricePerSqft || Math.round(p.price / p.squareFeet);
                  return (
                    <td key={p.id} className="p-4 text-slate-800 font-semibold border-l border-slate-200">
                      Rs. {ppsq.toLocaleString()} / sqft
                    </td>
                  );
                })}
              </tr>
            )}

            {/* Bedrooms */}
            {(!highlightDifferencesOnly || isRowDifferent((p) => p.bedrooms)) && (
              <tr className="hover:bg-slate-50/60">
                <td className="p-4 font-bold text-slate-700 flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-blue-700" /> Bedrooms
                </td>
                {activeProperties.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 font-semibold border-l border-slate-200">
                    {p.bedrooms} Beds
                  </td>
                ))}
              </tr>
            )}

            {/* Bathrooms */}
            {(!highlightDifferencesOnly || isRowDifferent((p) => p.bathrooms)) && (
              <tr className="hover:bg-slate-50/60">
                <td className="p-4 font-bold text-slate-700 flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-blue-700" /> Bathrooms
                </td>
                {activeProperties.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 font-semibold border-l border-slate-200">
                    {p.bathrooms} Baths
                  </td>
                ))}
              </tr>
            )}

            {/* Square Footage */}
            {(!highlightDifferencesOnly || isRowDifferent((p) => p.squareFeet)) && (
              <tr className="hover:bg-slate-50/60">
                <td className="p-4 font-bold text-slate-700 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-blue-700" /> Square Footage & Land
                </td>
                {activeProperties.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 font-bold border-l border-slate-200">
                    {p.squareFeet.toLocaleString()} sqft
                    {p.lotSizePerches ? (
                      <span className="block text-[11px] font-normal text-slate-500">
                        {p.lotSizePerches} Perches Land
                      </span>
                    ) : null}
                  </td>
                ))}
              </tr>
            )}

            {/* Year Built */}
            {(!highlightDifferencesOnly || isRowDifferent((p) => p.yearBuilt)) && (
              <tr className="hover:bg-slate-50/60">
                <td className="p-4 font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-700" /> Year Built
                </td>
                {activeProperties.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 border-l border-slate-200">
                    {p.yearBuilt}
                  </td>
                ))}
              </tr>
            )}

            {/* Garage Spaces */}
            {(!highlightDifferencesOnly || isRowDifferent((p) => p.garageSpaces)) && (
              <tr className="hover:bg-slate-50/60">
                <td className="p-4 font-bold text-slate-700 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-blue-700" /> Garage Spaces
                </td>
                {activeProperties.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 border-l border-slate-200">
                    {p.garageSpaces} Vehicles
                  </td>
                ))}
              </tr>
            )}

            {/* Monthly HOA Fee */}
            {(!highlightDifferencesOnly || isRowDifferent((p) => p.hoaFeeMonthly)) && (
              <tr className="hover:bg-slate-50/60">
                <td className="p-4 font-bold text-slate-700">Monthly Maintenance</td>
                {activeProperties.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 border-l border-slate-200">
                    {p.hoaFeeMonthly ? `Rs. ${p.hoaFeeMonthly.toLocaleString()}/mo` : "None"}
                  </td>
                ))}
              </tr>
            )}

            {/* Annual Property Taxes */}
            {(!highlightDifferencesOnly || isRowDifferent((p) => p.annualTaxes)) && (
              <tr className="hover:bg-slate-50/60">
                <td className="p-4 font-bold text-slate-700">Annual Municipal Rates (Est.)</td>
                {activeProperties.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 border-l border-slate-200">
                    {p.annualTaxes ? `Rs. ${p.annualTaxes.toLocaleString()}/yr` : "N/A"}
                  </td>
                ))}
              </tr>
            )}

            {/* Location */}
            {(!highlightDifferencesOnly || isRowDifferent((p) => p.address.city)) && (
              <tr className="hover:bg-slate-50/60">
                <td className="p-4 font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600" /> Location
                </td>
                {activeProperties.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 border-l border-slate-200">
                    <p className="font-semibold">{p.address.neighborhood || p.address.city}</p>
                    <p className="text-[11px] text-slate-500">
                      {p.address.city}, {p.address.state} {p.address.zipCode}
                    </p>
                  </td>
                ))}
              </tr>
            )}

            {/* Section: Amenities Matrix */}
            <tr className="bg-slate-100 font-black text-slate-800">
              <td colSpan={maxProperties + 1} className="py-2.5 px-4 uppercase tracking-wider text-[11px]">
                Amenities & Features Matrix
              </td>
            </tr>

            {allAmenitiesList.map((amenity) => {
              const hasDifference = isRowDifferent((p) => p.amenities?.includes(amenity));
              if (highlightDifferencesOnly && !hasDifference) return null;

              return (
                <tr key={amenity} className="hover:bg-slate-50/60">
                  <td className="p-4 font-semibold text-slate-700">{amenity}</td>
                  {activeProperties.map((property) => {
                    const included = property.amenities?.includes(amenity);
                    return (
                      <td
                        key={property.id}
                        className="p-4 border-l border-slate-200 text-center"
                      >
                        {included ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 font-bold">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                            <Minus className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Property Modal Picker */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                Add Property to Comparison
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-3 flex-1">
              {allProperties
                .filter((p) => !activeProperties.some((a) => a.id === p.id))
                .map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-red-500 hover:bg-red-50/30 transition-all gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                        <Image
                          src={property.images?.[0] || ""}
                          alt={property.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {property.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {property.address.city}, {property.address.state} • {property.bedrooms}bd • {property.squareFeet}sqft
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded ${
                            property.listingType === "For Rent"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-900"
                          }`}>
                            {property.listingType || "For Sale"}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {formatPropertyPrice(property.price, property.listingType)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdd(property)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add to Compare
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
