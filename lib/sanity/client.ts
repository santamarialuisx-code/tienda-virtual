import { createClient, type SanityClient } from "@sanity/client";

let _client: SanityClient | null = null;

function getClient(): SanityClient {
  if (!_client) {
    _client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "invalid",
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2024-01-01",
      useCdn: true,
    });
  }
  return _client;
}

// Safe fetch wrapper that returns empty results when Sanity is not configured
export async function safeFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return ([] as unknown as T);
  }
  try {
    const client = getClient();
    if (params) {
      return await client.fetch<T>(query, params);
    }
    return await client.fetch<T>(query);
  } catch (error) {
    console.warn("Sanity fetch failed:", error);
    return ([] as unknown as T);
  }
}

// Export client for direct use (queries.ts uses client.fetch and client.create)
// Proxy with proper `this` binding so methods work correctly
export const client: SanityClient = new Proxy({} as SanityClient, {
  get(_, prop) {
    const target = getClient();
    const value = Reflect.get(target, prop);
    // Bind methods to the real client so `this` is correct
    if (typeof value === "function") {
      return value.bind(target);
    }
    return value;
  },
});
