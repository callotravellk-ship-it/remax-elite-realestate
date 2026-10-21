"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/property";
import { useComparison } from "@/context/ComparisonContext";
import { formatLKR, formatPropertyPrice } from "@/lib/formatters";
import MortgageCalculator from "@/components/MortgageCalculator";
import PropertyMap from "@/components/PropertyMap";
import {
  Bed,
  Bath,
  Maximize2,
  Calendar,
  MapPin,
  Scale,
  Check,
  Plus,
  Send,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Home,
  KeyRound,
  FileText,
} from "lucide-react";

interface PropertyDetailViewProps {
  property: Property;
  similarProperties: Property[];
}

export default function PropertyDetailView({
  property,
  similarProperties,
}: PropertyDetailViewProps) {
  const { isInCompare, toggleCompare, selectedProperties, maxProperties } = useComparison();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState(
    `Hello, I would like to schedule a private walkthrough or receive more details regarding ${property.title} (${property.address.street}, ${property.address.city}) through RE/MAX ELITE Sri Lanka.`
  );

  const inCompare = isInCompare(property.id);

  const formattedPrice = formatPropertyPrice(property.price, property.listingType);

  const pricePerSqft =
    property.pricePerSqft || Math.round(property.price / property.squareFeet);

  const images = property.images && property.images.length > 0 ? property.images : [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75",
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      {/* Top Bar / Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-red-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Listings
            </Link>
            <span>/</span>
            <span className="text-slate-500">{property.address.city}</span>
            <span>/</span>
            <span className="text-slate-900 font-bold truncate max-w-[200px]">
              {property.title}
            </span>
          </nav>

          {/* Quick Action: Add to Compare */}
          <button
            onClick={() => toggleCompare(property)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
              inCompare
                ? "bg-red-50 text-red-700 border-red-300 hover:bg-red-100 shadow-sm"
                : "bg-white text-slate-700 border-slate-300 hover:border-red-600 hover:text-red-700"
            }`}
          >
            {inCompare ? (
              <>
                <Check className="w-3.5 h-3.5 text-red-600 stroke-[3]" />
                <span>In Comparison ({selectedProperties.length}/{maxProperties})</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <Scale className="w-3.5 h-3.5 text-blue-700" />
                <span>Add to Comparison</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Showcase Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Main Large Image */}
          <div className="relative aspect-[16/10] lg:col-span-8 rounded-2xl overflow-hidden bg-slate-900 shadow-md">
            <Image
              src={images[selectedImageIndex]}
              alt={`${property.title} - view ${selectedImageIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />

            {/* Slider Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur-md transition-all"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur-md transition-all"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image counter pill */}
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-white text-xs font-bold">
              {selectedImageIndex + 1} / {images.length} Photos
            </div>
          </div>

          {/* Thumbnails Column */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:col-span-4 max-h-[500px] overflow-y-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative aspect-[16/10] w-full rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImageIndex === idx
                    ? "border-red-600 ring-2 ring-red-600/30"
                    : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${property.title} preview ${idx + 1}`}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Property Details & Inquiry Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details & Specs */}
          <div className="lg:col-span-8 space-y-8">
            {/* Title & Price Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                        property.listingType === "For Rent"
                          ? "bg-emerald-600 text-white"
                          : "bg-blue-900 text-white"
                      }`}
                    >
                      {property.listingType === "For Rent" ? (
                        <KeyRound className="w-3.5 h-3.5" />
                      ) : (
                        <Home className="w-3.5 h-3.5" />
                      )}
                      {property.listingType || "For Sale"}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-800 text-xs font-bold uppercase tracking-wider border border-red-200">
                      {property.propertyType}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider border border-slate-200">
                      {property.status}
                    </span>

                    {property.featured && (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" /> Featured Listing
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    {property.title}
                  </h1>
                  <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-1.5">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>
                      {property.address.street}, {property.address.city},{" "}
                      {property.address.state} {property.address.zipCode}
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-slate-900">
                    {formattedPrice}
                  </div>
                  {property.listingType === "For Rent" ? (
                    <p className="text-xs font-bold text-emerald-700 mt-0.5">
                      {property.securityDeposit
                        ? `Security Deposit: ${formatLKR(property.securityDeposit)}`
                        : "Standard 6-Month Lease Deposit"}
                    </p>
                  ) : (
                    <p className="text-xs font-bold text-slate-500 mt-0.5">
                      Rs. {pricePerSqft.toLocaleString()} / sqft
                    </p>
                  )}
                </div>
              </div>

              {/* Key Specs Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Bed className="w-5 h-5 text-blue-700 mx-auto mb-1" />
                  <span className="text-xs text-slate-500 block">Bedrooms</span>
                  <span className="text-base font-bold text-slate-900">
                    {property.bedrooms} Beds
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Bath className="w-5 h-5 text-blue-700 mx-auto mb-1" />
                  <span className="text-xs text-slate-500 block">Bathrooms</span>
                  <span className="text-base font-bold text-slate-900">
                    {property.bathrooms} Baths
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Maximize2 className="w-5 h-5 text-blue-700 mx-auto mb-1" />
                  <span className="text-xs text-slate-500 block">Living Area</span>
                  <span className="text-base font-bold text-slate-900">
                    {property.squareFeet.toLocaleString()} sqft
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Calendar className="w-5 h-5 text-blue-700 mx-auto mb-1" />
                  <span className="text-xs text-slate-500 block">Year Built</span>
                  <span className="text-base font-bold text-slate-900">
                    {property.yearBuilt}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Narrative */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Architectural Overview & Narrative
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Comprehensive Amenities */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Amenities & Premium Features
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700"
                  >
                    <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 font-bold">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Architectural Specs Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Property Specifications & Taxes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Property Type</span>
                  <span className="font-bold text-slate-900 dark:text-white">{property.propertyType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Garage Capacity</span>
                  <span className="font-bold text-slate-900 dark:text-white">{property.garageSpaces} Vehicles</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Land Extent</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {property.lotSizePerches
                      ? `${property.lotSizePerches} Perches (${property.lotSizeSqft?.toLocaleString() || property.squareFeet.toLocaleString()} sqft)`
                      : property.lotSizeSqft
                      ? `${property.lotSizeSqft.toLocaleString()} sqft`
                      : "Apartment Unit"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Monthly Maintenance</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {property.hoaFeeMonthly ? `Rs. ${property.hoaFeeMonthly.toLocaleString()}/month` : "None"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Annual Municipal Rates (Est.)</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {property.annualTaxes ? `Rs. ${property.annualTaxes.toLocaleString()}/year` : "Assessed annually"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                  <span className="font-bold text-slate-900 dark:text-white">{property.status}</span>
                </div>
              </div>
            </div>

            {/* Interactive Google Map Location */}
            <PropertyMap
              title={property.title}
              price={property.price}
              listingType={property.listingType}
              address={property.address}
            />

            {/* Interactive Mortgage Calculator for sales, or Lease Terms for rentals */}
            {property.listingType === "For Rent" ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                      Lease Terms & Tenancy Framework
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Standard luxury residential & corporate leasing terms in Colombo
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Monthly Lease Rate</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {formattedPrice}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                      Payable on the 1st of each calendar month
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Refundable Security Deposit</span>
                    <span className="text-base font-black text-emerald-700 dark:text-emerald-400">
                      {property.securityDeposit
                        ? formatLKR(property.securityDeposit)
                        : "6 Months Rental Equivalent"}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                      Fully refundable at completion of tenancy
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Minimum Lease Duration</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      1 Year (12 Months)
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                      Option for annual mutual extension
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Utilities & Maintenance</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {property.hoaFeeMonthly
                        ? `Rs. ${property.hoaFeeMonthly.toLocaleString()}/mo`
                        : "Included"}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                      Electricity & water metered independently
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>
                    <strong>Corporate & Diplomatic Leases Welcome:</strong> RE/MAX ELITE Colombo provides complete legal agreement vetting, inventory condition reports, stamp duty compliance, and dedicated landlord-tenant liaison.
                  </span>
                </div>
              </div>
            ) : (
              <MortgageCalculator
                initialPrice={property.price}
                annualTaxes={property.annualTaxes || 250000}
                monthlyHoa={property.hoaFeeMonthly || 35000}
              />
            )}
          </div>

          {/* Right Column: Contact Inquiry & Agent Card */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="relative h-10 w-28">
                  <Image
                    src="/logo.png"
                    alt="RE/MAX ELITE"
                    fill
                    className="object-contain block dark:hidden"
                  />
                  <Image
                    src="/logo-dark.png"
                    alt="RE/MAX ELITE"
                    fill
                    className="object-contain hidden dark:block"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    RE/MAX ELITE Group
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Exclusive Listing Representation
                  </p>
                </div>
              </div>

              {formSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    Inquiry Sent Successfully!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    A certified RE/MAX ELITE agent will reach out within 2 hours to confirm your private showing.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+94 77 123 4567"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Inquiry Message
                    </label>
                    <textarea
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/30"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Private Showing</span>
                  </button>
                </form>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-blue-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                  RE/MAX Verified
                </span>
                <span>MLS ID: #{property.id.slice(-6).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Listings */}
        {similarProperties.length > 0 && (
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Similar Properties by RE/MAX ELITE
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((simProp) => (
                <Link
                  key={simProp.id}
                  href={`/properties/${simProp.id}`}
                  className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <Image
                      src={simProp.images?.[0] || ""}
                      alt={simProp.title}
                      fill
                      sizes="350px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-red-600 transition-colors">
                      {simProp.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {simProp.address.city}, {simProp.address.state}
                    </p>
                    <p className="text-sm font-black text-red-600 mt-2">
                      {formatLKR(simProp.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
