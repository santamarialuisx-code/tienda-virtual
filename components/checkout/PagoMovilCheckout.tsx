"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/store/cart";
import { useCurrency } from "@/app/contexts/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import {
  pagomovilSchema,
  venezuelanBanks,
  type PagoMovilFormData,
} from "@/lib/validation";
import type { CheckoutFormData } from "@/lib/validation";

interface PagoMovilCheckoutProps {
  shippingData: CheckoutFormData;
  total: number;
  onPaymentStart: () => void;
  onPaymentEnd: () => void;
}

export function PagoMovilCheckout({
  shippingData,
  total,
  onPaymentStart,
  onPaymentEnd,
}: PagoMovilCheckoutProps) {
  const router = useRouter();
  const { currency, bcvRate } = useCurrency();
  const { clearCart } = useCartStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PagoMovilFormData>({
    resolver: zodResolver(pagomovilSchema),
  });

  const bankInfo = {
    bankName: "Banco de Venezuela",
    accountNumber: "0102-0000-0000-0000-0000",
    phone: "0412-0000000",
    rif: "J-12345678-9",
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const onSubmit = async (data: PagoMovilFormData) => {
    onPaymentStart();
    try {
      // In production, this would create the order in Sanity
      // with status: "pending_confirmation"
      console.log("PagoMóvil payment submitted:", {
        ...data,
        shippingData,
        total,
        currency,
        bcvRate,
      });

      // Clear cart and redirect to pending confirmation page
      clearCart();
      router.push(
        `/orders/success?method=pagomovil&status=pending_confirmation`
      );
    } catch (error) {
      console.error("Error submitting PagoMóvil payment:", error);
      onPaymentEnd();
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 space-y-6">
      <h2 className="text-lg font-semibold">PagoMóvil</h2>

      {/* Instructions */}
      <div className="rounded-lg bg-muted p-4 space-y-3">
        <p className="text-sm">
          Realiza una transferencia bancaria con los siguientes datos:
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Banco:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{bankInfo.bankName}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => copyToClipboard(bankInfo.bankName, "bank")}
              >
                {copiedField === "bank" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Número de cuenta:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {bankInfo.accountNumber}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() =>
                  copyToClipboard(bankInfo.accountNumber, "account")
                }
              >
                {copiedField === "account" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Teléfono:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{bankInfo.phone}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => copyToClipboard(bankInfo.phone, "phone")}
              >
                {copiedField === "phone" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">RIF:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{bankInfo.rif}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => copyToClipboard(bankInfo.rif, "rif")}
              >
                {copiedField === "rif" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="border-t pt-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Monto a transferir:
              </span>
              <span className="text-lg font-bold text-primary">
                {formatPrice(total, currency, bcvRate ?? undefined)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="bankName" className="text-sm font-medium">
            Banco desde el que transferiste *
          </label>
          <select
            id="bankName"
            {...register("bankName")}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={!!errors.bankName}
          >
            <option value="">Selecciona un banco</option>
            {venezuelanBanks.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
          {errors.bankName && (
            <p className="text-sm text-destructive">{errors.bankName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="accountNumber" className="text-sm font-medium">
            Número de cuenta de destino *
          </label>
          <Input
            id="accountNumber"
            {...register("accountNumber")}
            placeholder="0102-0000-0000-0000-0000"
            aria-invalid={!!errors.accountNumber}
          />
          {errors.accountNumber && (
            <p className="text-sm text-destructive">
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="text-sm font-medium">
            Teléfono asociado a la cuenta *
          </label>
          <Input
            id="phoneNumber"
            {...register("phoneNumber")}
            placeholder="0412-0000000"
            aria-invalid={!!errors.phoneNumber}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="reference" className="text-sm font-medium">
            Referencia de la transferencia *
          </label>
          <Input
            id="reference"
            {...register("reference")}
            placeholder="000000"
            aria-invalid={!!errors.reference}
          />
          {errors.reference && (
            <p className="text-sm text-destructive">
              {errors.reference.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Procesando..." : "Ya Realicé el Pago"}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        Tu pedido será procesado una vez que verifiquemos la transferencia. Esto
        puede tomar hasta 24 horas hábiles.
      </p>
    </div>
  );
}
