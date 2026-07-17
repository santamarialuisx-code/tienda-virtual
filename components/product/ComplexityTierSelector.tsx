"use client";

import { cn } from "@/lib/utils";
import { formatUSD } from "@/lib/currency";
import { TIER_LABELS, TIER_DESCRIPTIONS } from "@/lib/constants";
import type { ComplexityTier } from "@/lib/sanity/types";

interface ComplexityTierSelectorProps {
  tiers: ComplexityTier[];
  selectedTier: string | undefined;
  onSelect: (tier: string, fee: number) => void;
}

export function ComplexityTierSelector({
  tiers,
  selectedTier,
  onSelect,
}: ComplexityTierSelectorProps) {
  if (!tiers || tiers.length === 0) {
    return null;
  }

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">
        Nivel de complejidad
      </label>
      <div className="space-y-2">
        {tiers.map((tier) => (
          <label
            key={tier.tier}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
              "hover:bg-muted/50",
              selectedTier === tier.tier
                ? "border-foreground bg-muted/30"
                : "border-border"
            )}
          >
            <input
              type="radio"
              name="complexity-tier"
              value={tier.tier}
              checked={selectedTier === tier.tier}
              onChange={() => onSelect(tier.tier, tier.fee)}
              className="size-4 shrink-0 accent-primary"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {TIER_LABELS[tier.tier] ?? tier.tier}
                </span>
                <span className="text-sm text-muted-foreground">
                  (+{formatUSD(tier.fee)})
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {TIER_DESCRIPTIONS[tier.tier] ?? ""}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
