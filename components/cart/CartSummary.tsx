"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { useCartStore } from "@/lib/store/cart";
import { calculateShipping, calculateTax, getOrderTotal } from "@/lib/shipping";

export function CartSummary() {
  const { items, getTotals } = useCartStore();
  const { subtotal, itemCount } = getTotals();

  if (itemCount === 0) return null;

  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  const total = getOrderTotal(subtotal, shipping, tax);

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <h2 className="text-lg font-semibold">Resumen del Pedido</h2>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? "artículo" : "artículos"})
          </span>
          <PriceDisplay priceUSD={subtotal} className="font-medium" />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Envío</span>
          {shipping === 0 ? (
            <span className="text-green-600 dark:text-green-400 font-medium">
              ¡Gratis!
            </span>
          ) : (
            <PriceDisplay priceUSD={shipping} className="font-medium" />
          )}
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Impuestos</span>
          <span className="font-medium">Sin impuestos</span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <PriceDisplay priceUSD={total} className="text-lg font-bold" />
          </div>
        </div>
      </div>

      <Link href="/checkout" className="block">
        <Button className="w-full" size="xl">
          Ir a Pagar
        </Button>
      </Link>

      <Link
        href="/products"
        className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Seguir Comprando
      </Link>
    </div>
  );
}
