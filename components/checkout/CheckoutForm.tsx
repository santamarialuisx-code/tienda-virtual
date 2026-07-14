"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  checkoutFormSchema,
  type CheckoutFormData,
} from "@/lib/validation";

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
}

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-lg border bg-card p-6 space-y-6"
    >
      <h2 className="text-lg font-semibold">Información de Envío</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nombre completo *
          </label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Juan Pérez"
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Correo electrónico *
          </label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="juan@ejemplo.com"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Teléfono *
          </label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="+58 412 1234567"
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="state" className="text-sm font-medium">
            Estado *
          </label>
          <Input
            id="state"
            {...register("state")}
            placeholder="Caracas"
            aria-invalid={!!errors.state}
          />
          {errors.state && (
            <p className="text-sm text-destructive">{errors.state.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">
            Ciudad *
          </label>
          <Input
            id="city"
            {...register("city")}
            placeholder="Caracas"
            aria-invalid={!!errors.city}
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="address" className="text-sm font-medium">
            Dirección completa *
          </label>
          <Input
            id="address"
            {...register("address")}
            placeholder="Av. Principal, Edif. 123, Piso 4, Apto 8"
            aria-invalid={!!errors.address}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notas adicionales (opcional)
          </label>
          <textarea
            id="notes"
            {...register("notes")}
            placeholder="Instrucciones de entrega, referencias, etc."
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
          />
        </div>
      </div>
    </form>
  );
}
