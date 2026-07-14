"use client";

import Image from "next/image";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { calculateShipping, calculateTax, getOrderTotal } from "@/lib/shipping";
import type { CartItem } from "@/lib/store/cart";
import { formatPrice } from "@/lib/currency";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  currency: "USD" | "Bs.";
  bcvRate: number | null;
  paymentMethod: "paypal" | "pagomovil";
  shippingData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  } | null;
}

export function OrderSummary({
  items,
  subtotal,
  currency,
  bcvRate,
  paymentMethod,
  shippingData,
}: OrderSummaryProps) {
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  const total = getOrderTotal(subtotal, shipping, tax);

  return (
    <div className="rounded-lg border bg-card p-6 space-y-6 sticky top-24">
      <h2 className="text-lg font-semibold">Resumen del Pedido</h2>

      {/* Items */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variant || ""}`}
            className="flex gap-3"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                  Sin imagen
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">{item.name}</p>
              {item.variant && (
                <p className="text-xs text-muted-foreground">{item.variant}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {item.quantity} x {formatPrice(item.price, currency, bcvRate ?? undefined)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({items.length} {items.length === 1 ? "artículo" : "artículos"})
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

      {/* Shipping Info */}
      {shippingData && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Enviar a:</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{shippingData.name}</p>
            <p>{shippingData.address}</p>
            <p>
              {shippingData.city}, {shippingData.state}
            </p>
            <p>{shippingData.email}</p>
            <p>{shippingData.phone}</p>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-2">Método de Pago:</h3>
        <p className="text-sm text-muted-foreground capitalize">
          {paymentMethod === "paypal" ? "PayPal" : "PagoMóvil"}
        </p>
      </div>
    </div>
  );
}
