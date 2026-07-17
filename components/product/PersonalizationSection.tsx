"use client";

import { useState, useCallback, useMemo } from "react";
import { ColorSwatches } from "./ColorSwatches";
import { SizeSelector } from "./SizeSelector";
import { CustomTextInput } from "./CustomTextInput";
import { ComplexityTierSelector } from "./ComplexityTierSelector";
import { PriceBreakdown } from "./PriceBreakdown";
import { CustomizationReview } from "./CustomizationReview";
import { Button } from "@/components/ui/button";
import type {
  Product,
  CustomizationData,
  PersonalizationOptions,
} from "@/lib/sanity/types";

interface PersonalizationSectionProps {
  product: Product;
  onCustomize: (data: CustomizationData) => void;
}

export function PersonalizationSection({
  product,
  onCustomize,
}: PersonalizationSectionProps) {
  const options: PersonalizationOptions | undefined =
    product.personalizationOptions;

  // Smart defaults: pre-select first color and "M" if available
  const [selectedColor, setSelectedColor] = useState<string>(
    options?.colors?.[0] ?? ""
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    options?.sizes?.includes("M")
      ? "M"
      : options?.sizes?.[0] ?? ""
  );
  const [customText, setCustomText] = useState<string>("");
  const [selectedTier, setSelectedTier] = useState<
    { tier: string; fee: number } | undefined
  >(undefined);

  const customizationFee = selectedTier?.fee ?? 0;

  const customizationData: CustomizationData = useMemo(
    () => ({
      color: selectedColor || undefined,
      size: selectedSize || undefined,
      text: customText || undefined,
      tier: (selectedTier?.tier as CustomizationData["tier"]) ?? undefined,
      fee: selectedTier?.fee,
    }),
    [selectedColor, selectedSize, customText, selectedTier]
  );

  const handleTierSelect = useCallback((tier: string, fee: number) => {
    setSelectedTier({ tier, fee });
  }, []);

  const handleSubmit = useCallback(() => {
    onCustomize(customizationData);
  }, [customizationData, onCustomize]);

  const hasOptions =
    (options?.colors && options.colors.length > 0) ||
    (options?.sizes && options.sizes.length > 0) ||
    (options?.complexityTiers && options.complexityTiers.length > 0);

  if (!hasOptions) {
    return null;
  }

  return (
    <div className="space-y-6 border-t pt-6">
      <h2 className="text-lg font-semibold">Personalizá tu producto</h2>

      {/* Progressive disclosure: color/size first */}
      {options?.colors && options.colors.length > 0 && (
        <ColorSwatches
          colors={options.colors}
          selectedColor={selectedColor}
          onSelect={setSelectedColor}
        />
      )}

      {options?.sizes && options.sizes.length > 0 && (
        <SizeSelector
          sizes={options.sizes}
          selectedSize={selectedSize}
          onSelect={setSelectedSize}
        />
      )}

      {/* Text input */}
      <CustomTextInput
        value={customText}
        onChange={setCustomText}
      />

      {/* Complexity tier */}
      {options?.complexityTiers && options.complexityTiers.length > 0 && (
        <ComplexityTierSelector
          tiers={options.complexityTiers}
          selectedTier={selectedTier?.tier}
          onSelect={handleTierSelect}
        />
      )}

      {/* Price breakdown */}
      <PriceBreakdown
        basePrice={product.price}
        customizationFee={customizationFee}
      />

      {/* Review */}
      <CustomizationReview
        customization={customizationData}
        basePrice={product.price}
      />

      {/* CTA */}
      <Button
        size="xl"
        onClick={handleSubmit}
        className="w-full"
      >
        Agregar al Carrito
      </Button>
    </div>
  );
}
