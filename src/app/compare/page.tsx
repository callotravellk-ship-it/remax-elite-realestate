import { Metadata } from "next";
import { getPropertiesByIds, getProperties } from "@/lib/propertyService";
import { getCanonicalCompareUrl, SITE_NAME } from "@/lib/seo";
import CompareView from "./CompareView";
import { Property } from "@/types/property";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const rawIds = params.ids;
  const { canonicalUrl, sortedIds, shouldIndex } = getCanonicalCompareUrl(rawIds);

  const count = sortedIds.length;
  const title = count > 0
    ? `Compare ${count} Luxury Properties Side-by-Side | ${SITE_NAME}`
    : `Property Comparison Matrix | ${SITE_NAME}`;

  const description = count > 0
    ? `Detailed side-by-side comparison of ${count} selected luxury properties. Compare prices, price per square foot, architectural specs, and amenities.`
    : `Select and compare up to 4 luxury estates, penthouses, and residences side-by-side with our interactive real estate comparison engine.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: shouldIndex,
      follow: true,
      googleBot: {
        index: shouldIndex,
        follow: true,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ComparePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawIds = params.ids;
  
  let urlIds: string[] = [];
  if (rawIds) {
    urlIds = (Array.isArray(rawIds) ? rawIds[0] : rawIds)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  let initialProperties: Property[] = [];
  if (urlIds.length > 0) {
    initialProperties = await getPropertiesByIds(urlIds);
  } else {
    // If no query parameters, take top 2 featured properties as helpful sample
    const all = await getProperties();
    initialProperties = all.slice(0, 2);
  }

  return (
    <CompareView
      initialProperties={initialProperties}
      urlIds={urlIds}
    />
  );
}
