"use client";

import { formatUSD } from "@/lib/currency";
import type { CustomizationData } from "@/lib/sanity/types";

interface CustomizationReviewProps {
  customization: CustomizationData;
  basePrice: number;
}

const TIER_LABELS: Record<string, string> = {
  basic: "Básico",
  medium: "Medio",
  complex: "Complejo",
};

export function CustomizationReview({
  customization,
  basePrice,
}: CustomizationReviewProps) {
  const hasData =
    customization.color ||
    customization.size ||
    customization.text ||
    customization.tier;

  if (!hasData) {
    return null;
  }

  const total = basePrice + (customization.fee ?? 0);

  return (
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="text-sm font-medium">Resumen de personalización</h3>
      <dl className="space-y-1 text-sm">
        {customization.color && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Color</dt>
            <dd className="flex items-center gap-2">
              <span
                className="size-3 rounded-full border"
                style={{ backgroundColor: customization.color }}
              />
              {customization.color}
            </dd>
          </div>
        )}
        {customization.size && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Talla</dt>
            <dd>{customization.size}</dd>
          </div>
        )}
        {customization.text && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Texto</dt>
            <dd>&ldquo;{customization.text}&rdquo;</dd>
          </div>
        )}
        {customization.tier && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Complejidad</dt>
            <dd>
              {TIER_LABELS[customization.tier] ?? customization.tier}
              {customization.fee ? ` (+${formatUSD(customization.fee)})` : ""}
            </dd>
          </div>
        )}
      </dl>
      <div className="flex justify-between font-bold text-base pt-2 border-t">
        <span>Total</span>
        <span>{formatUSD(total)}</span>
      </div>
    </div>
  );
}
