import type { MetadataRoute } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { client } from "@/lib/sanity/client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://tienda-virtual.vercel.app";

// Only fetch from Sanity if credentials are configured
const hasSanityConfig = !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

async function getProducts(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  if (!hasSanityConfig) return [];
  try {
    const products = await client.fetch<{ slug: string; updatedAt: string }[]>(
      `*[_type == "product" && isActive == true] {
        "slug": slug.current,
        "updatedAt": _updatedAt
      }`
    );

    return products.map((product) => ({
      url: `${BASE_URL}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    return [];
  }
}

async function getCategories(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  if (!hasSanityConfig) return [];
  try {
    const categories = await client.fetch<{ slug: string; updatedAt: string }[]>(
      `*[_type == "category"] {
        "slug": slug.current,
        "updatedAt": _updatedAt
      }`
    );

    return categories.map((category) => ({
      url: `${BASE_URL}/categories/${category.slug}`,
      lastModified: new Date(category.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  return [...staticPages, ...products, ...categories];
}
