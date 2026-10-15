import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyById, getProperties } from "@/lib/propertyService";
import {
  generateRealEstateListingJsonLd,
  generateBreadcrumbJsonLd,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import { formatLKR } from "@/lib/formatters";
import JsonLd from "@/components/JsonLd";
import PropertyDetailView from "./PropertyDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return {
      title: `Property Not Found | ${SITE_NAME}`,
      description: "The requested property listing could not be found.",
    };
  }

  const formattedPrice = formatLKR(property.price);

  const title = `${property.title} - ${formattedPrice} | ${property.address.city}, Sri Lanka`;
  const description = `${property.tagline}. ${property.bedrooms} Bed, ${property.bathrooms} Bath, ${property.squareFeet.toLocaleString()} SqFt ${property.propertyType} in ${property.address.neighborhood || property.address.city}.`;
  const canonicalUrl = `${SITE_URL}/properties/${property.id}`;
  const heroImage = property.images?.[0] || `${SITE_URL}/og-default.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroImage],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  // Fetch similar properties in the same category or price band
  const allProperties = await getProperties();
  const similarProperties = allProperties
    .filter((p) => p.id !== property.id)
    .slice(0, 3);

  // Generate valid Schema.org RealEstateListing structured data
  const realEstateJsonLd = generateRealEstateListingJsonLd(property);

  // Generate Breadcrumbs structured data
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Listings", url: "/" },
    { name: property.address.city, url: `/?city=${encodeURIComponent(property.address.city)}` },
    { name: property.title, url: `/properties/${property.id}` },
  ]);

  return (
    <>
      {/* Schema.org Structured Data for Rich Snippets & Answer Engine Optimization (AEO) */}
      <JsonLd data={realEstateJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Interactive Detail View */}
      <PropertyDetailView
        property={property}
        similarProperties={similarProperties}
      />
    </>
  );
}
