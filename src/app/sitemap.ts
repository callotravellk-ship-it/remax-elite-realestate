import { MetadataRoute } from "next";
import { getProperties } from "@/lib/propertyService";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getProperties();

  const propertyUrls: MetadataRoute.Sitemap = properties.map((prop) => ({
    url: `${SITE_URL}/properties/${prop.id}`,
    lastModified: new Date(prop.updatedAt || prop.createdAt || new Date()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...propertyUrls,
  ];
}
