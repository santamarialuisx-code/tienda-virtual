"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { fetchBcvRate } from "@/lib/currency";

type Currency = "USD" | "Bs.";

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  setCurrency: (c: Currency) => void;
  bcvRate: number | null;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

const STORAGE_KEY = "tienda-virtual-currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [bcvRate, setBcvRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted currency preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "USD" || stored === "Bs.") {
        setCurrencyState(stored);
      }
    } catch {
      // localStorage not available (SSR)
    }
  }, []);

  // Fetch BCV rate
  useEffect(() => {
    fetchBcvRate()
      .then(setBcvRate)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrencyState((prev) => {
      const next = prev === "USD" ? "Bs." : "USD";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // ignore
    }
  }, []);

  return (
    <CurrencyContext.Provider
      value={{ currency, toggleCurrency, setCurrency, bcvRate, isLoading }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
