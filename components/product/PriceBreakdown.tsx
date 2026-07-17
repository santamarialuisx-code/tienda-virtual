"use client";

import { formatUSD } from "@/lib/currency";

interface PriceBreakdownProps {
  basePrice: number;
  customizationFee?: number;
  className?: string;
}

export function PriceBreakdown({
  basePrice,
  customizationFee = 0,
  className,
}: PriceBreakdownProps) {
  const total = basePrice + customizationFee;

  return (
    <div className={className}>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Precio base</span>
          <span>{formatUSD(basePrice)}</span>
        </div>
        {customizationFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Costo de personalización</span>
            <span>{formatUSD(customizationFee)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold pt-1 border-t">
          <span>Total</span>
          <span>{formatUSD(total)}</span>
        </div>
      </div>
    </div>
  );
}
