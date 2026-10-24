export type PropertyType =
  | "Luxury Apartment"
  | "House / Bungalow"
  | "Colonial Villa"
  | "Penthouse"
  | "Commercial Property"
  | "Residential Land"
  | "Beachfront Villa"
  | "Studio / Bedsit";

export type ListingStatus = "Available" | "Pending" | "Sold" | "Featured";

export type ListingType = "For Sale" | "For Rent";

export interface Property {
  id: string;
  title: string;
  tagline: string;
  description: string;
  price: number; // in Sri Lankan Rupees (Rs. LKR) - Total price for Sale, Monthly rent for Rent
  pricePerSqft?: number;
  propertyType: PropertyType;
  listingType?: ListingType; // "For Sale" | "For Rent" (defaults to "For Sale")
  rentPeriod?: "monthly" | "yearly"; // defaults to "monthly"
  securityDeposit?: number; // Refundable deposit in Rs.
  status: ListingStatus;
  featured?: boolean;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSizePerches?: number; // Perches is the standard land unit in Sri Lanka (1 perch ≈ 272 sqft)
  lotSizeSqft?: number;
  yearBuilt: number;
  garageSpaces: number;
  hoaFeeMonthly?: number; // in Rs.
  annualTaxes?: number; // in Rs.
  
  // Location (Sri Lanka)
  address: {
    street: string;
    city: string; // e.g. "Colombo 07", "Colombo 03", "Colombo 05", "Mount Lavinia"
    district?: string; // e.g. "Colombo", "Gampaha", "Kalutara", "Kandy", "Galle"
    town?: string; // e.g. "Cinnamon Gardens", "Kollupitiya", "Rajagiriya", "Negombo"
    state: string; // "Western Province", "Southern Province", etc.
    zipCode: string;
    neighborhood: string; // "Cinnamon Gardens", "Kollupitiya", "Bambalapitiya", "Havelock City"
    country: string; // "Sri Lanka"
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };

  // Trust & Legal Verification Indicators
  deedStatus?: "Clear First-Class Title" | "Bim Saviya (Title Certificate)" | "Freehold Sinnakkara Deed" | "Bank Loan Approved";
  isVerifiedListing?: boolean;
  legalChecklist?: string[];

  // Proximity to Essential Infrastructure
  proximity?: string[];

  // Media
  images: string[];
  floorPlanUrl?: string;
  virtualTourUrl?: string;

  // Features and Amenities
  amenities: string[];
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyFilterState {
  searchQuery: string;
  propertyType: string;
  listingType: "All" | "For Sale" | "For Rent";
  district?: string;
  town?: string;
  minPrice: number;
  maxPrice: number;
  minBedrooms: number;
  minBathrooms: number;
  minSqft: number;
  amenities: string[];
  proximity: string[];
  verifiedOnly?: boolean;
  clearDeedOnly?: boolean;
  sortBy: "price_asc" | "price_desc" | "sqft_desc" | "newest";
}

export const SRI_LANKA_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Galle",
  "Matara",
] as const;

export const SRI_LANKA_TOWNS_BY_DISTRICT: Record<string, string[]> = {
  Colombo: [
    "Colombo 01 - Fort",
    "Colombo 02 - Slave Island",
    "Colombo 03 - Kollupitiya",
    "Colombo 04 - Bambalapitiya",
    "Colombo 05 - Havelock Town",
    "Colombo 06 - Wellawatte",
    "Colombo 07 - Cinnamon Gardens",
    "Colombo 08 - Borella",
    "Rajagiriya",
    "Battaramulla",
    "Nawala",
    "Mount Lavinia",
    "Dehiwala",
    "Kotte",
    "Thalawathugoda",
  ],
  Gampaha: [
    "Negombo",
    "Wattala",
    "Ja-Ela",
    "Kelaniya",
    "Kadawatha",
  ],
  Kalutara: [
    "Panadura",
    "Wadduwa",
    "Kalutara South",
    "Beruwala",
  ],
  Kandy: [
    "Kandy City",
    "Peradeniya",
    "Anniewatte",
  ],
  Galle: [
    "Galle Fort",
    "Unawatuna",
    "Hikkaduwa",
    "Thalpe",
  ],
  Matara: [
    "Mirissa",
    "Matara City",
    "Weligama",
  ],
};

export const PROXIMITY_OPTIONS = [
  "International Schools (< 1 km)",
  "Premier Private Hospitals",
  "Expressway / Highway Interchange",
  "Train / Metro Transit Hub",
  "Beachfront / Walking to Coast",
  "Shopping Mall & Supermarket (< 5 mins)",
] as const;

export const POPULAR_AMENITIES = [
  "Swimming Pool",
  "Smart Home Automation",
  "Ocean / Sea View",
  "Private Garage",
  "Modern Fitted Kitchen",
  "Backup Generator (100%)",
  "Private Balcony",
  "Rooftop Terrace",
  "Home Gym",
  "Solar Power System",
  "24/7 Security & CCTV",
  "Central Air Conditioning",
  "Maid's Quarters & Bathroom",
  "Landscaped Garden",
  "Passenger & Service Elevators",
  "Infinity Pool Overlooking Colombo",
];

export const COLOMBO_NEIGHBORHOODS = [
  "Colombo 01 - Fort",
  "Colombo 02 - Slave Island",
  "Colombo 03 - Kollupitiya",
  "Colombo 04 - Bambalapitiya",
  "Colombo 05 - Havelock Town",
  "Colombo 06 - Wellawatte",
  "Colombo 07 - Cinnamon Gardens",
  "Colombo 08 - Borella",
  "Rajagiriya",
  "Battaramulla",
  "Mount Lavinia / Dehiwala",
  "Negombo Coastal",
  "Galle Fort Enclave",
];
