import { createClient } from "@sanity/client";

const isConfigured = !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "invalid",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

// Safe fetch wrapper that returns empty results when Sanity is not configured
export async function safeFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  if (!isConfigured) {
    // Return sensible defaults based on the expected return type
    return ([] as unknown as T);
  }
  try {
    if (params) {
      return await client.fetch<T>(query, params);
    }
    return await client.fetch<T>(query);
  } catch (error) {
    console.warn("Sanity fetch failed:", error);
    return ([] as unknown as T);
  }
}
