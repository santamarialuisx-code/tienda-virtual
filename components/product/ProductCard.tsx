"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "./PriceDisplay";
import { useCartStore } from "@/lib/store/cart";
import { useToast, Toast } from "@/components/ui/toast";
import type { ProductListItem } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toast, showToast, hideToast } = useToast();
  const imageUrl = product.images
    ? urlFor(product.images).width(400).height(400).url()
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();

    if (product.stock <= 0) return;

    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug.current,
      price: product.price,
      image: imageUrl || undefined,
      stock: product.stock,
    });

    showToast(`${product.name} agregado al carrito`);
  };

  return (
    <Link
      href={`/products/${product.slug.current}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-all hover:ring-foreground/20 hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              Sin imagen
            </div>
          )}

          {/* Category badge */}
          {product.category && (
            <div className="absolute top-2 left-2">
              <Badge
                variant="secondary"
                className="bg-background/80 backdrop-blur-sm"
              >
                {product.category.name}
              </Badge>
            </div>
          )}

          {/* Out of stock overlay */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Badge variant="destructive">Agotado</Badge>
            </div>
          )}

          {/* Add to cart button */}
          {product.stock > 0 && (
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                onClick={handleAddToCart}
                className="h-11 w-11 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
                aria-label={`Agregar ${product.name} al carrito`}
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {product.brand && (
            <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
          )}

          <PriceDisplay
            priceUSD={product.price}
            className="text-base font-semibold"
          />
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} onClose={hideToast} />}
    </Link>
  );
}
