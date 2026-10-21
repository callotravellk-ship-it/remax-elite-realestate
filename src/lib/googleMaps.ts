// Google Maps Script Loader & Utilities for RE/MAX Elite
export const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyAJ0nthZfylJV4cO3hWgxVnKiOHQkzERM8";

// Default coordinates centered on Colombo, Sri Lanka
export const DEFAULT_COLOMBO_COORDINATES = {
  lat: 6.9271,
  lng: 79.8612,
};

let googleMapsPromise: Promise<void> | null = null;

/**
 * Loads the Google Maps JavaScript API script once and returns a promise.
 * Safe to call multiple times across different components.
 */
export function loadGoogleMapsScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only be loaded in browser environment"));
  }

  // Already loaded
  if (window.google?.maps) {
    return Promise.resolve();
  }

  // Loading already in progress
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise<void>((resolve, reject) => {
    // Check if script tag is already in DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&loading=async`;
    script.async = true;
    script.defer = true;
    script.id = "google-maps-sdk";

    script.onload = () => {
      resolve();
    };

    script.onerror = (err) => {
      googleMapsPromise = null;
      reject(new Error(`Failed to load Google Maps SDK: ${err}`));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

/**
 * Modern Dark Mode Map Styling (Matches RE/MAX dark palette)
 */
export const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#e2e8f0" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#334155" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94a3b8" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#334155" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#cbd5e1" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94a3b8" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#020617" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#475569" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#020617" }],
  },
];

/**
 * Clean Light Mode Map Styling
 */
export const lightMapStyles: google.maps.MapTypeStyle[] = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#e9f2ff" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f8fafc" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e2e8f0" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#eaf5ea" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#f1f5f9" }],
  },
];

/**
 * Reverse geocode a latitude & longitude into structured address components
 */
export async function reverseGeocodeLatLng(
  lat: number,
  lng: number
): Promise<{
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  formattedAddress: string;
} | null> {
  await loadGoogleMapsScript();

  if (!window.google?.maps?.Geocoder) {
    return null;
  }

  const geocoder = new window.google.maps.Geocoder();

  return new Promise((resolve) => {
    geocoder.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status !== "OK" || !results || results.length === 0) {
          resolve(null);
          return;
        }

      const place = results[0];
      let streetNumber = "";
      let route = "";
      let neighborhood = "";
      let city = "";
      let state = "";
      let zipCode = "";

      for (const component of place.address_components) {
        const types = component.types;
        if (types.includes("street_number")) {
          streetNumber = component.long_name;
        } else if (types.includes("route")) {
          route = component.long_name;
        } else if (
          types.includes("sublocality") ||
          types.includes("sublocality_level_1") ||
          types.includes("neighborhood")
        ) {
          neighborhood = component.long_name;
        } else if (types.includes("locality")) {
          city = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          state = component.long_name;
        } else if (types.includes("postal_code")) {
          zipCode = component.long_name;
        }
      }

      const street = [streetNumber, route].filter(Boolean).join(" ");

      resolve({
        street: street || "",
        neighborhood,
        city: city || neighborhood || "Colombo",
        state: state || "Western Province",
        zipCode,
        formattedAddress: place.formatted_address,
      });
    });
  });
}
