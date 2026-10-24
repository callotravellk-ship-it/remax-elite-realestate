"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Property, PropertyType, ListingStatus, ListingType, POPULAR_AMENITIES } from "@/types/property";
import {
  createProperty,
  updateProperty,
  uploadPropertyImage,
} from "@/lib/propertyService";
import { compressImage } from "@/lib/imageCompressor";
import {
  UploadCloud,
  X,
  DollarSign,
  MapPin,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import AdminLocationPicker from "./AdminLocationPicker";

interface PropertyFormProps {
  initialData?: Property;
  isEditing?: boolean;
}

export default function PropertyForm({
  initialData,
  isEditing = false,
}: PropertyFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [tagline, setTagline] = useState(initialData?.tagline || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [listingType, setListingType] = useState<ListingType>(
    initialData?.listingType || "For Sale"
  );
  const [price, setPrice] = useState(initialData?.price || 125000000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(
    initialData?.securityDeposit || 0
  );
  const [propertyType, setPropertyType] = useState<PropertyType>(
    initialData?.propertyType || "Luxury Apartment"
  );
  const [status, setStatus] = useState<ListingStatus>(
    initialData?.status || "Available"
  );
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [bedrooms, setBedrooms] = useState(initialData?.bedrooms || 3);
  const [bathrooms, setBathrooms] = useState(initialData?.bathrooms || 3);
  const [squareFeet, setSquareFeet] = useState(initialData?.squareFeet || 2400);
  const [lotSizePerches, setLotSizePerches] = useState(initialData?.lotSizePerches || 0);
  const [lotSizeSqft, setLotSizeSqft] = useState(initialData?.lotSizeSqft || 0);
  const [yearBuilt, setYearBuilt] = useState(initialData?.yearBuilt || 2024);
  const [garageSpaces, setGarageSpaces] = useState(initialData?.garageSpaces || 2);
  const [hoaFeeMonthly, setHoaFeeMonthly] = useState(initialData?.hoaFeeMonthly || 35000);
  const [annualTaxes, setAnnualTaxes] = useState(initialData?.annualTaxes || 250000);

  // Address
  const [street, setStreet] = useState(initialData?.address.street || "");
  const [city, setCity] = useState(initialData?.address.city || "Colombo 07");
  const [district, setDistrict] = useState(initialData?.address.district || "Colombo");
  const [town, setTown] = useState(initialData?.address.town || "");
  const [state, setState] = useState(initialData?.address.state || "Western Province");
  const [zipCode, setZipCode] = useState(initialData?.address.zipCode || "00700");
  const [neighborhood, setNeighborhood] = useState(
    initialData?.address.neighborhood || "Cinnamon Gardens"
  );
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | undefined>(
    initialData?.address.coordinates
  );

  // Trust Indicators
  const [deedStatus, setDeedStatus] = useState<Property["deedStatus"]>(
    initialData?.deedStatus || "Clear First-Class Title"
  );
  const [isVerifiedListing, setIsVerifiedListing] = useState<boolean>(
    initialData?.isVerifiedListing ?? true
  );

  // Amenities
  const [amenities, setAmenities] = useState<string[]>(
    initialData?.amenities || ["Central Air Conditioning", "Hardwood Floors"]
  );
  const [customAmenity, setCustomAmenity] = useState("");

  // Images
  const [images, setImages] = useState<string[]>(
    initialData?.images || [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=75",
    ]
  );
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Amenities toggle
  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleAddCustomAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      setAmenities((prev) => [...prev, customAmenity.trim()]);
      setCustomAmenity("");
    }
  };

  // Image upload handler pushing file directly to Vercel Blob via Client Upload with automatic client-side compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMsg(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Automatically compress/downscale large phone/camera images before upload
        const optimizedFile = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1440,
          quality: 0.82,
        });

        const downloadUrl = await uploadPropertyImage(
          optimizedFile,
          "properties",
          (progress) => {
            setUploadProgress(Math.round(progress));
          }
        );
        setImages((prev) => [...prev, downloadUrl]);
      }
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const msg = err instanceof Error ? err.message : "Failed to upload photo. Please try again.";
      setErrorMsg(msg);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleAddManualImage = () => {
    if (manualImageUrl.trim()) {
      setImages((prev) => [...prev, manualImageUrl.trim()]);
      setManualImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) => {
      const item = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [item, ...rest];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || !street.trim() || !city.trim()) {
      setErrorMsg("Please fill in Title, Street Address, and City.");
      return;
    }

    if (images.length === 0) {
      setErrorMsg("Please add at least one property image.");
      return;
    }

    setIsSaving(true);

    const pricePerSqft = Math.round(price / (squareFeet || 1));

    const propertyPayload = {
      title,
      tagline,
      description,
      listingType,
      rentPeriod: listingType === "For Rent" ? ("monthly" as const) : undefined,
      securityDeposit: listingType === "For Rent" && securityDeposit > 0 ? securityDeposit : undefined,
      price,
      pricePerSqft,
      propertyType,
      status,
      featured,
      bedrooms,
      bathrooms,
      squareFeet,
      lotSizePerches: lotSizePerches > 0 ? lotSizePerches : undefined,
      lotSizeSqft,
      yearBuilt,
      garageSpaces,
      hoaFeeMonthly,
      annualTaxes,
      deedStatus,
      isVerifiedListing,
      proximity: initialData?.proximity,
      legalChecklist: initialData?.legalChecklist,
      address: {
        street,
        city,
        district,
        town: town || neighborhood,
        state,
        zipCode,
        neighborhood,
        country: "Sri Lanka",
        coordinates: coordinates?.latitude && coordinates?.longitude ? coordinates : undefined,
      },
      amenities,
      images,
    };

    try {
      if (isEditing && initialData) {
        await updateProperty(initialData.id, propertyPayload);
      } else {
        await createProperty(propertyPayload);
      }
      router.push("/admin");
    } catch (err: unknown) {
      console.error("Save error:", err);
      const msg = err instanceof Error ? err.message : "Failed to save property listing.";
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Catalog
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isEditing ? `Edit: ${initialData?.title}` : "Create New Property Listing"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fill in architectural specifications, upload high-resolution images, and define amenities for RE/MAX ELITE.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving || isUploading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/30 disabled:opacity-50"
        >
          {isSaving ? "Saving to Database..." : isEditing ? "Save Changes" : "Publish Listing"}
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Basic Info Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
          Core Property Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Listing Category Toggle */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Listing Category *
            </label>
            <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => {
                  setListingType("For Sale");
                  if (price < 10000000) setPrice(125000000);
                }}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  listingType === "For Sale"
                    ? "bg-blue-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                For Sale
              </button>
              <button
                type="button"
                onClick={() => {
                  setListingType("For Rent");
                  if (price > 10000000) setPrice(450000);
                }}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  listingType === "For Rent"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                For Rent
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Select whether this listing is offered for outright acquisition or lease/rental.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Property Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. The Solarium Architectural Villa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Marketing Tagline
            </label>
            <input
              type="text"
              placeholder="e.g. Modernist hilltop sanctuary with panoramic infinity pool"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {listingType === "For Rent"
                ? "Monthly Rental Rate (Rs. / month) *"
                : "Sale Price (Rs. - LKR) *"}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                Rs.
              </span>
              <input
                type="number"
                required
                min="0"
                step={listingType === "For Rent" ? "25000" : "500000"}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white font-medium"
            >
              <option value="Luxury Apartment">Luxury Apartment</option>
              <option value="House / Bungalow">House / Bungalow</option>
              <option value="Colonial Villa">Colonial Villa</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Commercial Property">Commercial Property</option>
              <option value="Residential Land">Residential Land</option>
              <option value="Beachfront Villa">Beachfront Villa</option>
              <option value="Studio / Bedsit">Studio / Bedsit</option>
            </select>
          </div>

          {listingType === "For Rent" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Refundable Security Deposit (Rs.)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                  Rs.
                </span>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={securityDeposit || ""}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value) || 0)}
                  placeholder="e.g. 2,700,000 (6 months)"
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white font-semibold"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Listing Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ListingStatus)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
            >
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <span>Mark as Featured Home</span>
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Architectural Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the architectural design, natural lighting, finishes, materials, and private amenities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Location Details & Google Map Pinning */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600" /> Location & Google Map Pin
          </h2>
          <span className="text-[11px] text-slate-400">
            Type address or click map to auto-fill
          </span>
        </div>

        {/* Google Map Picker & Places Autocomplete */}
        <AdminLocationPicker
          currentCoordinates={coordinates}
          street={street}
          city={city}
          neighborhood={neighborhood}
          state={state}
          zipCode={zipCode}
          onChange={(loc) => {
            if (loc.street !== undefined) setStreet(loc.street);
            if (loc.neighborhood !== undefined) setNeighborhood(loc.neighborhood);
            if (loc.city !== undefined) setCity(loc.city);
            if (loc.state !== undefined) setState(loc.state);
            if (loc.zipCode !== undefined) setZipCode(loc.zipCode);
            if (loc.coordinates) setCoordinates(loc.coordinates);
          }}
        />

        <div className="pt-2">
          <span className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-3">
            Address Fields (Auto-populated from map or editable manually):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 24 Barnes Place"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Neighborhood
              </label>
              <input
                type="text"
                placeholder="e.g. Wellawatte"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Colombo 06"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Province / State
              </label>
              <input
                type="text"
                placeholder="e.g. Western Province"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                placeholder="e.g. 00600"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
          Architectural Specifications
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bedrooms
            </label>
            <input
              type="number"
              min="0"
              value={bedrooms}
              onChange={(e) => setBedrooms(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bathrooms
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={bathrooms}
              onChange={(e) => setBathrooms(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Square Feet
            </label>
            <input
              type="number"
              min="0"
              value={squareFeet}
              onChange={(e) => setSquareFeet(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Year Built
            </label>
            <input
              type="number"
              min="1800"
              max="2030"
              value={yearBuilt}
              onChange={(e) => setYearBuilt(Number(e.target.value) || 2023)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Garage Capacity
            </label>
            <input
              type="number"
              min="0"
              value={garageSpaces}
              onChange={(e) => setGarageSpaces(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Land Extent (Perches)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g. 15.5"
              value={lotSizePerches || ""}
              onChange={(e) => setLotSizePerches(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Lot Size (SqFt)
            </label>
            <input
              type="number"
              min="0"
              value={lotSizeSqft || ""}
              onChange={(e) => setLotSizeSqft(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Monthly Maintenance (Rs.)
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={hoaFeeMonthly}
              onChange={(e) => setHoaFeeMonthly(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Annual Municipal Rates (Rs.)
            </label>
            <input
              type="number"
              min="0"
              step="5000"
              value={annualTaxes}
              onChange={(e) => setAnnualTaxes(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Property Photos Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-red-600" /> Property Photos & Gallery
            </h2>
            <p className="text-xs text-slate-500">
              Upload photos of your property from your device, or add image links.
            </p>
          </div>
          <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
            {images.length} Photos Added
          </span>
        </div>

        {/* Upload drop box */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-red-500 transition-colors bg-slate-50/50">
          <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">
            Click or tap to upload property photos
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
            Supports high-resolution JPG, PNG, and WebP photos
          </p>

          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold cursor-pointer transition-all shadow-sm">
            <span>Browse Photos</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Progress bar */}
          {uploadProgress !== null && (
            <div className="mt-4 max-w-xs mx-auto">
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span>Uploading photos...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-red-600 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Or Add by URL */}
        <div className="flex gap-2 pt-2">
          <input
            type="url"
            placeholder="Or paste an image web link (https://...)"
            value={manualImageUrl}
            onChange={(e) => setManualImageUrl(e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button
            type="button"
            onClick={handleAddManualImage}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors border border-slate-300"
          >
            Add URL
          </button>
        </div>

        {/* Uploaded Gallery Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {images.map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 group bg-slate-100"
              >
                <Image
                  src={imgUrl}
                  alt={`Listing image ${idx + 1}`}
                  fill
                  sizes="200px"
                  className="object-cover"
                />

                {/* Primary Badge */}
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold backdrop-blur-sm shadow-sm">
                    Primary
                  </span>
                )}

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      className="px-2 py-1 bg-white text-slate-900 rounded text-[10px] font-bold hover:bg-slate-100"
                    >
                      Set Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Amenities Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
          Amenities & Features
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {POPULAR_AMENITIES.map((amenity) => {
            const checked = amenities.includes(amenity);
            return (
              <label
                key={amenity}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  checked
                    ? "bg-red-50 border-red-300 text-red-950 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAmenity(amenity)}
                  className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span>{amenity}</span>
              </label>
            );
          })}
        </div>

        {/* Add custom amenity */}
        <div className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Add custom amenity (e.g. Helipad, Tennis Court)..."
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button
            type="button"
            onClick={handleAddCustomAmenity}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors border border-slate-300"
          >
            Add Custom
          </button>
        </div>
      </div>

      {/* Submit Bottom Bar */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Link
          href="/admin"
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSaving || isUploading}
          className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/30 disabled:opacity-50"
        >
          {isSaving ? "Saving to Database..." : isEditing ? "Save Changes" : "Publish Listing"}
        </button>
      </div>
    </form>
  );
}
