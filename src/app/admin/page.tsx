"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types/property";
import {
  getProperties,
  deleteProperty,
  seedPropertiesToFirestore,
} from "@/lib/propertyService";
import { formatLKR, formatLKRShort, formatPropertyPrice } from "@/lib/formatters";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  Database,
  Building,
  DollarSign,
  Layers,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [seeding, setSeeding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (e) {
      console.error("Failed to load listings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete listing "${title}"?`)) {
      return;
    }
    try {
      await deleteProperty(id);
      setFeedback(`Listing "${title}" removed.`);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      console.error("Error deleting property:", e);
      alert("Failed to delete property.");
    }
  };

  const handleSeed = async () => {
    if (
      !window.confirm(
        "This will initialize/reset the property catalog with curated RE/MAX ELITE listings. Proceed?"
      )
    ) {
      return;
    }
    setSeeding(true);
    try {
      const res = await seedPropertiesToFirestore();
      setFeedback(`Successfully loaded ${res.count} listings into the database!`);
      await loadData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (e) {
      console.error("Failed to seed database:", e);
      alert("Error seeding data.");
    } finally {
      setSeeding(false);
    }
  };

  // Filter listings
  const filtered = properties.filter((item) => {
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (filterType !== "all" && (item.listingType || "For Sale") !== filterType) return false;
    if (search) {
      const query = search.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchCity = item.address.city.toLowerCase().includes(query);
      const matchType = item.propertyType.toLowerCase().includes(query);
      return matchTitle || matchCity || matchType;
    }
    return true;
  });

  // Calculate portfolio statistics
  const totalValue = properties.reduce((acc, curr) => acc + curr.price, 0);
  const avgSqft =
    properties.length > 0
      ? Math.round(
          properties.reduce((acc, curr) => acc + curr.squareFeet, 0) /
            properties.length
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            RE/MAX ELITE Listing Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, modify, sync images, and manage real estate documents in Firestore.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold shadow-sm transition-all disabled:opacity-50"
            title="Populate catalog with curated seed properties"
          >
            <Database className="w-3.5 h-3.5 text-blue-700" />
            <span>{seeding ? "Syncing..." : "Seed / Reset Listings"}</span>
          </button>

          <Link
            href="/admin/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Listing</span>
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Listings
            </span>
            <Building className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {properties.length}
          </div>
          <span className="text-[11px] text-slate-400">
            {properties.filter((p) => p.status === "Available").length} available on market
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Portfolio Value
            </span>
            <DollarSign className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {formatLKRShort(totalValue)}
          </div>
          <span className="text-[11px] text-slate-400">
            Combined active luxury inventory
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Average Space
            </span>
            <Layers className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {avgSqft.toLocaleString()} sqft
          </div>
          <span className="text-[11px] text-slate-400">
            Across RE/MAX ELITE portfolio
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Storage & DB Mode
            </span>
            <Sparkles className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-sm font-bold text-slate-800 mt-2">
            {isFirebaseConfigured ? "Firestore Live" : "Local Repository"}
          </div>
          <span className="text-[11px] text-slate-400">
            {isFirebaseConfigured ? "Synced to cloud project" : "Ready for env credentials"}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search listings by title, city, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-900 cursor-pointer font-semibold"
          >
            <option value="all">All Categories</option>
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-900 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Pending">Pending</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Loading properties from database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No properties found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px] font-bold">
                  <th className="p-4">Property</th>
                  <th className="p-4">Category & Type</th>
                  <th className="p-4">Price / Rent</th>
                  <th className="p-4">Specs</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Thumbnail + Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <Image
                            src={item.images?.[0] || ""}
                            alt={item.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {item.address.city}, {item.address.state}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category & Type */}
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider mb-1 ${
                          item.listingType === "For Rent"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-blue-100 text-blue-900 border border-blue-200"
                        }`}
                      >
                        {item.listingType || "For Sale"}
                      </span>
                      <p className="text-slate-700 font-semibold">{item.propertyType}</p>
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900">
                        {formatPropertyPrice(item.price, item.listingType)}
                      </div>
                      {item.listingType === "For Rent" && item.securityDeposit ? (
                        <div className="text-[10px] text-emerald-700 font-semibold">
                          Dep: {formatLKR(item.securityDeposit)}
                        </div>
                      ) : null}
                    </td>

                    {/* Specs */}
                    <td className="p-4 text-slate-600">
                      {item.bedrooms}bd • {item.bathrooms}ba • {item.squareFeet.toLocaleString()} sqft
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "Available"
                            ? "bg-blue-100 text-blue-900"
                            : item.status === "Pending"
                            ? "bg-amber-100 text-amber-900"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/properties/${item.id}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-blue-900 transition-colors"
                          title="View on site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/edit/${item.id}`}
                          className="p-1.5 text-slate-600 hover:text-red-600 transition-colors"
                          title="Edit Listing"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
