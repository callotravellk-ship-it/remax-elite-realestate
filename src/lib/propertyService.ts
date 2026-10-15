import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { upload } from "@vercel/blob/client";
import { Property } from "@/types/property";
import { initialProperties } from "@/data/mockProperties";

const COLLECTION_NAME = "properties";
const LOCAL_STORAGE_KEY = "estate_properties_custom";

// Helper to prevent Firebase SDK from hanging indefinitely
function withTimeout<T>(promise: Promise<T>, ms: number = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Firestore request timed out after ${ms}ms`)), ms)
    ),
  ]);
}

// Local storage helper for mock/fallback mode
export function getLocalCustomProperties(): Property[] {
  if (typeof window === "undefined") return initialProperties;
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialProperties));
      return initialProperties;
    }
    return JSON.parse(stored);
  } catch {
    return initialProperties;
  }
}

function saveLocalCustomProperties(properties: Property[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(properties));
  } catch (err) {
    console.error("Failed to save properties to localStorage:", err);
  }
}

/**
 * Fetch all properties from Firestore or fallback to mock dataset
 */
export async function getProperties(): Promise<Property[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const snapshot = await withTimeout(getDocs(q), 4000);
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Property[];
      }
    } catch (error) {
      console.warn("Firestore fetch failed, using fallback mock data:", error);
    }
  }

  return getLocalCustomProperties();
}

/**
 * Fetch a single property by ID
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await withTimeout(getDoc(docRef), 4000);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Property;
      }
    } catch (error) {
      console.warn(`Firestore getDoc failed for ${id}, checking fallback:`, error);
    }
  }

  const all = getLocalCustomProperties();
  const match = all.find((p) => p.id === id);
  return match || null;
}

/**
 * Fetch multiple properties by their IDs (for comparison page)
 */
export async function getPropertiesByIds(ids: string[]): Promise<Property[]> {
  if (!ids || ids.length === 0) return [];
  
  const results: Property[] = [];
  for (const id of ids) {
    const prop = await getPropertyById(id);
    if (prop) results.push(prop);
  }
  return results;
}

/**
 * Create a new property listing
 */
export async function createProperty(data: Omit<Property, "id"> & { id?: string }): Promise<Property> {
  const newId = data.id || `prop-${Date.now()}`;
  const now = new Date().toISOString();
  const newProperty: Property = {
    ...data,
    id: newId,
    createdAt: data.createdAt || now,
    updatedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, newId);
      await setDoc(docRef, newProperty);
      return newProperty;
    } catch (error) {
      console.error("Failed to write to Firestore, saving locally:", error);
    }
  }

  // Fallback to localStorage
  const current = getLocalCustomProperties();
  const updated = [newProperty, ...current];
  saveLocalCustomProperties(updated);
  return newProperty;
}

/**
 * Update an existing property listing
 */
export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
  const now = new Date().toISOString();
  const payload = { ...updates, updatedAt: now };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, payload);
      const updated = await getPropertyById(id);
      if (updated) return updated;
    } catch (error) {
      console.error("Firestore update failed, updating locally:", error);
    }
  }

  // Fallback update
  const current = getLocalCustomProperties();
  const index = current.findIndex((p) => p.id === id);
  if (index >= 0) {
    const updated = { ...current[index], ...payload };
    current[index] = updated;
    saveLocalCustomProperties(current);
    return updated;
  }

  throw new Error(`Property with id ${id} not found.`);
}

/**
 * Delete a property listing
 */
export async function deleteProperty(id: string): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Firestore delete failed, deleting locally:", error);
    }
  }

  const current = getLocalCustomProperties();
  const filtered = current.filter((p) => p.id !== id);
  saveLocalCustomProperties(filtered);
  return true;
}

/**
 * Upload an image file directly to Vercel Blob using the Client Upload pattern
 */
export async function uploadPropertyImage(
  file: File,
  folder: string = "properties",
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const pathname = `${folder}/${Date.now()}-${sanitizedName}`;

    const newBlob = await upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          onProgress(progressEvent.percentage);
        }
      },
    });

    return newBlob.url;
  } catch (error) {
    console.error("Vercel Blob client upload error:", error);
    // Offline or fallback: return a data URL so the user can continue testing
    return new Promise((resolve) => {
      if (onProgress) {
        onProgress(30);
        setTimeout(() => onProgress(75), 150);
        setTimeout(() => onProgress(100), 300);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Admin utility: Seed initial properties to Firestore
 */
export async function seedPropertiesToFirestore(): Promise<{ count: number }> {
  if (!isFirebaseConfigured || !db) {
    // Reset local custom properties
    saveLocalCustomProperties(initialProperties);
    return { count: initialProperties.length };
  }

  let count = 0;
  for (const property of initialProperties) {
    const docRef = doc(db, COLLECTION_NAME, property.id);
    await setDoc(docRef, property, { merge: true });
    count++;
  }
  return { count };
}
