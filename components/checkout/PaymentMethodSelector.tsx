"use client";

import { CreditCard, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodSelectorProps {
  value: "paypal" | "pagomovil";
  onChange: (method: "paypal" | "pagomovil") => void;
  isProcessing: boolean;
}

export function PaymentMethodSelector({
  value,
  onChange,
  isProcessing,
}: PaymentMethodSelectorProps) {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <h2 className="text-lg font-semibold">Método de Pago</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* PayPal Option */}
        <button
          type="button"
          onClick={() => onChange("paypal")}
          disabled={isProcessing}
          className={cn(
            "flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-all",
            value === "paypal"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50",
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full",
              value === "paypal" ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">PayPal</p>
            <p className="text-sm text-muted-foreground">
              Pago seguro y rápido
            </p>
          </div>
        </button>

        {/* PagoMóvil Option */}
        <button
          type="button"
          onClick={() => onChange("pagomovil")}
          disabled={isProcessing}
          className={cn(
            "flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-all",
            value === "pagomovil"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50",
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full",
              value === "pagomovil"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">PagoMóvil</p>
            <p className="text-sm text-muted-foreground">
              Transferencia bancaria
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
