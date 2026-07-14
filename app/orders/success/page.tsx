import Link from "next/link";
import { CheckCircle, Clock, CreditCard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderSuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const params = await searchParams;
  const orderId = typeof params.orderId === "string" ? params.orderId : null;
  const method = typeof params.method === "string" ? params.method : "paypal";
  const status = typeof params.status === "string" ? params.status : "paid";

  const isPending = status === "pending_confirmation";

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto mb-6">
          {isPending ? (
            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-6">
              <Clock className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
            </div>
          ) : (
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">
          {isPending ? "¡Pedido Recibido!" : "¡Pedido Completado!"}
        </h1>

        {/* Message */}
        <p className="text-muted-foreground mb-8">
          {isPending
            ? "Hemos recibido tu pedido. Una vez que verifiquemos la transferencia, comenzaremos a prepararlo."
            : "Gracias por tu compra. Tu pedido ha sido procesado exitosamente."}
        </p>

        {/* Order Info */}
        <div className="rounded-lg border bg-card p-6 mb-8 text-left space-y-4">
          {orderId && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Número de pedido:</span>
              <span className="font-mono font-medium">{orderId}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-muted-foreground">Método de pago:</span>
            <div className="flex items-center gap-2">
              {method === "paypal" ? (
                <>
                  <CreditCard className="h-4 w-4" />
                  <span>PayPal</span>
                </>
              ) : (
                <>
                  <Smartphone className="h-4 w-4" />
                  <span>PagoMóvil</span>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Estado:</span>
            <span className="capitalize">
              {isPending ? "Pendiente de confirmación" : "Pagado"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button size="lg">Seguir Comprando</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
