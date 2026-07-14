// Currency conversion service using BCV rate from ve.dolarapi.com
// Default currency is USD, user can toggle to Bs.

const DOLAR_API_URL = "https://ve.dolarapi.com/v1/dolares";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CachedRate {
  rate: number;
  timestamp: number;
}

let cachedRate: CachedRate | null = null;

export async function fetchBcvRate(): Promise<number> {
  // Return cached rate if valid
  if (cachedRate && Date.now() - cachedRate.timestamp < CACHE_TTL_MS) {
    return cachedRate.rate;
  }

  try {
    const response = await fetch(DOLAR_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch BCV rate: ${response.status}`);
    }

    const data = await response.json();
    // The BCV rate is in data[0].promedio
    const rate = data?.[0]?.promedio;
    if (typeof rate !== "number" || rate <= 0) {
      throw new Error("Invalid BCV rate received");
    }

    cachedRate = { rate, timestamp: Date.now() };
    return rate;
  } catch (error) {
    // If we have a stale cache, use it as fallback
    if (cachedRate) {
      console.warn("Using stale BCV rate due to fetch error:", error);
      return cachedRate.rate;
    }
    // Last resort: return a reasonable default
    console.error("BCV rate fetch failed, using fallback:", error);
    return 36.5; // Approximate fallback rate
  }
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatBs(amount: number): string {
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function convertToBs(usdAmount: number, rate: number): number {
  return usdAmount * rate;
}

export function formatPrice(
  amount: number,
  currency: "USD" | "Bs.",
  rate?: number
): string {
  if (currency === "USD") {
    return formatUSD(amount);
  }
  if (rate !== undefined) {
    return formatBs(convertToBs(amount, rate));
  }
  return formatUSD(amount);
}
