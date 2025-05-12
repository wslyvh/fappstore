import { getCatalogData } from "@/clients/neynar";
import { APP_URL, CATEGORIES } from "@/utils/config";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalogData();

  return [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${APP_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.9,
    },
    ...CATEGORIES.map((category) => ({
      url: `${APP_URL}/c/${category.id}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
    ...catalog.apps.map((app) => ({
      url: `${APP_URL}/app/${app.id}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
