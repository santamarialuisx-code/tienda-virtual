import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Parece que aún no has agregado ningún producto a tu carrito. ¡Explora
        nuestros productos y encuentra algo que te guste!
      </p>
      <Link href="/products">
        <Button size="lg">Explorar Productos</Button>
      </Link>
    </div>
  );
}
