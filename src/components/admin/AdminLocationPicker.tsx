"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  loadGoogleMapsScript,
  darkMapStyles,
  lightMapStyles,
  DEFAULT_COLOMBO_COORDINATES,
  reverseGeocodeLatLng,
} from "@/lib/googleMaps";
import { Search, MapPin, LocateFixed, Compass } from "lucide-react";

export interface LocationChangeData {
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface AdminLocationPickerProps {
  currentCoordinates?: {
    latitude: number;
    longitude: number;
  };
  street: string;
  city: string;
  neighborhood: string;
  state: string;
  zipCode: string;
  onChange: (data: LocationChangeData) => void;
}

export default function AdminLocationPicker({
  currentCoordinates,
  street,
  city,
  neighborhood,
  state,
  zipCode,
  onChange,
}: AdminLocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const initialLat =
    currentCoordinates?.latitude && currentCoordinates.latitude !== 0
      ? currentCoordinates.latitude
      : DEFAULT_COLOMBO_COORDINATES.lat;

  const initialLng =
    currentCoordinates?.longitude && currentCoordinates.longitude !== 0
      ? currentCoordinates.longitude
      : DEFAULT_COLOMBO_COORDINATES.lng;

  const [activeCoords, setActiveCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });

  // Handle marker position update (drag or click)
  const handleMarkerMoved = async (lat: number, lng: number) => {
    setActiveCoords({ lat, lng });
    setIsGeocoding(true);

    try {
      const geoResult = await reverseGeocodeLatLng(lat, lng);
      if (geoResult) {
        onChange({
          street: geoResult.street || street,
          neighborhood: geoResult.neighborhood || neighborhood,
          city: geoResult.city || city,
          state: geoResult.state || state,
          zipCode: geoResult.zipCode || zipCode,
          coordinates: { latitude: lat, longitude: lng },
        });
      } else {
        onChange({
          coordinates: { latitude: lat, longitude: lng },
        });
      }
    } catch (err) {
      console.warn("Reverse geocode warning:", err);
      onChange({
        coordinates: { latitude: lat, longitude: lng },
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function initPicker() {
      try {
        await loadGoogleMapsScript();
        if (!isMounted || !mapContainerRef.current) return;

        const isDark =
          document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches;

        const center = { lat: activeCoords.lat, lng: activeCoords.lng };

        const map = new window.google.maps.Map(mapContainerRef.current, {
          center,
          zoom: 15,
          styles: isDark ? darkMapStyles : lightMapStyles,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
        });

        mapInstanceRef.current = map;

        // Custom Marker Pin
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
          draggable: true,
          animation: window.google.maps.Animation.DROP,
          title: "Drag to pin exact property location",
          icon: {
            url: markerSvg,
            scaledSize: new window.google.maps.Size(44, 54),
            anchor: new window.google.maps.Point(22, 52),
          },
        });

        markerRef.current = marker;

        // On Marker Drag End
        marker.addListener("dragend", (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          handleMarkerMoved(e.latLng.lat(), e.latLng.lng());
        });

        // On Map Click
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          marker.setPosition(newPos);
          handleMarkerMoved(newPos.lat, newPos.lng);
        });

        // Initialize Places Autocomplete for Address Search
        if (searchInputRef.current && window.google?.maps?.places?.Autocomplete) {
          const autocomplete = new window.google.maps.places.Autocomplete(
            searchInputRef.current,
            {
              componentRestrictions: { country: "lk" }, // Biased to Sri Lanka
              fields: ["address_components", "geometry", "formatted_address", "name"],
            }
          );

          autocomplete.bindTo("bounds", map);

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) {
              return;
            }

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            map.panTo({ lat, lng });
            map.setZoom(17);
            marker.setPosition({ lat, lng });
            setActiveCoords({ lat, lng });

            // Extract address components
            let streetNumber = "";
            let route = "";
            let parsedNeighborhood = "";
            let parsedCity = "";
            let parsedState = "";
            let parsedZip = "";

            if (place.address_components) {
              for (const comp of place.address_components) {
                const types = comp.types;
                if (types.includes("street_number")) {
                  streetNumber = comp.long_name;
                } else if (types.includes("route")) {
                  route = comp.long_name;
                } else if (
                  types.includes("sublocality") ||
                  types.includes("sublocality_level_1") ||
                  types.includes("neighborhood")
                ) {
                  parsedNeighborhood = comp.long_name;
                } else if (types.includes("locality")) {
                  parsedCity = comp.long_name;
                } else if (types.includes("administrative_area_level_1")) {
                  parsedState = comp.long_name;
                } else if (types.includes("postal_code")) {
                  parsedZip = comp.long_name;
                }
              }
            }

            const parsedStreet = [streetNumber, route].filter(Boolean).join(" ");

            onChange({
              street: parsedStreet || place.name || "",
              neighborhood: parsedNeighborhood || neighborhood,
              city: parsedCity || city,
              state: parsedState || state,
              zipCode: parsedZip || zipCode,
              coordinates: { latitude: lat, longitude: lng },
            });
          });
        }

        // Live dark mode observer
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
        const msg = err instanceof Error ? err.message : "Failed to load Google Maps SDK";
        setLoadError(msg);
      }
    }

    initPicker();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleResetToColombo = () => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    const defaultCenter = DEFAULT_COLOMBO_COORDINATES;
    mapInstanceRef.current.panTo(defaultCenter);
    mapInstanceRef.current.setZoom(15);
    markerRef.current.setPosition(defaultCenter);
    handleMarkerMoved(defaultCenter.lat, defaultCenter.lng);
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Search Input with Google Places Autocomplete */}
      <div className="relative">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-red-600" />
            Type Address to Search Location (Google Places)
          </span>
          <span className="text-[11px] font-normal text-slate-400">
            Biased to Sri Lanka
          </span>
        </label>
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search address, landmark, or street in Sri Lanka (e.g. 124 Marine Drive, Colombo 03)..."
            className="w-full pl-9 pr-24 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <button
            type="button"
            onClick={handleResetToColombo}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 flex items-center gap-1"
            title="Reset map center to Colombo"
          >
            <LocateFixed className="w-3 h-3 text-red-600" />
            <span>Colombo</span>
          </button>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
        {!isLoaded && !loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 animate-pulse space-y-2 z-10 bg-slate-50 dark:bg-slate-800">
            <MapPin className="w-6 h-6 text-red-600 animate-bounce" />
            <span className="text-xs font-semibold">Loading Google Map Picker...</span>
          </div>
        )}

        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 z-10">
            <MapPin className="w-6 h-6 text-red-600 mb-1" />
            <p className="font-bold">Google Maps error</p>
            <p className="text-[11px] text-slate-400">{loadError}</p>
          </div>
        )}

        {isGeocoding && (
          <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-semibold backdrop-blur shadow-md flex items-center gap-2 animate-in fade-in">
            <Compass className="w-3.5 h-3.5 text-red-500 animate-spin" />
            <span>Resolving address from pin location...</span>
          </div>
        )}

        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Helper Bar & Pin Hint */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            <strong>Interactive Pin:</strong> Click anywhere on the map or drag the pin to set the exact spot.
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
          <span>Lat: <strong>{activeCoords.lat.toFixed(5)}</strong></span>
          <span>Lng: <strong>{activeCoords.lng.toFixed(5)}</strong></span>
        </div>
      </div>
    </div>
  );
}
