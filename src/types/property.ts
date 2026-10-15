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
  
  // Location (Colombo, Sri Lanka)
  address: {
    street: string;
    city: string; // e.g. "Colombo 07", "Colombo 03", "Colombo 05", "Mount Lavinia"
    state: string; // "Western Province"
    zipCode: string;
    neighborhood: string; // "Cinnamon Gardens", "Kollupitiya", "Bambalapitiya", "Havelock City"
    country: string; // "Sri Lanka"
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };

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
  minPrice: number;
  maxPrice: number;
  minBedrooms: number;
  minBathrooms: number;
  minSqft: number;
  amenities: string[];
  sortBy: "price_asc" | "price_desc" | "sqft_desc" | "newest";
}

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
