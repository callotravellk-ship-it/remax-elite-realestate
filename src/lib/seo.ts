import { Property } from "@/types/property";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const SITE_NAME = "RE/MAX ELITE Sri Lanka | Real Estate in Colombo & Property Comparison";

export const DEFAULT_DESCRIPTION =
  "Remax Elite Sri Lanka — Premier real estate agency in Colombo. Search property for sale in Sri Lanka, luxury apartments for sale in Colombo, houses, land, bungalows, and beachfront property with side-by-side comparison tools.";

export const SRI_LANKA_REAL_ESTATE_KEYWORDS = [
  // Broad Sri Lanka Keywords
  "real estate in Sri Lanka",
  "property for sale in Sri Lanka",
  "houses for sale in Sri Lanka",
  "apartments for sale in Sri Lanka",
  "land for sale in Sri Lanka",
  "commercial property for sale in Sri Lanka",
  "new developments for sale in Sri Lanka",
  "real estate agents in Sri Lanka",
  "top real estate companies in Sri Lanka",

  // Colombo Specific Keywords
  "real estate in Colombo",
  "property for sale in Colombo",
  "apartments for sale in Colombo",
  "houses for sale in Colombo",
  "commercial properties for sale in Colombo",
  "land for sale in Colombo",
  "luxury apartments for sale in Colombo",
  "new developments for sale in Colombo",
  "studio/bedsit for sale in Colombo",
  "bungalows for sale in Colombo",
  "hotels for sale in Colombo",
  "villas for sale in Colombo",
  "apartment rentals in Colombo",
  "house rentals in Colombo",
  "commercial property rentals in Colombo",
  "holiday & short-term rental in Colombo",
  "room & annex rentals in Colombo",
  "real estate agencies Colombo",
  "property rentals Colombo",

  // Branded Keywords
  "Remax Elite Sri Lanka",
  "Remax Elite Colombo",
  "Remax Elite real estate",

  // Targeted Long-Tail Keywords
  "buy property in Colombo Sri Lanka",
  "rent house in Colombo",
  "furnished apartments for rent in Colombo",
  "invest in Sri Lanka real estate",
  "best real estate agency in Colombo",
  "luxury real estate Sri Lanka",
  "beachfront property for sale Sri Lanka",
];

/**
 * Builds structured JSON-LD data for a real estate listing in Sri Lanka
 */
export function generateRealEstateListingJsonLd(property: Property) {
  const propertyUrl = `${SITE_URL}/properties/${property.id}`;
  
  const residenceType =
    property.propertyType === "Luxury Apartment" ||
    property.propertyType === "Penthouse" ||
    property.propertyType === "Studio / Bedsit"
      ? "Apartment"
      : "SingleFamilyResidence";

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${propertyUrl}#listing`,
    name: property.title,
    description: property.description,
    url: propertyUrl,
    datePosted: property.createdAt || "2026-01-01T00:00:00Z",
    image: property.images,
    mainEntity: {
      "@type": residenceType,
      name: property.title,
      description: property.description,
      address: {
        "@type": "PostalAddress",
        streetAddress: property.address.street,
        addressLocality: property.address.city,
        addressRegion: property.address.state || "Western Province",
        postalCode: property.address.zipCode,
        addressCountry: "LK",
      },
      geo: property.address.coordinates
        ? {
            "@type": "GeoCoordinates",
            latitude: property.address.coordinates.latitude,
            longitude: property.address.coordinates.longitude,
          }
        : undefined,
      numberOfRooms: property.bedrooms + property.bathrooms,
      numberOfBedrooms: property.bedrooms,
      numberOfBathroomsTotal: property.bathrooms,
      yearBuilt: property.yearBuilt,
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.squareFeet,
        unitCode: "FTK", // Square Foot
      },
      amenityFeature: property.amenities.map((amenity) => ({
        "@type": "LocationFeatureSpecification",
        name: amenity,
        value: true,
      })),
      photo: property.images.map((imgUrl) => ({
        "@type": "Photograph",
        contentUrl: imgUrl,
      })),
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "LKR", // Sri Lankan Rupee
      businessFunction:
        property.listingType === "For Rent"
          ? "http://purl.org/goodrelations/v1#LeaseOut"
          : "http://purl.org/goodrelations/v1#Sell",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: property.price,
        priceCurrency: "LKR",
        unitText: property.listingType === "For Rent" ? "month" : "property",
      },
      availability:
        property.status === "Available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      validFrom: property.createdAt || "2026-01-01T00:00:00Z",
    },
  };
}

/**
 * Builds BreadcrumbList JSON-LD for rich snippet navigation
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Sorts comparison IDs deterministically to create a normalized canonical URL
 */
export function getCanonicalCompareUrl(rawIds?: string | string[]): {
  canonicalUrl: string;
  sortedIds: string[];
  shouldIndex: boolean;
} {
  if (!rawIds) {
    return {
      canonicalUrl: `${SITE_URL}/compare`,
      sortedIds: [],
      shouldIndex: true,
    };
  }

  const idsArray = Array.isArray(rawIds)
    ? rawIds
    : rawIds
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  if (idsArray.length === 0) {
    return {
      canonicalUrl: `${SITE_URL}/compare`,
      sortedIds: [],
      shouldIndex: true,
    };
  }

  const sortedIds = [...idsArray].sort();
  const canonicalUrl = `${SITE_URL}/compare?ids=${sortedIds.map((id) => encodeURIComponent(id)).join(",")}`;

  return {
    canonicalUrl,
    sortedIds,
    shouldIndex: false,
  };
}

/**
 * Builds Organization / RealEstateAgent JSON-LD for Remax Elite Sri Lanka
 */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "RE/MAX ELITE Sri Lanka",
    alternateName: ["Remax Elite Colombo", "Remax Elite real estate"],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      streetAddress: "No 7 - 3/1 E, Orchard Shopping Complex, Galle Road",
      addressLocality: "Colombo 06",
      addressRegion: "Western Province",
      postalCode: "00600",
      addressCountry: "LK",
    },
    telephone: "+94-11-234-5678",
    email: "colombo@remax-elite.lk",
    priceRange: "Rs. 25,000,000 - Rs. 1,000,000,000",
    currenciesAccepted: "LKR, USD",
    areaServed: [
      "Colombo",
      "Colombo 06 - Wellawatte",
      "Colombo 07 - Cinnamon Gardens",
      "Colombo 03 - Kollupitiya",
      "Colombo 05 - Havelock Town",
      "Mount Lavinia",
      "Rajagiriya",
      "Sri Lanka",
    ],
  };
}

/**
 * Builds ContactPage JSON-LD for Remax Elite Colombo Contact Page
 */
export function generateContactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact RE/MAX ELITE Colombo, Sri Lanka",
    url: `${SITE_URL}/contact`,
    description: "Contact top real estate agents in Sri Lanka at RE/MAX ELITE Colombo for properties, apartments, houses, and land for sale.",
    mainEntity: {
      "@type": "RealEstateAgent",
      name: "RE/MAX ELITE Sri Lanka",
      telephone: "+94-11-234-5678",
      email: "colombo@remax-elite.lk",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+94-11-234-5678",
        contactType: "customer service",
        availableLanguage: ["English", "Sinhala", "Tamil"],
      },
    },
  };
}
