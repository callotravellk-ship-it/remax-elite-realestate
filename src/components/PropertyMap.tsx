"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  loadGoogleMapsScript,
  darkMapStyles,
  lightMapStyles,
  DEFAULT_COLOMBO_COORDINATES,
} from "@/lib/googleMaps";
import { formatPropertyPrice } from "@/lib/formatters";
import { ListingType } from "@/types/property";
import { MapPin, Navigation, ExternalLink, Compass } from "lucide-react";

interface PropertyMapProps {
  title: string;
  price?: number;
  listingType?: ListingType;
  address: {
    street?: string;
    city: string;
    neighborhood?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}

export default function PropertyMap({
  title,
  price,
  listingType,
  address,
}: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fullAddress = [
    address.street,
    address.neighborhood,
    address.city,
    address.state,
    address.country || "Sri Lanka",
  ]
    .filter(Boolean)
    .join(", ");

  const hasExplicitCoordinates =
    address.coordinates &&
    typeof address.coordinates.latitude === "number" &&
    typeof address.coordinates.longitude === "number" &&
    address.coordinates.latitude !== 0 &&
    address.coordinates.longitude !== 0;

  const targetCoords = hasExplicitCoordinates
    ? {
        lat: address.coordinates!.latitude,
        lng: address.coordinates!.longitude,
      }
    : DEFAULT_COLOMBO_COORDINATES;

  // Directions and Google Maps External URL
  const googleMapsUrl = hasExplicitCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${targetCoords.lat},${targetCoords.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    hasExplicitCoordinates ? `${targetCoords.lat},${targetCoords.lng}` : fullAddress
  )}`;

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      try {
        await loadGoogleMapsScript();
        if (!isMounted || !mapContainerRef.current) return;

        const isDark =
          document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches;

        // Geocode if coordinates are missing
        let resolvedLat = targetCoords.lat;
        let resolvedLng = targetCoords.lng;

        if (!hasExplicitCoordinates && window.google?.maps?.Geocoder) {
          try {
            const geocoder = new window.google.maps.Geocoder();
            const result = await new Promise<google.maps.GeocoderResult[] | null>(
              (resolve) => {
                geocoder.geocode(
                  { address: fullAddress },
                  (res, status) => {
                    if (status === "OK" && res && res.length > 0) {
                      resolve(res);
                    } else {
                      resolve(null);
                    }
                  }
                );
              }
            );

            if (result && result[0]) {
              resolvedLat = result[0].geometry.location.lat();
              resolvedLng = result[0].geometry.location.lng();
            }
          } catch {
            // Keep default fallback
          }
        }

        const center = { lat: resolvedLat, lng: resolvedLng };

        const map = new window.google.maps.Map(mapContainerRef.current, {
          center,
          zoom: 16,
          styles: isDark ? darkMapStyles : lightMapStyles,
          mapTypeControl: true,
          mapTypeControlOptions: {
            position: window.google.maps.ControlPosition.TOP_RIGHT,
          },
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: "cooperative",
        });

        mapInstanceRef.current = map;

        // Custom High-End Pin Marker
        const markerSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="44" height="54" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <filter id="shadow" x="0" y="0" width="44" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/>
            </filter>
            <path g="M22 2C11.5066 2 3 10.5066 3 21C3 34.5 22 50 22 50C22 50 41 34.5 41 21C41 10.5066 32.4934 2 22 2Z" fill="#E02424" filter="url(#shadow)"/>
            <circle cx="22" cy="21" r="14" fill="#1E3A8A"/>
            <circle cx="22" cy="21" r="8" fill="#FFFFFF"/>
          </svg>
        `)}`;

        const marker = new window.google.maps.Marker({
          position: center,
          map,
          title,
          animation: window.google.maps.Animation.DROP,
          icon: {
            url: markerSvg,
            scaledSize: new window.google.maps.Size(44, 54),
            anchor: new window.google.maps.Point(22, 52),
          },
        });

        markerRef.current = marker;

        // Rich InfoWindow on Marker Click
        const priceLabel = price ? formatPropertyPrice(price, listingType) : "";
        const infoContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 6px 4px; max-width: 240px; color: #0f172a;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #dc2626; margin-bottom: 2px;">
              ${address.neighborhood || address.city}
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #0f172a; line-height: 1.3; margin-bottom: 4px;">
              ${title}
            </div>
            ${priceLabel ? `<div style="font-size: 14px; font-weight: 900; color: #1e3a8a;">${priceLabel}</div>` : ""}
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
              ${address.street ? `${address.street}, ` : ""}${address.city}
            </div>
          </div>
        `;

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        // Watch theme toggling to adapt map styles live
        const observer = new MutationObserver(() => {
          if (!mapInstanceRef.current) return;
          const dark = document.documentElement.classList.contains("dark");
          mapInstanceRef.current.setOptions({
            styles: dark ? darkMapStyles : lightMapStyles,
          });
        });

        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class"],
        });

        setIsLoaded(true);

        return () => {
          observer.disconnect();
        };
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : "Failed to load Google Maps";
        console.error("Map load error:", err);
        setLoadError(msg);
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [fullAddress, hasExplicitCoordinates, targetCoords.lat, targetCoords.lng, title, price, listingType, address.neighborhood, address.city, address.street]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
      {/* Header with Address & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Property Location & Neighborhood</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              {address.neighborhood ? `${address.neighborhood}, ` : ""}
              {address.city}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {address.street ? `${address.street}, ` : ""}
            {address.city}, {address.state} {address.zipCode ? `• ${address.zipCode}` : ""}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Directions</span>
          </a>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Open in Google Maps</span>
          </a>
        </div>
      </div>

      {/* Interactive Map Box */}
      <div className="relative w-full h-[380px] sm:h-[420px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
        {!isLoaded && !loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 animate-pulse space-y-2 z-10">
            <MapPin className="w-8 h-8 text-red-600 animate-bounce" />
            <span className="text-xs font-bold tracking-wider uppercase">Loading Google Map...</span>
          </div>
        )}

        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 z-10">
            <MapPin className="w-8 h-8 text-red-600 mb-2" />
            <p className="text-xs font-bold">Unable to display interactive map</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs">{loadError}</p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
            >
              <span>View on Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Coordinate & District Footnote */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Region:</span>
          <span>Colombo District, Western Province, Sri Lanka</span>
        </div>
        {hasExplicitCoordinates && (
          <div className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
            GPS: {targetCoords.lat.toFixed(4)}° N, {targetCoords.lng.toFixed(4)}° E
          </div>
        )}
      </div>
    </div>
  );
}
