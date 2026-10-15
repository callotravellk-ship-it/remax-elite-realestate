# Aura Estates — Luxury Real Estate & Comparison Platform

A comprehensive, production-ready real estate web application built with **Next.js (App Router)**, **React 19**, **Tailwind CSS**, and **Firebase** (Firestore, Storage, Authentication). Engineered with advanced technical SEO, dynamic canonical tag management, and an interactive side-by-side comparison engine.

---

## 🌟 Key Features

### 1. Public-Facing Website & Property Showcase
- **Curated Architectural Showcase**: High-resolution image galleries, responsive property cards, status badges (*Available*, *Pending*, *Sold*, *Featured*), and price per square foot calculations.
- **Real-Time Search & Filtering**: Multi-parameter search by keyword, city, neighborhood, property type, price range, bedroom count, and amenities.
- **Mortgage & Financing Calculator**: Dynamic monthly breakdown (Principal & Interest, Taxes, Insurance, HOA) with custom down payment slider and interest rate controls.

### 2. Side-by-Side Property Comparison Engine
- **Persistent Comparison Drawer**: Floating tray across all routes tracking up to 4 selected listings with live count badges, thumbnails, and quick removal.
- **Dedicated Comparison Route (`/compare?ids=id1,id2,id3`)**:
  - Full matrix layout comparing price, price/sqft, beds, baths, square footage, year built, garage spaces, HOA, taxes, and location.
  - **Amenities Matrix**: Side-by-side checklist with included vs missing features.
  - **Best Value Highlights**: Automatically highlights lowest price, best price/sqft, and largest square footage.
  - **Difference Highlighter**: Option to toggle "Highlight differences only" to pinpoint differentiating factors immediately.
  - **One-Click Shareable Link**: Generates clean URLs with query parameters for client sharing and collaboration.

### 3. Advanced Technical SEO & Answer Engine Optimization (AEO)
- **Server-Side Rendering (SSR)**: Dynamic listing pages generated server-side for maximum crawlability and performance.
- **Schema.org Structured Data (JSON-LD)**:
  - Injects valid `RealEstateListing` + `SingleFamilyResidence`/`Apartment` schemas with exact price specifications, address, geo-coordinates, room counts, and amenity features.
  - `BreadcrumbList` schema for enhanced SERP navigation paths.
- **Dynamic Canonical Tag Management**:
  - Automatically sorts query parameters on `/compare` (e.g., `?ids=b,a` canonicalizes to `?ids=a,b`), preventing duplicate content penalties from parameter permutations while enabling shareable links.
  - Injects `noindex, follow` on multi-property query variations to preserve crawl budget and link equity.
- **Automated XML Sitemap & Robots**: Native `sitemap.ts` and `robots.ts` generated dynamically from the property repository.

### 4. Admin Management Portal (`/admin`)
- **Protected Routing**: Firebase Authentication gate with email/password authentication and evaluation fallback mode.
- **Full CRUD Listing Management**: Create, edit, and delete properties with instant cache and database updates.
- **Firebase Storage Image Pipeline**: Uploads image files directly to cloud storage with live percentage progress tracking.
- **1-Click Database Seeder**: Instantly populate Firestore with high-end architectural seed data.

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19 & TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Firebase Firestore (NoSQL)
- **Storage**: Firebase Cloud Storage (Image hosting)
- **Auth**: Firebase Authentication
- **State Management**: React Context API with LocalStorage persistence

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or pnpm

### 2. Environment Configuration
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Populate your Firebase project credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

> **Note**: If you run without Firebase credentials, the application automatically operates in **Demo Evaluation Mode** with a resilient mock repository and pre-seeded luxury properties!

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Admin Portal Access
Navigate to [http://localhost:3000/admin](http://localhost:3000/admin).
- If using Firebase Auth: Sign in with your registered admin credentials.
- If in Demo Evaluation Mode: Click the **⚡ Instant 1-Click Demo Admin Login** button (or sign in with `admin@realestate.com` / `admin123456`).

---

## 🔒 Firebase Security Rules

### Firestore Security Rules (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /properties/{propertyId} {
      // Anyone can read listings (public catalog & SEO crawlers)
      allow read: if true;
      // Only authenticated admins can create, update, or delete
      allow write: if request.auth != null;
    }
  }
}
```

### Firebase Storage Rules (`storage.rules`):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /properties/{allPaths=**} {
      // Anyone can view uploaded listing images
      allow read: if true;
      // Only authenticated admins can upload images
      allow write: if request.auth != null && request.resource.size < 15 * 1024 * 1024;
    }
  }
}
```

---

## 🚢 Deployment to Vercel & GitHub

### Deploy to Vercel
1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/new).
3. Import your GitHub repository.
4. In **Environment Variables**, add the keys from `.env.local`.
5. Click **Deploy**.
