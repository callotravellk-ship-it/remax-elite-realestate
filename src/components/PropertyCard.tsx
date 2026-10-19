"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/property";
import { useComparison } from "@/context/ComparisonContext";
import { formatLKR, formatPropertyPrice } from "@/lib/formatters";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Check,
  Plus,
  Scale,
  Sparkles,
  KeyRound,
  Home,
} from "lucide-react";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export default function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const { isInCompare, toggleCompare, maxProperties, selectedProperties } = useComparison();
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const inCompare = isInCompare(property.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inCompare && selectedProperties.length >= maxProperties) {
      setFeedback(`Comparison limit reached (${maxProperties} max). Remove one to add this.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    toggleCompare(property);
  };

  const formattedPrice = formatPropertyPrice(property.price, property.listingType);
  const pricePerSqft = property.pricePerSqft || Math.round(property.price / property.squareFeet);
  const heroImage =
    imgError || !property.images?.[0]
      ? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=75"
      : property.images[0];

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-slate-950/60 transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
        <Link href={`/properties/${property.id}`} className="block w-full h-full">
          {/* Shimmer skeleton until image loads */}
          {!isLoaded && !imgError && (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-pulse" />
          )}
          <Image
            src={heroImage}
            alt={property.title}
            fill
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
            className={`object-cover transition-all duration-500 group-hover:scale-105 ${
              isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-xs"
            }`}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setImgError(true);
              setIsLoaded(true);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
        </Link>

        {/* Listing Type & Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-md shadow-sm backdrop-blur-md flex items-center gap-1 ${
              property.listingType === "For Rent"
                ? "bg-emerald-600 text-white"
                : "bg-blue-900 text-white"
            }`}
          >
            {property.listingType === "For Rent" ? (
              <KeyRound className="w-3 h-3" />
            ) : (
              <Home className="w-3 h-3" />
            )}
            {property.listingType || "For Sale"}
          </span>

          <span
            className={`px-2 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md shadow-sm backdrop-blur-md ${
              property.status === "Available"
                ? "bg-slate-900/80 text-white"
                : property.status === "Pending"
                ? "bg-amber-600/95 text-white"
                : "bg-slate-800/95 text-slate-200"
            }`}
          >
            {property.status}
          </span>

          {property.featured && (
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-red-600 text-white shadow-sm flex items-center gap-1 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-white" /> Featured
            </span>
          )}
        </div>

        {/* Floating Property Type & Price Overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-col items-start gap-1">
          {/* Property Type Badge */}
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-white/95 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 backdrop-blur-md shadow-sm">
            {property.propertyType}
          </span>

          {/* Price & Specs */}
          <div className="flex items-baseline flex-wrap gap-1">
            <span className="text-2xl font-black text-white tracking-tight drop-shadow-md">
              {formattedPrice}
            </span>
            {property.listingType === "For Rent" ? (
              property.securityDeposit ? (
                <span className="text-[11px] text-emerald-300 font-bold ml-1 drop-shadow">
                  • Dep: {formatLKR(property.securityDeposit)}
                </span>
              ) : null
            ) : (
              <span className="text-xs text-slate-200 font-semibold ml-1 drop-shadow">
                (Rs. {pricePerSqft.toLocaleString()}/sqft)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Address */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
          <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span className="truncate">
            {property.address.neighborhood ? `${property.address.neighborhood}, ` : ""}
            {property.address.city}, {property.address.state}
          </span>
        </div>

        {/* Title */}
        <Link href={`/properties/${property.id}`} className="group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight line-clamp-1">
            {property.title}
          </h3>
        </Link>

        {/* Tagline */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed flex-1">
          {property.tagline}
        </p>

        {/* Key Specs Bar */}
        <div className="grid grid-cols-3 gap-2 py-3.5 my-3.5 border-y border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Bed className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Bath className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Maximize2 className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span>
              {property.squareFeet.toLocaleString()} sqft
              {property.lotSizePerches ? ` • ${property.lotSizePerches}P` : ""}
            </span>
          </div>
        </div>

        {/* Amenities Preview */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Feedback alert if compare is full */}
        {feedback && (
          <div className="mb-2 p-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300 text-xs rounded-lg animate-in fade-in">
            {feedback}
          </div>
        )}

        {/* Action Row */}
        <div className="mt-auto pt-2 flex items-center gap-2">
          {/* Add to Compare Button */}
          <button
            onClick={handleCompareClick}
            type="button"
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
              inCompare
                ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-900/60 hover:bg-red-100 dark:hover:bg-red-900/50 shadow-sm"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-red-600 dark:hover:border-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50/40 dark:hover:bg-slate-750"
            }`}
          >
            {inCompare ? (
              <>
                <Check className="w-3.5 h-3.5 text-red-600 dark:text-red-400 stroke-[3]" />
                <span>Added to Compare</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <Scale className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                <span>Add to Compare</span>
              </>
            )}
          </button>

          {/* View Details Link */}
          <Link
            href={`/properties/${property.id}`}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-xl transition-colors shadow-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
