"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { useCurrency } from "@/app/contexts/CurrencyContext";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { EmptyCart } from "@/components/cart/EmptyCart";
import type { CheckoutFormData, PagoMovilFormData } from "@/lib/validation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotals } = useCartStore();
  const { currency, bcvRate } = useCurrency();
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "pagomovil">(
    "paypal"
  );
  const [shippingData, setShippingData] = useState<CheckoutFormData | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const { subtotal, itemCount } = getTotals();

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyCart />
      </div>
    );
  }

  const handleCheckoutSubmit = (data: CheckoutFormData) => {
    setShippingData(data);
  };

  const handlePagoMovilSubmit = (data: PagoMovilFormData) => {
    // This will be handled by the PagoMovil component
    console.log("PagoMóvil data:", data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Form */}
          <CheckoutForm onSubmit={handleCheckoutSubmit} />

          {/* Payment Method */}
          <PaymentMethodSelector
            value={paymentMethod}
            onChange={setPaymentMethod}
            isProcessing={isProcessing}
          />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            currency={currency}
            bcvRate={bcvRate}
            paymentMethod={paymentMethod}
            shippingData={shippingData}
          />
        </div>
      </div>
    </div>
  );
}
