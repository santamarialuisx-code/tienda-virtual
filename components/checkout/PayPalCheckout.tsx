"use client";

import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import type { CheckoutFormData } from "@/lib/validation";

interface PayPalCheckoutProps {
  shippingData: CheckoutFormData;
  total: number;
  onPaymentStart: () => void;
  onPaymentEnd: () => void;
}

function PayPalButtonsWrapper({
  shippingData,
  total,
  onPaymentStart,
  onPaymentEnd,
}: PayPalCheckoutProps) {
  const router = useRouter();
  const [{ isPending }] = usePayPalScriptReducer();
  const { clearCart } = useCartStore();

  const createOrder = async () => {
    onPaymentStart();
    // In production, this would call your API to create a PayPal order
    // For now, we'll use the client-side approach
    return "placeholder-order-id";
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      // In production, this would call your API to capture the payment
      // and create the order in Sanity
      console.log("PayPal order approved:", data.orderID);
      console.log("Shipping data:", shippingData);
      console.log("Total:", total);

      // Clear cart and redirect to success page
      clearCart();
      router.push(
        `/orders/success?orderId=${data.orderID}&method=paypal`
      );
    } catch (error) {
      console.error("Error processing PayPal payment:", error);
      onPaymentEnd();
    }
  };

  const onError = (error: Record<string, unknown>) => {
    console.error("PayPal error:", error);
    onPaymentEnd();
  };

  const onCancel = () => {
    console.log("PayPal payment cancelled");
    onPaymentEnd();
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <PayPalButtons
      style={{ layout: "vertical" }}
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
      onCancel={onCancel}
    />
  );
}

export function PayPalCheckout({
  shippingData,
  total,
  onPaymentStart,
  onPaymentEnd,
}: PayPalCheckoutProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="rounded-lg border bg-destructive/10 p-4 text-destructive">
        PayPal no está configurado. Por favor, contacta al administrador.
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Pagar con PayPal</h2>
        <PayPalButtonsWrapper
          shippingData={shippingData}
          total={total}
          onPaymentStart={onPaymentStart}
          onPaymentEnd={onPaymentEnd}
        />
      </div>
    </PayPalScriptProvider>
  );
}
