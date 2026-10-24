"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/property";
import { useComparison } from "@/context/ComparisonContext";
import { useLocalization } from "@/context/LocalizationContext";
import { formatLKR, formatPropertyPrice } from "@/lib/formatters";
import { TrustBadgePill } from "@/components/TrustBadges";
import { getPropertyWhatsAppLink } from "@/components/WhatsAppButton";
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
  MessageCircle,
} from "lucide-react";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export default function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const { isInCompare, toggleCompare, maxProperties, selectedProperties } = useComparison();
  const { formatPrice, formatLandArea, currency } = useLocalization();
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

  const formattedPrice = formatPrice(property.price, property.listingType, true);
  const landInfo = formatLandArea(property.lotSizePerches, property.squareFeet);
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

          {/* Legal Trust Indicator Pill */}
          <TrustBadgePill property={property} />
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
              {property.lotSizePerches ? ` • ${landInfo.formatted}` : ""}
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

          {/* Quick WhatsApp Inquiry Link */}
          <a
            href={getPropertyWhatsAppLink(property, formattedPrice)}
            target="_blank"
            rel="noopener noreferrer"
            title="Direct WhatsApp Inquiry with Agent"
            aria-label="Direct WhatsApp inquiry"
            className="inline-flex items-center justify-center p-2 text-white bg-[#25D366] hover:bg-[#20ba5a] rounded-xl transition-all shadow-xs hover:scale-105 active:scale-95 shrink-0"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </a>

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
