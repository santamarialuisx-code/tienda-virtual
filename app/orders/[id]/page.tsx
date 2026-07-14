import { notFound } from "next/navigation";
import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  // In production, fetch order from Sanity
  // For now, show placeholder
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Mis Pedidos
      </Link>

      <div className="text-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Detalle del Pedido</h1>
        <p className="text-muted-foreground mb-6">
          Pedido #{id}
        </p>
        <p className="text-muted-foreground mb-6">
          Esta funcionalidad estará disponible en la Fase 4 (Autenticación).
        </p>
        <Link href="/products">
          <Button>Explorar Productos</Button>
        </Link>
      </div>
    </div>
  );
}
