"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Property } from "@/types/property";
import { getPropertyById } from "@/lib/propertyService";

interface ComparisonContextType {
  selectedProperties: Property[];
  addToCompare: (property: Property) => { success: boolean; reason?: string };
  removeFromCompare: (propertyId: string) => void;
  toggleCompare: (property: Property) => void;
  clearCompare: () => void;
  isInCompare: (propertyId: string) => boolean;
  isTrayOpen: boolean;
  setIsTrayOpen: (isOpen: boolean) => void;
  maxProperties: number;
  getCompareUrl: () => string;
  syncFromIds: (ids: string[]) => Promise<void>;
}

const MAX_COMPARE_ITEMS = 4;
const STORAGE_KEY = "estate_comparison_tray";

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSelectedProperties(parsed.slice(0, MAX_COMPARE_ITEMS));
        }
      }
    } catch (e) {
      console.error("Failed to load comparison state from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever selectedProperties changes (after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProperties));
    } catch (e) {
      console.error("Failed to save comparison state to localStorage:", e);
    }
  }, [selectedProperties, isHydrated]);

  const isInCompare = useCallback(
    (propertyId: string) => {
      return selectedProperties.some((p) => p.id === propertyId);
    },
    [selectedProperties]
  );

  const addToCompare = useCallback(
    (property: Property) => {
      if (selectedProperties.some((p) => p.id === property.id)) {
        return { success: false, reason: "Property is already in the comparison tray" };
      }
      if (selectedProperties.length >= MAX_COMPARE_ITEMS) {
        return {
          success: false,
          reason: `You can compare up to ${MAX_COMPARE_ITEMS} properties at once. Please remove one first.`,
        };
      }
      setSelectedProperties((prev) => [...prev, property]);
      setIsTrayOpen(true);
      return { success: true };
    },
    [selectedProperties]
  );

  const removeFromCompare = useCallback((propertyId: string) => {
    setSelectedProperties((prev) => prev.filter((p) => p.id !== propertyId));
  }, []);

  const toggleCompare = useCallback(
    (property: Property) => {
      if (isInCompare(property.id)) {
        removeFromCompare(property.id);
      } else {
        addToCompare(property);
      }
    },
    [isInCompare, removeFromCompare, addToCompare]
  );

  const clearCompare = useCallback(() => {
    setSelectedProperties([]);
  }, []);

  const getCompareUrl = useCallback(() => {
    if (selectedProperties.length === 0) return "/compare";
    const ids = selectedProperties.map((p) => encodeURIComponent(p.id)).join(",");
    return `/compare?ids=${ids}`;
  }, [selectedProperties]);

  const syncFromIds = useCallback(
    async (ids: string[]) => {
      if (!ids || ids.length === 0) return;
      const validIds = ids.slice(0, MAX_COMPARE_ITEMS);
      const fetched: Property[] = [];
      for (const id of validIds) {
        // check if already in selected
        const existing = selectedProperties.find((p) => p.id === id);
        if (existing) {
          fetched.push(existing);
        } else {
          const prop = await getPropertyById(id);
          if (prop) fetched.push(prop);
        }
      }
      if (fetched.length > 0) {
        setSelectedProperties(fetched);
      }
    },
    [selectedProperties]
  );

  return (
    <ComparisonContext.Provider
      value={{
        selectedProperties,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isInCompare,
        isTrayOpen,
        setIsTrayOpen,
        maxProperties: MAX_COMPARE_ITEMS,
        getCompareUrl,
        syncFromIds,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
