"use client";

import { useCurrency } from "@/app/contexts/CurrencyContext";
import { formatUSD, formatBs, convertToBs } from "@/lib/currency";

interface PriceDisplayProps {
  priceUSD: number;
  showToggle?: boolean;
  className?: string;
}

export function PriceDisplay({
  priceUSD,
  showToggle = false,
  className,
}: PriceDisplayProps) {
  const { currency, bcvRate, toggleCurrency } = useCurrency();

  const displayPrice =
    currency === "USD" ? formatUSD(priceUSD) : formatBs(convertToBs(priceUSD, bcvRate ?? 36.5));

  return (
    <span className={className}>
      {displayPrice}
      {showToggle && (
        <button
          onClick={toggleCurrency}
          className="ml-2 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
          title="Cambiar moneda"
        >
          {currency === "USD" ? "Bs." : "USD"}
        </button>
      )}
    </span>
  );
}
