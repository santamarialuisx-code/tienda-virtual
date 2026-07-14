import Link from "next/link";
import { redirect } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { getServerSession } from "@/lib/auth/helpers";
import { getOrdersByEmail } from "@/lib/sanity/queries";
import { Button } from "@/components/ui/button";
import { Package, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/currency";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  pending_confirmation: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  pending_confirmation: "Pendiente de Confirmación",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

async function getCachedOrdersByEmail(email: string, page: number, limit: number) {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300 });
  cacheTag("user-data");
  return getOrdersByEmail(email, page, limit);
}

export default async function AccountOrdersPage() {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect("/auth/login");
  }
  
  const { orders, total } = await getCachedOrdersByEmail(session.user.email!, 1, 100);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mis Pedidos</h1>
            <p className="text-muted-foreground mt-2">
              Historial de tus compras
            </p>
          </div>
          <Link href="/account">
            <Button variant="outline">Volver a Mi Cuenta</Button>
          </Link>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-12 rounded-lg border bg-card">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Aún no tienes pedidos
            </p>
            <Link href="/products">
              <Button>Explorar Productos</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                className="block rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm">{order._id}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusColors[order.status]
                        }`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("es-VE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} {order.items.length === 1 ? "artículo" : "artículos"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {order.paymentMethod === "paypal" ? "PayPal" : "PagoMóvil"}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}