"use client";

import { useState } from "react";
import { ImageGallery } from "./ImageGallery";
import { VariantSelector } from "./VariantSelector";
import { Breadcrumbs } from "./Breadcrumbs";
import { PriceDisplay } from "./PriceDisplay";
import { QuantitySelector } from "./QuantitySelector";
import { Button } from "@/components/ui/button";
import { Toast, useToast } from "@/components/ui/toast";
import { useCartStore } from "@/lib/store/cart";
import type { Product } from "@/lib/sanity/types";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const addItem = useCartStore((state) => state.addItem);
  const { toast, showToast, hideToast } = useToast();

  const inStock = (product.stock ?? 0) > 0;

  // Get current price based on variant
  const currentPrice = selectedVariant
    ? product.variants?.find((v) => v.name === selectedVariant)?.price ||
      product.price
    : product.price;

  // Get current stock based on variant
  const currentStock = selectedVariant
    ? product.variants?.find((v) => v.name === selectedVariant)?.stock ??
      product.stock ??
      0
    : product.stock ?? 0;

  const handleAddToCart = () => {
    if ((currentStock ?? 0) <= 0) return;

    addItem(
      {
        productId: product._id,
        name: product.name,
        slug: product.slug.current,
        price: currentPrice,
        image: product.images?.[0]
          ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${product.images[0].asset._ref}`
          : undefined,
        variant: selectedVariant,
        stock: currentStock ?? 0,
      },
      quantity
    );

    showToast(`${product.name} agregado al carrito`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          {
            label: "Productos",
            href: "/products",
          },
          ...(product.category
            ? [
                {
                  label: product.category.name,
                  href: `/categories/${product.category.slug.current}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <ImageGallery
          images={product.images || []}
          productName={product.name}
        />

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category */}
          {product.category && (
            <a
              href={`/categories/${product.category.slug.current}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {product.category.name}
            </a>
          )}

          {/* Name */}
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

          {/* Brand */}
          {product.brand && (
            <p className="text-sm text-muted-foreground">
              Marca:{" "}
              <span className="font-medium text-foreground">{product.brand}</span>
            </p>
          )}

          {/* Price */}
          <PriceDisplay
            priceUSD={currentPrice}
            showToggle
            className="text-2xl font-bold"
          />

          {/* Stock */}
          <div>
            {(currentStock ?? 0) > 0 ? (
              <span className="text-sm text-green-600 dark:text-green-400">
                ✓ En stock ({currentStock} disponibles)
              </span>
            ) : (
              <span className="text-sm text-red-600 dark:text-red-400">
                ✗ Agotado
              </span>
            )}
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              onVariantSelect={(variant) =>
                setSelectedVariant(variant?.name)
              }
            />
          )}

          {/* Quantity and Add to Cart */}
          {inStock && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Cantidad:</span>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={currentStock ?? 0}
                />
              </div>

              <Button
                size="xl"
                onClick={handleAddToCart}
                disabled={(currentStock ?? 0) <= 0}
                className="w-full"
              >
                Agregar al Carrito
              </Button>
            </div>
          )}

          {!inStock && (
            <Button size="lg" disabled className="w-full">
              Agotado
            </Button>
          )}

          {/* Description */}
          {product.description && (
            <div className="pt-4 border-t">
              <h2 className="font-medium mb-2">Descripción</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} onClose={hideToast} />}
    </div>
  );
}
